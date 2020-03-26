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

import { List, InputItem, Picker, Toast, Icon } from 'antd-mobile';
import { createForm } from 'rc-form';
import React, { Component } from 'react';
import GlobalState from '../state';
export * from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
export * from 'rc-form';

export class AForm extends GlobalState {

	// antd mobile method
	getFieldProps = (name, ...args)=>{
		var { getFieldProps, getFieldError } = this.props.form;
		var attrs = {
			error: getFieldError(name),
			onErrorClick:e=>Toast.info(getFieldError(name))
		};
		return Object.assign(attrs, getFieldProps(name, ...args));
	};
	getFieldsError = (...args)=>this.props.form.getFieldsError(...args);
	getFieldError = (...args)=>this.props.form.getFieldError(...args);
	validateFields = (...args)=>this.props.form.validateFields(...args);
	getFieldDecorator = (...args)=>this.props.form.getFieldDecorator(...args);
	isFieldsTouched = (...args)=>this.props.form.isFieldsTouched(...args);
	isFieldValidating = (...args)=>this.props.form.isFieldValidating(...args);
	getFieldValue = (...args)=>this.props.form.getFieldValue(...args);

	_check(name) {
		var {rules} = this.props.form.getFieldInstance(name).props;
		var value = this.props.form.getFieldValue(name);
		if (rules) {
			return rules.every(rule=>{
				if (rule.validator) {
					var err;
					rule.validator(rule, value, e=>err=e, {}, {});
					if (err) return false;
				} else if (rule.required && !value) {
					return false;
				} else if (rule.pattern) {
					if (!rule.pattern.exec(value)) {
						return false;
					}
				}
				return true;
			});
		}

		return true;
	}

	get canSubmit() {
		return this.isCanSubmit();
	}

	isCanSubmit() {
		var errors = this.getFieldsError();
		for (var i in errors) {
			if (errors[i]) {
				return false;
			} else {
				if (!this.isFieldValidating(i)) {
					if (!this._check(i)) {
						return false;
					}
				}
			}
		}
		return true;
	}

	async componentDidMount() {
		await this.onLoad();
		this.setState(this.state);
	}

	componentWillUnmount() {
		this.onUnload();
	}

	onLoad() {
		// overwrite
	}

	onUnload() {
		// overwrite
	}

	rulesRequired(message) {
		return {
			validator: (rule, value, callback, source, options)=>{
				if ((value || value+1===1) && value !== 'undefined') {
					if (Array.isArray(value)) {
						if ( value.length && value.every(e=>(e||e+1===1)&&e!=='undefined') ) {
							callback();
						} else {
							callback(rule.message);
						}
					} else {
						callback();
					}
				} else {
					callback(rule.message);
				}
			},
			message,
		};
	}

};

export class AFItem extends Component {

	get name() {
		return this.props.name;
	}

	get form() {
		return this.props.form;
	}

	render() {

		var { getFieldProps, getFieldError, getFieldDecorator } = this.form;
		var {
			name,
			tag: Tag = InputItem,
			type = 'text',
			errorIcon,
			error = getFieldError(name),
			onErrorClick = e=>Toast.info(getFieldError(name)),
			initialValue,
			rules,
			children,
			form,
			...propss
		} = this.props;

		if (Tag == 'none') {

			var resolve = (vdom)=>{
				var children = vdom.props.children;
				if (!children) {
					return vdom;
				}
				children = Array.isArray(children) ? children : [children];

				var new_children = []

				for (var i = 0; i < children.length; i++) {
					var ch = children[i];
					if (typeof ch.type == 'string') {
						if (ch.type == 'input') {
							new_children.push(getFieldDecorator(name, {
								initialValue,
								rules,
							})(React.cloneElement(ch, {...propss, key: i})));
						} else {
							new_children.push(ch);
						}
					} else {
						new_children.push(resolve(ch));
					}
				}

				return React.createElement(vdom.type, {...vdom.props, key: vdom.key }, ...new_children);
			}

			return (
				<div className={`cc-item-wrap ${error?'cc-item-wrap-error':''}`}>
					{resolve(children)}
					<div className="cc-error-extra" onClick={onErrorClick}></div>
				</div>
			);
		}
		else {

			var fieldProps = getFieldProps(name, {
				initialValue,
				rules,
			});

			var vdom = (
				<Tag
					type={type}
					error={error}
					onErrorClick={onErrorClick}
					{...fieldProps}
					{...this.props}
				>
					{children}
				</Tag>
			);

			if (errorIcon) {
				return (
					<div className={`cc-item-wrap ${error?'cc-item-wrap-error':''}`}>
						{vdom}
						<div className="cc-error-extra" onClick={onErrorClick}></div>
					</div>
				);
			} else {
				return vdom;
			}
		}

	}

}
