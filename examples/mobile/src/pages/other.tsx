
import Header from '../util/header';
import { React, NavPage } from 'webpkit/mobile';

export default class extends NavPage {

	private urls = [
		'http://webglsamples.org/aquarium/aquarium.html',
		'http://www.jq22.com/demo/LiquidDistortion-master201710131110',
		'http://acko.net/',
		'https://alteredqualia.com/three/examples/webgl_terrain_dynamic.html',
		'http://demo.sc.chinaz.com//Files/DownLoad/webjs1/201310/jiaoben1532/',
		'http://demo.sc.chinaz.com//Files/DownLoad/webjs1/201509/jiaoben3635/',
	];

	private _url(index: number) {
		var url = this.urls[index] || this.urls[0];
		return `iframe?url=${encodeURIComponent(url)}`;
	}

	render() {
		return (
			<div className="index">
				<Header title="Other" page={this} />
				<div className="_btn" onClick={e=>this.pushPage('photo', true)}>Photo Test</div>
				<div className="_btn" onClick={e=>this.pushPage('details', true)}>Details</div>
				<div className="_btn" onClick={e=>this.pushPage('ethereum', true)}>Ethereum</div>
				<div className="_btn" onClick={e=>this.pushPage(this._url(0), true)}>WebGL</div>
				<div className="_btn" onClick={e=>this.pushPage(this._url(1), true)}>WebGL2</div>
				<div className="_btn" onClick={e=>this.pushPage(this._url(2), true)}>WebGL3</div>
				<div className="_btn" onClick={e=>this.pushPage(this._url(3), true)}>WebGL4</div>
				<div className="_btn" onClick={e=>this.pushPage(this._url(4), true)}>Photo switch</div>
				<div className="_btn" onClick={e=>this.pushPage(this._url(5), true)}>Photo switch2</div>
			</div>
		);
	}

}
