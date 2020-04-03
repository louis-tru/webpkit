/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2019-01-10
 */

import utils from 'nxkit';
// import vue from 'vue';
import {React} from 'cport-h5';

function getDesktopCtrlType(ctrl) {
	if (ctrl && typeof ctrl.desktopCtrlType == 'function') {
		return ctrl.desktopCtrlType();
	}
	return 0;
}

function getDesktopCtrlTypeWithCom(ctrl_com) {
	if (
		ctrl_com && 
		ctrl_com.sealedOptions &&
		ctrl_com.sealedOptions.methods &&
		ctrl_com.sealedOptions.methods.desktopCtrlType &&
		typeof ctrl_com.sealedOptions.methods.desktopCtrlType == 'function') {
		return ctrl_com.sealedOptions.methods.desktopCtrlType();
	}
	return 0;
}

function hasDesktop(desktop) {
	if (desktop && typeof desktop.__hasDesktop__ == 'function') {
		return desktop.__hasDesktop__();
	}
	return false;
}

function component(defined) {
	var methods = defined.methods || {};
	var tag = `desktop_${utils.id}`;
	var com = vue.component(tag, defined);
	com.methods = methods;
	com.tag = tag;
	com.defaultRef = tag;
	return com;
}

/**
 * @class DesktopCtrl
 */
var DesktopCtrl = component({
	template: `
		<div>
			<slot />
		</div>
	`,
	computed: {
		options() {
			return this.$attrs || {};
		},
		desktop() {
			if (!this.m_desktop) {
				utils.assert(hasDesktop(this.$parent));
				this.m_desktop = this.$parent;
			}
			return this.m_desktop;
		},
	},
	beforeCreate() {
		var $render = this.$options.render;
		if (!$render) return;
		this.$options.render = (ce)=> {
			return this.render($render.call(this, ce), ce);
		};
	},
	created() {
		this.m_initialize = true;
		this.triggerResume();
	},
	destroyed() {
		this.triggerPause();
		this.m_initialize = false;
		if (typeof this.options.onClose == 'function') {
			this.options.onClose(this);
		}
	},
	methods: {
		desktopCtrlType() {
			return 0;
		},
		setSlots(slots) {
			if (slots) {
				if (slots instanceof this.$vnode.constructor) {
					Object.assign(this.$slots, {default:slots});
				} else {
					Object.assign(this.$slots, slots);
				}
			}
		},
		render(slots, ce) {
			return slots;
		},
		triggerResume() {
			if (this.m_initialize && !this.m_is_activity) {
				this.m_is_activity = true;
				this.onResume();
			}
		},
		triggerPause() {
			if (this.m_initialize && this.m_is_activity) {
				this.m_is_activity = false;
				this.onPause();
			}
		},
		onResume() {
			// console.log(this.desktopCtrlType(), 'onResume');
		},
		onPause() {
			// console.log(this.desktopCtrlType(), 'onPause');
		},
	},
});

/**
 * @class DesktopCell
 */
var DesktopCell = component({
	extends: DesktopCtrl,
	methods: {
		desktopCtrlType() {
			return 1;
		},
	},
});

/**
 * @fclass DesktopCover
 */
var DesktopCover = component({
	extends: DesktopCtrl,
	methods: {

		// @private
		desktopCtrlType() {
			return 2;
		},

		/**
		 * @func get_cover_subtype()
		 */
		get_cover_subtype() {
			var desktop = this.desktop;
			if (desktop) {
				var refs = desktop.$refs;
				var parent = this.$el.parentNode;
				if (parent === refs.__top) {
					return 'top';
				} else if (parent === refs.__bottom) {
					return 'bottom';
				}
			}
			return 0;
		},

		/**
		 * @func set_position(value) // value 0-100
		 */
		set_position(value) {
			var subtype = this.get_cover_subtype();
			if (subtype == 'top') { // top
				this.desktop.setCoverPosition('top', value);
			} else if (subtype == 'bottom') { // bottom
				this.desktop.setCoverPosition('bottom', value);
			}
		},

		/**
		 * @func close()
		 */
		close(options) {
			this.desktop.closeCover(this.get_cover_subtype(), options);
		},
	},

});

/**
 * @class DesktopLayer
 */
var DesktopLayer = component({
	extends: DesktopCtrl,
	methods: {

		// @private
		desktopCtrlType() {
			return 3;
		},

		/**
		 * @func close()
		 */
		close(options) {
			var desktop = this.desktop;
			if (desktop) {
				desktop._close_layer(this, options);
			}
		},
	},
});

/**
 * @class DesktopWidget
 */
var DesktopWidget = component({
	extends: DesktopCtrl,
	methods: {
		desktopCtrlType() {
			return 4;
		},
		close(options) {
			this.desktop._close_widget(this, options);
		}
	},
});

export {
	DesktopCtrl,
	DesktopCell,
	DesktopLayer,
	DesktopCover,
	DesktopWidget,
	getDesktopCtrlType,
	getDesktopCtrlTypeWithCom,
	hasDesktop,
	component,
};
