/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import UI from '../lib/ui';

export function getHorizontalDirection(angle: number) {
	angle += 90;
	return Math.floor((angle % 360) / 180) + 1;
}

export function getVerticalDirection(angle: number) {
	return Math.floor((angle % 360) / 180) + 1;
}

export interface Point {
	x: number;
	y: number;
}

function get_angle(p1: Point, p2: Point) {
	var arc = Math.atan2(p1.y - p2.y, p2.x - p1.x);
	var angle = (arc / Math.PI * 180 + 360) % 360;
	return angle;
}

function get_direction(angle: number) {
	angle += 45;
	return Math.floor((angle % 360) / 90) + 1;
}

function get_distance(p1: Point, p2: Point) {
	var x = Math.abs(p1.x - p2.x);
	var y = Math.abs(p1.y - p2.y);
	return Math.sqrt(x**2 + y**2);
}

function has_speed_invalid(time0: number, time1: number) {
	if (!time0 || !time1 || time1 - time0 > 300) {
		return true;
	}
	return false;
}

function compute_speed(time0: number, time1: number, speed0: number, distance: number) {
	if (has_speed_invalid(time0, time1)) {
		return { speed: 0, instant_speed: 0 };
	}
	var instant_speed = distance / ((time1 - time0) / 1000);

	return {
		speed: (speed0 + instant_speed) / 2,
		instant_speed,
	};
}

export interface Event {
	begin: boolean,
	time: number,
	begin_x: number, begin_y: number,
	prev_x: number, prev_y: number,
	x: number, y: number,
	speed: number, instant_speed: number,
	begin_angle: number, angle: number, instant_angle: number,
	begin_direction: number, direction: number, instant_direction: number,
	distance: number, instant_distance: number,
}

export default abstract class Gesture<P = {}, S = {}> extends UI<P, S> {
	private _identifier = -1;
	private _begin_x = 0;
	private _begin_y = 0;
	private _x = 0;
	private _y = 0;
	private _width = 0;
	private _height = 0;
	private _speed = 0;
	private _time = 0;
	private _ev: Event | null = null;
	private _begin = false;
	private _begin_angle = 0;
	private _begin_direction = 0;
	private _direction = 0;

	private static select_touch(self: Gesture, e: TouchEvent) {
		if (self._identifier != -1) {
			return Array.toArray(e.changedTouches).find(e=>{
				if (e.identifier == self._identifier) {
					return e;
				}
			});
		}
	}

	// @private
	private static handle_touchstart(self: Gesture, e: TouchEvent) {
		if (self._identifier == -1) {
	
			var touch = e.changedTouches[0];
			var x = touch.pageX;
			var y = touch.pageY;
			var time = Date.now();
	
			self._identifier = touch.identifier;
			self._direction = 0;
			self._begin_x = x;
			self._begin_y = y;
			self._x = x;
			self._y = y;
			self._time = time;
			self._speed = 0;
			self._begin = false;
	
			var ev: Event = {
				begin: true,
				time: time,
				begin_x: x, begin_y: y,
				prev_x: x, prev_y: x,
				x: y, y: y,
				speed: 0, instant_speed: 0,
				begin_angle: 0, angle: 0, instant_angle: 0,
				begin_direction: 0, direction: 0, // horizontal_direction: 0, vertical_direction: 0,
				instant_direction: 0, // instant_horizontal_direction: 0, instant_vertical_direction: 0,
				distance: 0, instant_distance: 0,
			};
	
			self.triggerBeginMove(ev);
		}
	}

	// @private
	private static handle_touchmove(self: Gesture, e: TouchEvent) {
	
		var touch = Gesture.select_touch(self, e);
		if (!touch) {
			return;
		}
	
		var prev_time = self._time;
		var time = Date.now();
	
		var x = touch.pageX;
		var y = touch.pageY;
		var p1 = {x: self._begin_x , y: self._begin_y};
		var p2 = {x: self._x, y: self._y};
		var p3 = {x, y};
		// angle, direction
		var angle = get_angle(p1, p3);
		var instant_angle = get_angle(p2, p3);
		var direction = get_direction(angle);
		var instant_direction = get_direction(instant_angle);
		var distance = get_distance(p1, p2);
		var instant_distance = get_distance(p2, p3);
		var {speed, instant_speed} = 
			compute_speed(prev_time, time, self._speed, instant_distance); // px/s
	
		var begin_angle = self._begin_angle;
		var begin_direction = self._begin_direction;
	
		if (!self._begin) { // save begin direction
			self._begin_angle = begin_angle = angle;
			self._begin_direction = begin_direction = direction;
		}
	
		self._x = x;
		self._y = y;
		self._time = time;
		self._speed = speed;

		var ev: Event = {
			begin: !self._begin,
			time: time,
			begin_x: self._begin_x,
			begin_y: self._begin_y,
			prev_x: p2.x, prev_y: p2.y,
			x, y,
			speed, instant_speed,
			begin_angle, angle, instant_angle,
			begin_direction, direction, instant_direction,
			distance, instant_distance,
		};
		self._ev = { ...ev };
		self._begin = true;
	
		self.triggerMove(ev);
	}

	// @private
	private static handle_touchend(self: Gesture, e: TouchEvent) {
	
		var touch = Gesture.select_touch(self, e);
		if (!touch) {
			return;
		}
	
		var ev = self._ev;
		var time = Date.now();
	
		if (ev) {
			if (has_speed_invalid(ev.time, time)) { // 速度失效
				Object.assign(ev, {
					speed: 0, instant_speed: 0,
				});
			}
			// speed, instant_speed,
			// angle, instant_angle,
			// direction, instant_direction,
			// distance, instant_distance,
		} else {
			var x = touch.pageX;
			var y = touch.pageY;
			ev = {
				begin: false,
				time: time,
				begin_x: x, begin_y: y,
				prev_x: x, prev_y: x,
				x: y, y: y,
				speed: 0, instant_speed: 0,
				begin_angle: 0, angle: 0, instant_angle: 0,
				begin_direction: 0, direction: 0, instant_direction: 0,
				distance: 0, instant_distance: 0,
			};
		}

		ev.begin = false;

		self.triggerEndMove(ev);
	
		self._identifier = -1;
		self._time = 0;
		self._speed = 0;
		self._ev = null;
		self._begin = false;
		self._begin_angle = 0;
		self._begin_x = self._begin_y = self._x = self._y = 0;
	}

	protected abstract get $el(): HTMLElement;

	triggerMounted() {
		var el = this.$el;
		el.addEventListener('touchstart', (e)=>Gesture.handle_touchstart(this, e));
		el.addEventListener('touchmove', e=>Gesture.handle_touchmove(this, e));
		el.addEventListener('touchend', e=>Gesture.handle_touchend(this, e));
		this._width = el.clientWidth;
		this._height = el.clientHeight;
	}

	protected triggerBeginMove(e: Event) {}
	protected triggerMove(e: Event) {}
	protected triggerEndMove(e: Event) {}

}