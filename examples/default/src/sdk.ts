
import * as config from '../config';
import Store from 'nxkit/store';
import {make} from 'webpkit/lib/store';

export const store = new Store('examples/default');

export function initialize() {
	return make({ url: config.serviceAPI, store });
}

export default store.core;