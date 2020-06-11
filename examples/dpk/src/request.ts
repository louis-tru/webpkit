
import * as config from '../config';
import { Params, Options } from 'nxkit/request';
import { Request as RequestBase } from 'dphoto-lib/request';
import { store } from './sdk';
import storage from './storage';

class Request extends RequestBase {
	async request(name: string, method: string = 'GET', params?: Params, options?: Options) {
		return super.request(name, method, {space_id: config.space_id, ...params}, options);
	}
}

var app = new Request(config.prefixer, store, storage);

app.urlencoded = false;

export default app;