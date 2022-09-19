
import utils from 'somes';
import {IBuffer} from 'somes/buffer';
import {Request as RequestBase ,Params,Options, Signer, Result} from 'somes/request';
import {IStorage} from 'somes/storage';

export class Request extends RequestBase {

	private _storage: IStorage;

	constructor(url: string, storage: IStorage, signer?: Signer) {
		super(url);
		this._storage = storage;
		if (signer)
			this.signer = signer;
	}

	parseResponseData(buf: IBuffer, r: Result) {
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

	withoutErr(hold: any, fullname: string, useCacheAfterEetry = Infinity/**/, interval = 5e3) {
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
				var key = '_callApi_' + name + Object.hashCode(params);

				handle.cancel = function() {
					if (!ok) {
						ok = true;
						reject(Error.new(`cancel request, ${name}`));
					}
				};

				while(!ok) {
					try {
						var data = await self.request(name, options?.method, params, options);
						if (!ok) {
							if (useCacheAfterEetry !== Infinity) {
								self._storage.set(key, data);
							}
							ok = true; resolve(data);
						}
						break;
					} catch(err: any) {
						if (ok) {
							break;
						} else if (useCacheAfterEetry === 0) {
							data = await self._storage.get(key);
							if (data) { // use cache
								data.cached = true;
								ok = true; resolve(data);
								break;
							}
						}
						console.warn(err);
					}

					if (useCacheAfterEetry) {
						useCacheAfterEetry--;
					}
					await utils.sleep(interval); // 5s retry
				}
			});
		}
	}

	async useCacheAfterErr(
		name: string,
		params?: Params,
		options?: Options,
	) {
		var data: Result;
		var key = '_callApi_' + name + Object.hashCode(params);
		try {
			data = await this.request(name, options?.method, params, options);
			this._storage.set(key, data);
		} catch(err: any) {
			data = await this._storage.get(key);
			if (!data)
				throw err;
			data.cached = true;
		}
		return data;
	}

}