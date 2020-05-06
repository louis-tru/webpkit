
import { React, CMSPage, Link } from 'webpkit/cms';

export default class extends CMSPage {
	render() {
		return (
			<div className="boxed">
				<div style={{
					display: 'flex',
					fontSize: '50px',
					justifyContent: 'center',
					height: '500px',
					alignItems: 'center'
				}}><Link to="/login">Login</Link></div>
			</div>
		);
	}
}