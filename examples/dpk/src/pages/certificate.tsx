
import './certificate.scss';
import * as React from 'react';
import Activity from 'dphoto-lib/activity';
import QRcode from 'webpkit/lib/qrcode';
import {PosterItem} from '../models/poster';

export default class extends Activity<{poster:PosterItem}> {

	protected title = '';
	protected name = '';

	protected renderMain() {
		return (
			<div className="dphoto_art_certificate">
				<img className="img1" src={this.props.poster.rights_certificate_pic/*require('../../assets/test/poster.png')*/} />
				<div className="qr">
					<QRcode text={this.props.poster.rights_certificate_url} width={145} height={145} />
				</div>
				<div className="txt1">扫码分享证书</div>
			</div>
		);
	}

}