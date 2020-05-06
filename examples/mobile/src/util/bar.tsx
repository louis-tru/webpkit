
import { React } from 'webpkit/mobile';
import { ViewController } from 'webpkit/lib/ctr';
import '../css/com.css';

export class ConBar extends ViewController<{title: string; value: number; onChange: (value: number)=>void}> {

	state = {x: 0, value: 0};

	private m_moved = 0;
	private m_start_x = 0;
	private m_start_x2 = 0;
	private m_x = 0;
	private m_maxw = 0;

	constructor(props: any) {
		super(props);
		this.state = { 
			x: 0,
			value: this.m_get_value(this.props.value),
		};
	}

	private m_get_value(value: number) {
		return Math.max(0, Math.min(1, Number(value) || 0));
	}

	private m_update(value: number) {
		var x = value * this.maxw;
		this.m_x = x;
		this.setState({ x: x, value: value });
		if (this.props.onChange) {
			this.props.onChange(value);
		}
	}

	triggerUpdate() {
		this.m_update(this.m_get_value(this.props.value));
	}

	triggerMounted() {
		setTimeout(e=>{
			this.m_x = this.state.value * this.maxw;
			this.setState({ x: this.m_x });
		}, 100);
	}

	get maxw() {
		if (!this.m_maxw) {
			this.m_maxw = (this.refs.pbtn as HTMLDivElement).clientWidth - (this.refs.btn as HTMLDivElement).clientWidth;
		}
		return this.m_maxw;
	}

	private m_touchstart_handle = (e: any)=>{
		if (!this.m_moved) {
			this.m_moved = 1;
			this.m_start_x = e.type == 'touchstart' ? e.changedTouches[0].clientX : e.clientX;
			this.m_start_x2 = this.m_x;
		}
	}

	private m_touchmove_handle = (e: any)=>{
		if (this.m_moved) {
			var x = e.type == 'touchmove' ? e.changedTouches[0].clientX : e.clientX;
			var dx = x - this.m_start_x;
			this.m_x = this.m_start_x2 + dx;
			this.m_x = Math.min(this.maxw, Math.max(this.m_x, 0));
			this.m_update(this.m_x / this.maxw);
		}
	}

	private m_touchend_handle = ()=>{
		this.m_moved = 0;
	}

	render() {
		return (
			<div className="conBar">
				<div className="cb_0">{ this.props.title || '' }</div>
				<div className="cb_1" ref="pbtn"
					onTouchMove={this.m_touchmove_handle}
					onTouchEnd={this.m_touchend_handle}
					onMouseMove={this.m_touchmove_handle}
					onMouseUp={this.m_touchend_handle}
				>
					<div ref="btn"
						style={{ transform: `translateX(${this.state.x}px)` }}
						onTouchStart={this.m_touchstart_handle}
						onMouseDown={this.m_touchstart_handle}
					></div>
				</div>
				<div className="cb_2">{ (this.state.value * 100).toFixed(0) }%</div>
			</div>
		);
	}

}
