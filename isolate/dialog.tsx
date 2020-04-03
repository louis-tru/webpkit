<!--/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2019-01-10
 */
-->

<style>

	.hc_dialog {
		width:100%;
		height: 100%;
		position: absolute;
		overflow: hidden;
		background:rgba(0,0,0,.8);
		top:0;
		z-index: 20;
		text-align: center;
		background: rgba(0,0,0,.9);
		animation-fill-mode: both;
	}
	
	.hc_dialog_box {
		width: 100%;
		height: 100%;
		transform-origin: 50% 50%;
		transform: translateZ(1px) scaleX(0.1) scaleY(0.1);
		opacity: 0.1;
		animation-fill-mode: both;
		position: relative;
		display:flex;
		justify-content: center;
		align-items: center;
	}

	@keyframes show_1 {
		from {background: rgba(0,0,0,.1)}
		to   {background: rgba(0,0,0,.8)}
	}

	@keyframes hide_1
	{
		from {background: rgba(0,0,0,.8)}
		to   {background: rgba(0,0,0,.1)}
	}

	@keyframes show_2 {
		from {transform: translateZ(1px) scaleX(0.1) scaleY(0.1); opacity: 0.1}
		to   {transform: translateZ(1px) scaleX(1) scaleY(1); opacity: 1}
	}

	@keyframes hide_2
	{
		from   {transform: translateZ(1px) scaleX(1) scaleY(1); opacity: 1}
		to {transform: translateZ(1px) scaleX(0.1) scaleY(0.1); opacity: 0.1}
	}

</style>

<template>
	<div class="hc_dialog" :style="__dialog_style">
		<div class="hc_dialog_box" :style="__dialog_box_style">
			<slot />
		</div>
	</div>
</template>

<script>

import { DesktopCtrl, component } from './ctrl';

/**
 * @class DesktopDialog
 */
var DesktopDialog = component({
	extends: DesktopCtrl,

	data() {
		return { 
			animation_name: 'show',
			animation_duration: '300ms',
		};
	},

	computed: {
		__dialog_style() {
			return `
				animation-name: ${this.animation_name}_1; 
				animation-duration: ${this.animation_duration};
			`;
		},
		__dialog_box_style() {
			return `
				animation-name: ${this.animation_name}_2; 
				animation-duration: ${this.animation_duration};
			`;
		},
	},

	methods: {
		render(slots, ce) {
			this.setSlots(slots);
			return DesktopDialog.options.render.call(this, ce);
		},
		desktopCtrlType() {
			return 5;
		},
		// @orerwrite
		close(options) {
			this.animation_name = 'hide';
			this.animation_duration = '300ms';
			setTimeout(e=>this.desktop._close_dialog(this, options), 300);
		},
	},

});

export { DesktopDialog };

export default DesktopDialog;

</script>