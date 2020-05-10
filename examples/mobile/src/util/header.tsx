
import { React, NavPage } from 'webpkit/mobile';
import { ViewController } from 'webpkit/lib/ctr';

export default class extends ViewController<{page: NavPage; title: string }> {

	private m_handleClick_1 = (e: any)=> {
		if (this.props.page) {
			this.props.page.popPage(true);
		}
	}

	render() {
		// 音律启蒙
		return (
			<div className="_title">
				<div className="_a"></div>
				<div className="_b">
					<div onClick={this.m_handleClick_1}></div>{this.props.title || ''}
				</div>
				{this.props.children}
			</div>
		);
	}
}
