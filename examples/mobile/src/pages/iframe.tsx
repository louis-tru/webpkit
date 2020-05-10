
import { React, NavPage } from 'webpkit/mobile';
import '../css/webgl.css';

export default class extends NavPage<{url?: string; auto?: boolean}> {
	state = { url: this.params.url || '' };

	m_click_handle_1 = ()=>{
		this.popPage(true);
	}

	async triggerLoad() {
		if (this.params.auto) {
			setTimeout(()=>this.popPage(true), 6e4);
		}
	}

	render() {
		var url = 'http://webglsamples.org/aquarium/aquarium.html';
		if (this.state.url)
			url = decodeURIComponent(this.state.url);
		return (
			<div className="webgl">
				<div className="img_close" onClick={this.m_click_handle_1}>Close</div>

				<div className="content">
					<iframe 
						frameBorder="no"
						marginWidth={0}
						marginHeight={0}
						src={url}
						style={{ width: '100%', height: '100%' }}></iframe>
				</div>

			</div>
		);
	}

}
