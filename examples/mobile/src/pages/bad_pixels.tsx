
import { React, NavPage, dialog } from 'webpkit/mobile';

export default class extends NavPage {

	state = { colors: ['#f00', '#fff', '#0f0', '#00f', '#000'], index: 0 };

	m_click_handle = ()=>{
		this.state.index++;
		if (this.state.index < this.state.colors.length) {
			this.setState({ index: this.state.index });
		} else {
			dialog.confirm('是否继续？', e=>{
				if (e) {
					this.setState({ index: 0 });
				} else {
					this.popPage(true);
				}
			});
		}
	}

	render() {
		return (
			<div className="index"> 
				style={{ background: this.state.colors[this.state.index] }}
				onClick={this.m_click_handle}>
			</div>
		);
	}

}
