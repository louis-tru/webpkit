/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2019, hardchain
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of hardchain nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL hardchain BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

import langoukit from 'langoukit';
import { React, Component, sdk } from '.';
// import { Toast, Icon } from './antd';
import ReactDom from 'react-dom';

import './utils.css';

export default class Loading extends Component {

	state = { text: 'Loading..' };

	componentDidMount() {
		if (this.props.text) {
			this.setState({ text: this.props.text });
		}
	}

	// componentWillUnmount() {
	// 	document.body.removeChild(this.refs.root.parentNode);
	// }

	render() {
		return (
			<div ref="root" className="g_loading">
				{/* <Icon type="loading" size="lg" /> */}
				<div className="text">{this.state.text}</div>
			</div>
		);
	}

	static show(text = 'Loading..', id = langoukit.id) {
		var div = document.createElement('div');
		document.body.appendChild(div);
		div.id = id || langoukit.id;
		return ReactDom.render(<Loading text={text ||'Loading..'} />, div);
	}

	static close(id) {
		var dom = document.getElementById(id);
		if (dom)
			document.body.removeChild(dom);
	}
}
