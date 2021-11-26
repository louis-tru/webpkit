
import Login from 'webpkit/cms/login';
import {alert} from 'webpkit/lib/dialog';

export default class extends Login {

	private _signin() {
		var phone = this.getCheckPhone();
		var vcode = this.getCheckVcode();
		// TODO ...
		alert('login ok');
	}

	protected async signin() {
		try {
			await this._signin();
		} catch(err: any) {
			alert(err.message);
		}
	}

	protected getVerificationCodeImpl(phone: string): any {
		// TODO ...
	}

}