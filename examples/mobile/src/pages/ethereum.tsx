
import Header from '../util/header';
import { React, NavPage } from 'webpkit/mobile';
import sdk from '../sdk';
import {Monitor} from 'somes/monitor';
import '../css/ethereum.css';

export default class extends NavPage {

	state = { details: {}, loading: 1 };
	private m_monitor = new Monitor(5000, -1);

	async triggerLoad() {
		this.m_monitor.start(async e=> {
			try {
				this.setState({ loading: 1 });
				this.setState({ details: await sdk.wallet.methods.ethereum({ ignoreCache: true }), loading: 0 });
			} catch(e: any) {
				this.setState({ loading: 0 });
			}
		});
	}

	async onUnload() {
		this.m_monitor.stop();
	}

	render() {
		return (
			<div className="ethereum">
				<Header title="Ethereum" page={this} />

				<pre>
					<code>
						{
							JSON.stringify(this.state.details, null, 2)
						}
					</code>
				</pre>

				{ 
					this.state.loading ? <div className="loading"> Loading.. </div> : null
				}

			</div>
		);
	}

}
