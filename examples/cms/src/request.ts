
import * as config from '../config';
import { Params, Options } from 'nxkit/request';
import { Request as RequestBase } from 'webpkit/lib/request';
import storage from 'nxkit/storage';

class Request extends RequestBase {
	async request(name: string, method: string = 'GET', params?: Params, options?: Options) {
		return super.request(name, method, { ...params }, options);
	}
}

var app = new Request(config.prefixer, storage.shared);

app.urlencoded = false;

export default app;