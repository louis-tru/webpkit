/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2019-01-08
 */

/*
<template>
	<div 
		class="hc_desktop"
		:ch__="ch__"
		:style="`width:${$attrs.width};height:${$attrs.height};`"
	>

		<div 
			ref="__cells"
			class="hc_desktop_cells" 
			:style="`width:${cell_count}00%;display:block;
							transform:translateX(${-__x}px) translateZ(1px);`"
		>
			<div
				:ref="`__cell_${i}`"
				v-for="i in cell_count" 
				class="hc_desktop_cell"
				:style="`width:${1/cell_count*100}%;height:100%;${_cell_filter(i,cells_blur)}`"
			>
				<slot :name="'cell_' + i" v-if="_cell_index<=i&&i<=_cell_index+2" />
			</div>
		</div>

		<slot 
			:ref="_widgets_vdom[i-1].data.ref||`__widget_${i}`" 
			:name="'widget_' + i" 
			v-for="i in widget_count" 
		/>

		<div class="hc_desktop_cover hc_desktop_top" ref="__top">
			<slot name="top" v-if="top_cover__" />
		</div>
		<div class="hc_desktop_cover hc_desktop_bottom" ref="__bottom">
			<slot name="bottom" v-if="bottom_cover__" />
		</div>

		<div class="hc_desktop_layers" ref="__layers">

			<div
				:ref="`__layer_${i}`"
				v-for="i in layer_count" 
				class="hc_desktop_layer"
			>
				<slot :ref="_layers_vdom[i-1].data.ref" :name="'layer_' + i" />
			</div>

			<div
				:ref="`__dialog_${i}`"
				v-for="i in dialog_count"
				class="hc_desktop_layer"
				:style="_dialog_style(i)"
			>
				<slot :ref="_dialogs_vdom[i-1].data.ref" :name="'dialog_' + i" />
			</div>

		</div>

	</div>
</template>

<script>
*/

import utils from 'nxkit';
import { DelayCall } from 'nxkit/delay_call';
import {
	DesktopCell,
	DesktopLayer,
	DesktopCover,
	DesktopWidget,
	hasDesktop,
	getDesktopCtrlType,
	getDesktopCtrlTypeWithCom,
	component,
} from './ctrl';
import DesktopDialog from './dialog';
import Gesture, { get_horizontal_direction } from './gesture';

var CELLS_BLUR = 0;
var current = null;

// @private
function fatal(self, msg) {
	console.error(`${msg}`);
	if (confirm(`Fatal Error: ${msg}\nWhether to reload`)) {
		location.reload();
	}
	throw new Error(msg);
}

// @private
function Desktop_check_children_com(self) {

	var top_len = self.$refs.__top.childElementCount;
	var bottom_len = self.$refs.__bottom.childElementCount;

	if (top_len > 1 || bottom_len > 1) {
		fatal(self, 'Invalid Desktop Ctrl');
	}

	self._cells = [];
	self._layers = [];
	self._widgets = [];
	self._dialogs = [];
	self._top = null;
	self._bottom = null;

	for (var ctrl of self.$children) {
		var type = getDesktopCtrlType(ctrl);
		if (type == 1) { // cell
			if (ctrl.$vnode.data.hasOwnProperty('_cell_index')) {
				self._cells[ctrl.$vnode.data._cell_index] = ctrl;
			} else {
				console.error('desktop _cell_index not found');
			}
		}
		else if (type == 2) { // cover
			if (ctrl.$el.parentNode === self.$refs.__top) {
				self._top = ctrl;
			} else if (ctrl.$el.parentNode === self.$refs.__bottom) {
				self._bottom = ctrl;
			} else {
				fatal(self, 'Invalid Desktop Ctrl');
			}
		}
		else if (type == 3) { // layer
			self._layers.push(ctrl);
		}
		else if (type == 4) { // widget
			self._widgets.push(ctrl);
		}
		else if (type == 5) { // dialog
			self._dialogs.push(ctrl);
		} else {
			fatal(self, 'Invalid Desktop Ctrl');
		}
	}

	return true;
}

function set_cover_ok(self, name, value) {
	if (self[`_${name}_cover_ok`] != value) {
		self[`_${name}_cover_ok`] = value;
		var ctrl = self[`_${name}`];
		if (ctrl) {
			// console.log('set_cover_ok', name, value);
			if (value) {
				ctrl.triggerResume();
			} else {
				ctrl.triggerPause();
			}
		}
	}
}

function set_cover_position(self, name, value, unit, duration) {
	if (!self.$slots[name]) {
		return;
	}
	if (name == 'top') { // top
		self.$refs.__top.style.transform = `translateY(${value}${unit}) translateZ(1px)`;
		self.$refs.__top.style.transitionDuration = `${duration}ms`;
	} else { // bottom
		self.$refs.__bottom.style.transform = `translateY(${-value}${unit}) translateZ(1px)`;
		self.$refs.__bottom.style.transitionDuration = `${duration}ms`;
	}
	// console.log('set_cover_position', value)
	if (value > 0) {
		if (value == 100 && unit == '%') {
			set_cover_ok(self, name, true);
		}
		self[`${name}_cover__`] = true;
		self[`_${name}_cover_destroy`].clear();
	} else { // destroy
		set_cover_ok(self, name, false);
		self[`_${name}_cover_destroy`].notice();
	}
	if (unit  == 'px') { // px
		var blur = Math.max(0, value / self._height);
		self.cells_blur = Math.round(blur * CELLS_BLUR);
	} else { // %
		var blur = Math.max(0, value / 100);
		self.cells_blur = Math.round(blur * CELLS_BLUR);
	}
	self.$refs.__cells.style.transitionDuration = `${duration}ms`;
}

function desktop() {
	return current;
}

function format_options(com, options) {
	options = options || {};
	if (typeof options == 'object') {
		if (Array.isArray(options)) {
			options = { attrs: options };
		} else {
			options.attrs = options;
		}
	} else {
		options = { attrs: options };
	}
	options.ref = options.ref || '';
	if (!options.ref) {
		var name = com.defaultRef || com.options.name;
		if (name) {
			options.ref = name;
		} else {
			options.ref = `a_${utils.id}`;
		}
	}
	return options;
}

function gen_slots(self) {
	var slots = self.$slots;
	var cells = (slots.cells || slots.default || [])
	cells = cells.filter(e=>e.tag);
	cells.forEach((e, i)=>{
		e.data._cell_index = i;
		slots['cell_' + (i + 1)] = [e]
	});
	self._layers_vdom.forEach((e, i)=>{
		slots[`layer_` + (i + 1)] = [e];
	});
	self._widgets_vdom.forEach((e, i)=>{
		slots[`widget_` + (i + 1)] = [e];
	});
	self._dialogs_vdom.forEach((e, i)=>{
		slots[`dialog_` + (i + 1)] = [e];
	});
	return cells.length;
}

function check_refs(self, type, ref) {
	if (ref) {
		var index, vdom;
		for (var vdoms of [self._layers_vdom, self._dialogs_vdom, self._widgets_vdom]) {
			vdom = vdoms.find((e,i)=>{
				if (e.data.ref) {
					if (e.data.ref == ref) {
						index = i;
						return true;
					}
				}
			});
			if (vdom) {
				utils.assert(vdom.__type == type, 
					`desktop components "${ref}" already exist`);
				return index;
			}
		}
	}
	return -1;
}

function show_ctrl(self, type, com, options) {
	utils.assert(getDesktopCtrlTypeWithCom(com) == type);
	options = format_options(com, options);
	var i = check_refs(self, type, options.ref);
	if (i >= 0) {
		console.warn(`desktop exist type=${type}, ref=${options.ref}`);
	}
	var vdom = self.$createElement(com, options);
	var name = [,,,'layer', 'widget', 'dialog'][type];
	var key = `_${name}s_vdom`;
	vdom.__type = type;
	if (i > -1 && i < self[key].length) {
		self[key][i] = vdom;
	} else {
		self[key].push(vdom);
	}
	self[`${name}_count`] = self[key].length;
	self.ch__ = self.ch__ + 1;
}

function close_ctrl(self, type, handle, options) {
	utils.assert(type == getDesktopCtrlType(handle));
	var name = [,,,'layer', 'widget', 'dialog'][type];
	var key = `_${name}s_vdom`;
	var index = -1;
	self[key].find((e, i)=>{
		index = i;
		return e.componentInstance.options.ref == handle.options.ref;
	});
	if (index != -1) {
		self[key].splice(index, 1);
	}
	self[`${name}_count`] = self[key].length;
	self.ch__ = self.ch__ + 1;
}

function has_can_action(self) {
	return (
		// !self._top_cover_ok && 
		// !self._bottom_cover_ok && 
		self._layers.length === 0 && 
		self._dialogs.length === 0
	);
}

function has_can_horizontal(self) {
	return !self._top_cover_ok && !self._bottom_cover_ok;
}

/**
 * @class Desktop
 */
var Desktop = component({
	extends: Gesture,
	props: [
		'cell',
		'bounce',
		'disableTopGesture',
		'disableBottomGesture',
		'dialogStrictMode',
	],

	data() {
		return {
			top_cover__: false,
			bottom_cover__: false,
			cell_count: 0,
			layer_count: 0,
			dialog_count: 0,
			widget_count: 0,
			cells_blur: 0,
			ch__: 0,
		};
	},
	computed: {
		options() {
			return this.$attrs || {};
		},
	},
	destroyed() {
		if (current === this) {
			current = null;
		}
	},

	beforeCreate() {
		var $render = this.$options.render;
		this.$options.render = (...e)=> {
			this._cells_count = gen_slots(this);
			this.cell_count = this._cells_count;
			this._cell_index_max = this._cells_count - 1;
			this._max_x = this._cell_index_max * this._width;
			if (this._cells_count && this.__x > this._max_x) {
				this.__x = this._max_x;
			}
			return $render.call(this, ...e);
		};
	},
	
	created() {
		current = this;
		this._cells = [];
		this._layers = [];   this._layers_vdom = [];
		this._dialogs = [];  this._dialogs_vdom = [];
		this._widgets = [];  this._widgets_vdom = [];
		this._top = null;
		this._bottom = null;
		this._width = 0;
		this._height = 0;

		this._cells_count = gen_slots(this);
		this.cell_count = this._cells_count;
		this._bounce = Number(this.$props.bounce) || 0;
		this._cell_index_max = this._cells_count - 1;
		this._cell_index = Math.max(0, Math.min(Number(this.$props.cell) || 0, this._cell_index_max));
		this.__x = 0;

		this._disable_top_gesture = Number(this.$props.disableTopGesture) || 0;
		this._disable_bottom_gesture = Number(this.$props.disableBottomGesture) || 0;
		this._dialog_strict_mode = Number(this.$props.dialogStrictMode) || 0;
		this._top_cover_ok = false;
		this._bottom_cover_ok = false;
		this._top_cover_destroy = new DelayCall(e=>this.top_cover__=0, 1e3);
		this._bottom_cover_destroy = new DelayCall(e=>this.bottom_cover__=0, 1e3);
		this._momentum_time = 350; // ms
		this._cells_blur = ''; //: blur(20px);
	},

	// @overwrite
	mounted() {
		if (!Desktop_check_children_com(this))
			return;
		this._width = this.$el.clientWidth;
		this._height = this.$el.clientHeight;
		this._max_x = this._cell_index_max * this._width;
		this.__x = this._width * this._cell_index;
		this.ch__++;
		this._switch_index = -1; // this._cell_index;
	},

	updated() {
		if (!Desktop_check_children_com(this))
			return;
		var index = this._cell_index;
		if (this._switch_index != index) {
			this._switch_index = index;
			var dom = this._cells[index];
			if (dom) {
				this.$emit('SwitchCell', { dom, index });
			}
		}
	},

	methods: {

		__hasDesktop__() {
			return true;
		},

		_dialog_style(i) {
			var display = this.dialog_count != i ? 'none': '';
			// width:${this._width};height:${this._height};
			return `display:${display}`;
		},

		_cell_filter(index, cells_blur) {
			return (index - 1) == this._cell_index ? `filter:blur(${cells_blur}px)`: '';
		},

		/**
		 * @func _show_layer(com)
		 */
		_show_layer(com, options) {
			show_ctrl(this, 3, com, options);
		},

		/**
		 * @func _close_layer(handle)
		 */
		_close_layer(handle, options) {
			close_ctrl(this, 3, handle, options);
		},

		/**
		 * @func _show_widget(com)
		 */
		_show_widget(com, options) {
			show_ctrl(this, 4, com, options);
		},

		/**
		 * @func _close_widget(handle)
		 */
		_close_widget(handle, options) {
			close_ctrl(this, 4, handle, options);
		},

		/**
		 * @func _show_dialog(com)
		 */
		_show_dialog(com, options) {
			show_ctrl(this, 5, com, options);
		},

		/**
		 * @func _close_dialog(handle)
		 */
		_close_dialog(handle, options) {
			if (this._dialog_strict_mode) {
				var self = this;
				var type = 5;
				utils.assert(type == getDesktopCtrlType(handle));
				var name = [,,,'layer', 'widget', 'dialog'][type];
				var key = `_${name}s_vdom`;
				utils.assert(self[key].last(0) === handle.$vdom, 
					`Closing dialog boxes in incorrect order, \
					Please follow the "first in first out" principle`);
				self[key].pop();
				self[`${name}_count`] = self[key].length;
			} else {
				close_ctrl(this, 5, handle, options);
			}
		},

		// Creative Factory
		show(ctrl, options) {
			if (current !== this) return;
			var type = getDesktopCtrlTypeWithCom(ctrl);
			if (type == 3) { // layer
				desktop()._show_layer(ctrl, options);
			} else if (type == 4) { // widget
				desktop()._show_widget(ctrl, options);
			} else if (type == 5) { // dialog
				desktop()._show_dialog(ctrl, options);
			} else {
				fatal(null, 'Invalid Desktop Ctrl');
			}
		},

		close(ref, options) {
			if (current !== this) return;
			if (ref && typeof ref == 'function')
				ref = ref.defaultRef;
			var instance = this.ref(ref);
			if (instance) {
				instance.close(options);
			} else {
				console.warn(`${ref} does not exist`);
			}
		},

		/**
		 * @func hasShowCover()
		 */
		hasShowCover(name) {
			return this[`_show_${name}_cover`];
		},

		/**
		 * @func showCover()
		 */
		showCover(name, options) {
			if (!this._show_top_cover && !this._show_bottom_cover) {
				if (this.$slots[name]) {
					set_cover_ok(this, name, true);
					set_cover_position(this, name, 100, '%', this._momentum_time);
				}
			}
		},

		/**
		 * @func closeCover(name)
		 */
		closeCover(name, options) {
			set_cover_ok(this, name, false);
			set_cover_position(this, name, 0, '%', this._momentum_time);
		},

		ref(ref) {
			return this.$refs[ref];
		},

		cellAt(index) {
			return this._cells[index];
		},

		switchFrom(cell) {
			var index = this._cells.indexOf(cell);
			if (index!=-1)  {
				this.switchAt(index);
			}
		},

		switchAt(index) {
			if (index <= this._cell_index_max && index >= 0) {
				this._cell_index = index;
				var x = this._cell_index * this._width;
				this.__x = x;
				this.$refs.__cells.style.transitionDuration = `${this._momentum_time}ms`;
				this.$refs.__cells.style.transform = `translateX(${-x}px) translateZ(1px)`;
				this.ch__++;
			}
		},

		cur() {
			return this._cells[this._cell_index] || null;
		},

		/**
		 * @func setCoverPosition(name, value)
		 */
		setCoverPosition(name, value) {
			if (this[`_show_${name}_cover`]) {
				if (value) {
					set_cover_position(this, name, value, '%', this._momentum_time);
				} else {
					this.closeCover(name);
				}
			}
		},

		onBeginMove(e) {
			if (!has_can_action(this)) {
				return;
			}
			this._begin_move = true;
		},

		// @overwrite
		onMove(e) {
			if (!this._begin_move || !has_can_action(this)) {
				return;
			}
			if (e.begin_direction == 1 || e.begin_direction == 3) { // left / right
				if (has_can_horizontal(this)) {
					var move_x = e.begin_x - e.x;
					var x = this._cell_index * this._width + move_x;
					if (this._bounce) {
						if (this._max_x < x) {
							x -= ((x - this._max_x) / 1.5);
						} else if (x < 0) {
							x -= (x / 1.5);
						}
					} else {
						x = Math.min(this._max_x, x);
						x = Math.max(0, x);
					}
					this.__x = x;
					this.$refs.__cells.style.transform = `translateX(${-x}px) translateZ(1px)`;
					this.$refs.__cells.style.transitionDuration = `0ms`;
				}
			} else if (e.begin_direction == 2) { // up
				if (this._top_cover_ok) { // close top
					// console.log(this._height - (e.begin_y - e.y), this._height)
					if (!this._disable_top_gesture)
						set_cover_position(this, 'top', this._height - Math.max(e.begin_y - e.y, 0), 'px', 0);
				} else if (!this._bottom_cover_ok) { // open bottom
					if (!this._disable_bottom_gesture)
						set_cover_position(this, 'bottom', e.begin_y - e.y, 'px', 0);
				}
			} else if (e.begin_direction == 4) { // down
				if (this._bottom_cover_ok) { // close bottom
					if (!this._disable_bottom_gesture)
						set_cover_position(this, 'bottom', this._height - Math.max(e.y - e.begin_y, 0), 'px', 0);
				} else if (!this._top_cover_ok) { // open top
					if (!this._disable_top_gesture) {
						// console.log(e.y - e.begin_y, this._height)
						set_cover_position(this, 'top', e.y - e.begin_y, 'px', 0);
					}
				}
			}
		},

		// @overwrite
		onEndMove(e) {
			if (!this._begin_move || !has_can_action(this)) {
				return;
			}
			this._begin_move = false;
			if ((e.begin_direction == 1 || e.begin_direction == 3)) {// left / right
				if (has_can_horizontal(this)) {
					var x = this._cell_index * this._width;
					if (e.speed > 30 && e.begin_direction == e.instant_direction) {
						if (e.begin_direction == 1) { // right
							this._cell_index = Math.max(0, this._cell_index - 1);
						} else { // left
							this._cell_index = Math.min(this._cell_index_max, this._cell_index + 1);
						}
						x = this._cell_index * this._width;
					} else { // recovery
						var transform = getComputedStyle(this.$refs.__cells)['transform'];
						var mat = transform.match(/^matrix3d\((-?\d+(\.\d+)?,\s+){12}(-?\d+(\.\d+)?)/)
						if (mat && mat[3]) {
							x = -Number(mat[3]);
							this._cell_index = Math.round(x / this._width);
							this._cell_index = Math.min(this._cell_index, this._cell_index_max);
							this._cell_index = Math.max(this._cell_index, 0);
							x = this._cell_index * this._width;
						}
					}
					this.__x = x;
					this.$refs.__cells.style.transform = `translateX(${-x}px) translateZ(1px)`;
					this.$refs.__cells.style.transitionDuration = `${this._momentum_time}ms`;
					this.ch__++;
				}
			}
			else if (e.begin_direction == 2 || e.begin_direction == 4) { // top / bottom
				var y = 0, el;
				// console.log('e.speed', e.speed);
				var action = e.speed > 500 && e.begin_direction == e.instant_direction;
				if (e.begin_direction == 2) { // up, top => bottom
					if (this._top_cover_ok) { // close top
						if (!this._disable_top_gesture) {
							if (action) {
								this.closeCover('top');
							} else { // recovery
								this.showCover('top');
							}
						}
					} else if (!this._bottom_cover_ok) { // open bottom
						if (!this._disable_bottom_gesture) { // not disable
							if (action) {
								this.showCover('bottom');
							} else { // recovery
								this.closeCover('bottom');
							}
						}
					}
				} else { // down, bottom => top
					if (this._bottom_cover_ok) { // close bottom
						if (!this._disable_bottom_gesture) {
							if (action) {
								this.closeCover('bottom');
							} else { // recovery
								this.showCover('bottom');
							}
						}
					} else if (!this._top_cover_ok) { // open top
						if (!this._disable_top_gesture) { // not disable
							if (action) {
								this.showCover('top');
							} else { // recovery
								this.closeCover('top');
							}
						}
					}
				}
				// end if 
			}
		},

		// end methods
	},

});

// Creative Factory
function show(ctrl, options) {
	current.show(ctrl, options);
}

function close(ref, options) {
	current.close(ref, options);
}

function ref(ref) {
	return current.ref(ref);
}

export {
	Desktop,
	DesktopCell,
	DesktopLayer,
	DesktopCover,
	DesktopDialog,
	DesktopWidget,
	component,
	hasDesktop, desktop,
	show, close, ref,
};
export default Desktop;

</script>
