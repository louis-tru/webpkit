
import Header from '../util/header';
import { React, NavPage } from 'webpkit/mobile';
import req from 'somes/request';
import '../css/photo.css';
import path from 'somes/path';

export default class extends NavPage {

	state = { photo: [], img: '', };

	async triggerLoad() {
		var ls = [];
		var hostname = 'http://127.0.0.1:8091';
		var {data} = await req.get(`${hostname}/fm/photoList`);
		ls = JSON.parse(data+'').data as any[];
		ls = ls.map(e=>`${hostname}/fm/res/${e}`).filter(e=>{
			if (/\.(png|jpg|jpeg|gif)/i.test(path.extname(e))) {
				return true;
			}
		});
		this.setState({ photo: ls });
	}

	m_click_handle_0 = (e: any)=>{
		var src = e.currentTarget.src;
		this.setState({ img: src });
	}

	m_click_handle_1 = (e: any)=>{
		this.setState({ img: '' });
	}

	render() {
		var { photo, img } = this.state;
		return (
			<div className="photo">
				<Header title="Photo Test" page={this} />

				<div className="ul" style={{ visibility: img ? 'hidden': undefined }}>
					{
						photo.map((e,j)=><img onClick={this.m_click_handle_0} key={j} src={e} />)
					}
				</div>

				{ img ? <div className="img_close" onClick={this.m_click_handle_1}>Close</div>: null }
				{
					img ? 
					<div className="scroll img">
						<img src={img} />
					</div>
					: null
				}
			</div>
		);
	}

}
