/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import {React} from '../lib';
import {Layer} from './ctr';
import './dialog.css';

export class Dialog<P = {}> extends Layer<P> {
	render() {
		return (
			<div className="iso_dialog">
			</div>
		);
	}
}