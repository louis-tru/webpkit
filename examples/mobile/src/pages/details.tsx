
import Header from '../util/header';
import { React, NavPage } from 'webpkit/mobile';
import sdk from 'webpkit/lib/store';

export default class extends NavPage {
	state = {details:{}};

	async triggerLoad() {
		this.setState({ details: await sdk.device.methods.details() });
	}

	render() {
		return (
			<div>
				<Header title="Device Details" page={this} />

				{ this.state.details ?
					<pre className="content">
						<code>
							{
								JSON.stringify(this.state.details, null, 2)
							}
						</code>
					</pre>: 
					<div style={{ lineHeight: '2rem', textAlign: 'center' }}>Loading..</div>
				}

			</div>
		);
	}

}
