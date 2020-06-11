
import * as config from '../config';
import Store from 'nxkit/store';
import {make} from 'webpkit/lib/store';

export const store = new Store(config.app.appId);

export function initialize() {
	return make({ url: `http://127.0.0.1:8091/service-api`, store });
}

export default store.core;