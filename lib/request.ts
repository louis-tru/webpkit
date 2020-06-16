
import utils from 'nxkit';
import {IBuffer} from 'nxkit/buffer';
import {Request as RequestBase ,Params,Options, Signer} from 'nxkit/request';
import {IStorage} from 'nxkit/storage';

export class Request extends RequestBase {

	private _storage: IStorage;

	constructor(url: string, storage: IStorage, signer?: Signer) {
		super(url);
		this._storage = storage;
		if (signer)
			this.signer = signer;
	}

	parseResponseData(buf: IBuffer) {
		var json = buf.toString('utf8');
		var res = JSON.parse(json);
		if (res.code == 200) {
			return res.data;
		} else {
			res.errno = res.code;
			res.message = res.message || res.error || res.msg;
			throw Error.new(res);
		}
	}

	withoutErr(hold: any, fullname: string) {
		utils.assert(hold && typeof hold == 'object');

		var self = this;
		var handle = hold['__withoutErr_' + fullname];
		if (handle) {
			if (handle.cancel)
				handle.cancel();
		} else {
			hold['__withoutErr_' + fullname] = handle = {};
		}

		var name = fullname.split('#')[0];

		return function(params?: Params, options?: Options) { // get
			return new Promise<any>(async function(resolve, reject) {
				var ok = false;
				handle.cancel = function() {
					if (!ok) {
						ok = true;
						reject(Error.new(`cancel request, ${name}`));
					}
				};
				while(!ok) {
					try {
						var r = await self.get(name, params, options);
						if (!ok) {
							ok = true;
							resolve(r);
						}
						break;
					} catch(err) {
						console.warn(err);
					}
					await utils.sleep(5e3); // 5s retry
				}
			});
		}
	}

	async useCacheAfterError(
		name: string,
		params?: Params,
		options?: Options,
	) {
		var data = null;
		var key = '_callApi_' + name + Object.hashCode(params);
		try {
			var {data} = await this.get(name, params, options);
			this._storage.set(key, data);
		} catch(err) {
			data = this._storage.get(key);
			if (!data)
				throw err;
		}
		return {data};
	}

}