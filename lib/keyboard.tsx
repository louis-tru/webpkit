
import '../assets/keyboard.css';
import * as ReactDom from 'react-dom';
import {ViewController, React} from './ctr';
import {DelayCall} from 'somes/delay_call';

export abstract class Keyboard<P = {}, S = {}> extends ViewController<P, S> {

	private m_recipient: Input | null = null;
	private _hasPresskeyCycle = false;

	get isActive() {
		return !!this.m_recipient;
	}

	get recipient() {
		return this.m_recipient;
	}

	get hasPresskeyCycle() {
		return this._hasPresskeyCycle;
	}

	protected abstract active(active: boolean): void;

	protected triggerInput(char: string) {
		if (this.recipient) {
			this.recipient._dom.value += char;
			this.recipient.triggerChange();
		}
	}

	protected triggerBackspace() {
		if (this.recipient) {
			var value = this.recipient._dom.value;
			this.recipient._dom.value = value.substr(0, value.length - 1);
			this.recipient.triggerChange();
		}
	}

	protected triggerDone() {
		if (this.recipient) {
			this.recipient.triggerDone();
		}
	}

	setRecipient(input: Input) {
		if (input instanceof Input && this.m_recipient !== input) {
			if (this.m_recipient)
				this.m_recipient.blur();
			this.m_recipient = input;
			this.active(true);
		}
	}

	clearRecipient(input: Input) {
		if (input === this.m_recipient) {
			input.blur();
			this.m_recipient = null;
			this.active(false);
		}
	}

	private _handleContextMenu = (event: any)=>{
		event.preventDefault();
	};

	private _hasPresskeyCycleSet = new DelayCall(()=>{
		this._hasPresskeyCycle = false;
	}, 20);

	private _handleStart = ()=>{
		this._hasPresskeyCycle = true;
		this._hasPresskeyCycleSet.clear();
	};

	private _handleEnd = ()=>{
		this._hasPresskeyCycleSet.call();
	};

	render() {
		return (
			<div ref="dom"
				onContextMenu={this._handleContextMenu}
				// onClick={this._handlePresskeyCycle}
				onTouchStart={this._handleStart}
				onTouchEnd={this._handleEnd}
				onTouchCancel={this._handleEnd}
				onMouseDown={this._handleStart}
				onMouseUp={this._handleEnd}
			>
				{this.renderBody()}
			</div>
		);
	}

	abstract renderBody(): React.ReactNode;

}

export class DefaultKeyboard extends Keyboard {

	state = { shift: 0, symbol: false, moreSymbol: false, active: false };
	
	private char(char: string) {
		if (this.state.shift) {
			return char.toUpperCase();
		} else {
			return char;
		}
	}

	private m_shift = (e: any)=>{
		e.stopPropagation();
		this.setState({ shift: (this.state.shift + 1) % 3 });
	}

	private m_symbol = (e: any)=>{
		e.stopPropagation();
		this.setState({ symbol: !this.state.symbol });
	}

	private m_moreSymbol = (e: any)=>{
		e.stopPropagation();
		this.setState({ moreSymbol: !this.state.moreSymbol });
	}

	private m_preventDefault(e: any) {
		e.stopPropagation();
		// if (this.m_recipient)
		// 	this.m_recipient.refs.input.focus();
	}

	private m_space = (e: any)=>{
		this.m_preventDefault(e);
		this.triggerInput(' ');
	}

	private m_done = (e: any)=>{
		this.m_preventDefault(e);
		this.triggerDone();
	}

	private m_backspace = (e: any)=>{
		this.m_preventDefault(e);
		this.triggerBackspace();
	}

	private m_handle_input = (e: any)=>{
		this.m_preventDefault(e);
		if (e.target.tagName.toUpperCase() == 'VIEW') {
			var {symbol,moreSymbol,shift} = this.state;
			if (symbol && moreSymbol) {
				this.setState({ moreSymbol: false, symbol: false });
			}
			if (shift == 1) {
				this.setState({ shift: 0 });
			}
			this.triggerInput(e.target.textContent);
		}
	}

	protected active(action: boolean) {
		this.setState({ active: action });
	}

	renderMoreSymbol() {
		return (
			<div className="kb" onTouchStart={this.m_handle_input}>
				<div className="row">
					<view>[</view>
					<view>]</view>
					<view>{'{'}</view>
					<view>}</view>
					<view>#</view>
					<view>%</view>
					<view>^</view>
					<view>*</view>
					<view>+</view>
					<view>=</view>
				</div>

				<div className="row">
					<view>ˇ</view>
					<view>\</view>
					<view>|</view>
					<view>{'<'}</view>
					<view>></view>
					<view>¥</view>
					<view>€</view>
					<view>£</view>
					<view>₤</view>
					<view>•</view>
				</div>

				<div className="row">
					<view className="grey" onTouchStart={this.m_moreSymbol}>123</view>
					<view>~</view>
					<view>,</view>
					<view>…</view>
					<view>@</view>
					<view>!</view>
					<view>`</view>
					<view className="grey" onTouchStart={this.m_backspace}>backspace</view>
				</div>

				<div className="row">
					<view className="grey" onTouchStart={this.m_symbol}>return</view>
					<view>.</view>
					<view className="space" onTouchStart={this.m_space}>Space</view>
					<view>?</view>
					<view className="blue" onTouchStart={this.m_done}>Done</view>
				</div>

			</div>
		)
	}

	renderSymbol() {
		if (this.state.moreSymbol)
			return this.renderMoreSymbol();
		return (
			<div className="kb" onTouchStart={this.m_handle_input}>
				<div className="row">
					<view>1</view>
					<view>2</view>
					<view>3</view>
					<view>4</view>
					<view>5</view>
					<view>6</view>
					<view>7</view>
					<view>8</view>
					<view>9</view>
					<view>0</view>
				</div>

				<div className="row">
					<view>-</view>
					<view>/</view>
					<view>:</view>
					<view>;</view>
					<view>(</view>
					<view>)</view>
					<view>_</view>
					<view>$</view>
					<view>{'&'}</view>
					<view>"</view>
				</div>

				<div className="row">
					<view className="grey" onTouchStart={this.m_moreSymbol}>more</view>
					<view>~</view>
					<view>,</view>
					<view>…</view>
					<view>@</view>
					<view>!</view>
					<view>'</view>
					<view className="grey" onTouchStart={this.m_backspace}>backspace</view>
				</div>

				<div className="row">
					<view className="grey" onTouchStart={this.m_symbol}>return</view>
					<view>.</view>
					<view className="space" onTouchStart={this.m_space}>Space</view>
					<view>?</view>
					<view className="blue" onTouchStart={this.m_done}>Done</view>
				</div>

			</div>
		)
	}

	renderBody() {
		if (!this.state.active)
			return null;
		if (this.state.symbol)
			return this.renderSymbol();
		var char = (e: string)=>this.char(e);
		return (
			<div className="kb" onTouchStart={this.m_handle_input}>
				<div className="row">
					<view>{char('q')}</view>
					<view>{char('w')}</view>
					<view>{char('e')}</view>
					<view>{char('r')}</view>
					<view>{char('t')}</view>
					<view>{char('y')}</view>
					<view>{char('u')}</view>
					<view>{char('i')}</view>
					<view>{char('o')}</view>
					<view>{char('p')}</view>
				</div>

				<div className="row">
					<view>{char('a')}</view>
					<view>{char('s')}</view>
					<view>{char('d')}</view>
					<view>{char('f')}</view>
					<view>{char('g')}</view>
					<view>{char('h')}</view>
					<view>{char('j')}</view>
					<view>{char('k')}</view>
					<view>{char('l')}</view>
				</div>

				<div className="row">
					<view className={this.state.shift==2?'blue':'grey'} onTouchStart={this.m_shift}>shift</view>
					<view>{char('z')}</view>
					<view>{char('x')}</view>
					<view>{char('c')}</view>
					<view>{char('v')}</view>
					<view>{char('b')}</view>
					<view>{char('n')}</view>
					<view>{char('m')}</view>
					<view className="grey" onTouchStart={this.m_backspace}>backspace</view>
				</div>

				<div className="row">
					<view className="grey" onTouchStart={this.m_symbol}>?123</view>
					<view>.</view>
					<view className="space" onTouchStart={this.m_space}>Space</view>
					<view>?</view>
					<view className="blue" onTouchStart={this.m_done}>Done</view>
				</div>
			</div>
		);
	}
}

var GlobalKeyboard: typeof Keyboard = DefaultKeyboard;
var keyboard: Keyboard | null = null;
var panel: HTMLElement | null = null;

function getPanel() {
	if (!panel) {
		panel = document.createElement('div');
		document.body.appendChild(panel);
	}
	return panel;
}

async function keyboardInstance() {
	if (!keyboard) {
		await new Promise(function(resolve, reject) {
			ReactDom.render<{}>(<GlobalKeyboard />, getPanel(), function(this: any) {
				keyboard = this;
				resolve();
			});
		});
	}
	return keyboard as Keyboard;
}

export function setGlobalKeyboard(keyboard: typeof Keyboard) {
	if (GlobalKeyboard !== keyboard) {
		ReactDom.unmountComponentAtNode(getPanel());
		GlobalKeyboard = keyboard;
	}
}

export interface InputProps {
	onChange?: ()=>void;
	onDone?: ()=>void;
	onFocus?: ()=>void;
	onBlur?: ()=>void;
	value?: string;
	className?: string;
	style?: React.CSSProperties;
	type?: string;
	placeholder?: string;
	initFocus?: boolean;
}

export class Input extends ViewController<InputProps> {

	private _focus = false;

	triggerMounted() {
		// keyboardInstance().setRecipient(this);
		if (this.props.initFocus) {
			setTimeout(e=>{
				var input = this._dom;
				if (input)
					input.focus();
			}, 100);
		}
	}

	triggerRemove() {
		keyboardInstance().then((k)=>k.clearRecipient(this));
	}

	get value() {
		return this._dom.value;
	}

	set value(val) {
		this._dom.value = val;
	}

	get _dom() {
		return this.refs.input as HTMLInputElement;
	}

	triggerChange() {

		if (this.props.onChange) {
			var input = this._dom;
			var len = input.value.length
			// console.log(input.setSelectionRange);
			// input.setSelectionRange(len, len);
			setTimeout(() => {
				try {
					input.focus();
					input.setSelectionRange(len, len);
				} catch(err) {}
			}, 50);

			this.props.onChange();
		}

		setTimeout(()=>(this.refs.input as HTMLInputElement).focus(), 5e2);
	}

	triggerDone() {
		if (this.props.onDone) {
			this.props.onDone();
		}
	}

	private _handleChange = ()=>{
		// keyboardInstance().setRecipient(this);
		this.triggerChange();
	}

	private _handleClick = ()=>{
		this._focusFun(true);
	}

	private _handleBlur = async (event: React.FocusEvent<HTMLInputElement>)=>{
		// console.log('_handleBlur');
		var keyboard = await keyboardInstance();
		if (keyboard.hasPresskeyCycle) {
			// event.preventDefault();
			// event.persist();
		} else {
			this.blur();
		}
	}

	private _focusFun(force = false) {
		if (force || !this._focus) {
			this._focus = true;
			keyboardInstance().then((k)=>k.setRecipient(this));
			if (this.props.onFocus) {
				this.props.onFocus();
			}
			this.forceUpdate();
		}
	}

	private async _blur() {
		if (this._focus) {
			var keyboard = await keyboardInstance();
			this._focus = false;
			keyboard.clearRecipient(this);
			if (this.props.onBlur) {
				this.props.onBlur();
			}
			this.forceUpdate();
		}
	}

	focus() {
		this._focusFun();
	}

	blur() {
		this._blur();
	}

	render() {
		var {value,className,type,style,placeholder} = this.props;
		var focusCls = this._focus ? ' focus': ''
		return (
			<input 
				placeholder={placeholder}
				className={className + focusCls} 
				defaultValue={value} 
				ref="input" 
				type={type}
				style={style}
				onChange={this._handleChange}
				onClick={this._handleClick}
				onFocus={()=>this.focus()}
				onBlur={this._handleBlur}
			/>
		);
	}
}