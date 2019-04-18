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

import { React, Page, Link, Component } from '..';

export default class DemoSet extends Component {
	render() {
		return (
			<div id="demo-set" className="demo-set">
				<div id="demo-set-body" className="demo-set-body collapse">
					<div id="demo-set-alert"></div>
					<div className="pad-hor bord-btm clearfix">
						<div className="pull-right pad-top">
							<button id="demo-btn-close-settings" className="btn btn-trans">
								<i className="pci-cross pci-circle icon-lg"></i>
							</button>
						</div>
						<div className="media">
							<div className="media-left">
								<i className="demo-pli-gear icon-2x"></i>
							</div>
							<div className="media-body">
								<span className="text-semibold text-lg text-main">Costomize</span>
								<p className="text-muted text-sm">Customize Nifty's layout, sidebars, and color schemes.</p>
							</div>
						</div>
					</div>
					<div className="demo-set-content clearfix">
						<div className="col-xs-6 col-md-3">
							<div className="pad-all bg-gray-light">
								<p className="text-semibold text-main text-lg">Layout</p>
								<p className="text-semibold text-main">Boxed Layout</p>
								<div className="pad-btm">
									<div className="pull-right">
										<input id="demo-box-lay" className="toggle-switch" type="checkbox"/>
										<label for="demo-box-lay"></label>
									</div>
									Boxed Layout
								</div>
								<div className="pad-btm">
									<div className="pull-right">
										<button id="demo-box-img" className="btn btn-sm btn-trans" disabled><i className="pci-hor-dots"></i></button>
									</div>
									Background Images <span className="label label-primary">New</span>
								</div>

								<hr className="new-section-xs bord-no"/>
								<p className="text-semibold text-main">Animations</p>
								<div className="pad-btm">
									<div className="pull-right">
										<input id="demo-anim" className="toggle-switch" type="checkbox"/>
										<label for="demo-anim"></label>
									</div>
									Enable Animations
								</div>
								<div className="pad-btm">
									<div className="select pull-right">
										<select id="demo-ease" defaultValue="effect">
											<option value="effect">ease (Default)</option>
											<option value="easeInQuart">easeInQuart</option>
											<option value="easeOutQuart">easeOutQuart</option>
											<option value="easeInBack">easeInBack</option>
											<option value="easeOutBack">easeOutBack</option>
											<option value="easeInOutBack">easeInOutBack</option>
											<option value="steps">Steps</option>
											<option value="jumping">Jumping</option>
											<option value="rubber">Rubber</option>
										</select>
									</div>
									Transitions
								</div>

								<hr className="new-section-xs bord-no"/>

								<p className="text-semibold text-main text-lg">Header / Navbar</p>
								<div>
									<div className="pull-right">
										<input id="demo-navbar-fixed" className="toggle-switch" type="checkbox"/>
										<label for="demo-navbar-fixed"></label>
									</div>
									Fixed Position
								</div>

								<hr className="new-section-xs bord-no"/>

								<p className="text-semibold text-main text-lg">Footer</p>
								<div className="pad-btm">
									<div className="pull-right">
										<input id="demo-footer-fixed" className="toggle-switch" type="checkbox"/>
										<label for="demo-footer-fixed"></label>
									</div>
									Fixed Position
								</div>
							</div>
						</div>
						<div className="col-lg-9 pos-rel">
							<div className="row">
								<div className="col-lg-4">
									<div className="pad-all">
										<p className="text-semibold text-main text-lg">Sidebars</p>
										<p className="text-semibold text-main">Navigation</p>
										<div className="mar-btm">
											<div className="pull-right">
												<input id="demo-nav-fixed" className="toggle-switch" type="checkbox"/>
												<label for="demo-nav-fixed"></label>
											</div>
											Fixed Position
										</div>
										<div className="mar-btm">
											<div className="pull-right">
												<input id="demo-nav-profile" className="toggle-switch" type="checkbox" />
												<label for="demo-nav-profile"></label>
											</div>
											Widget Profil <small className="label label-primary">New</small>
										</div>
										<div className="mar-btm">
											<div className="pull-right">
												<input id="demo-nav-shortcut" className="toggle-switch" type="checkbox" />
												<label for="demo-nav-shortcut"></label>
											</div>
											Shortcut Buttons
										</div>
										<div className="mar-btm">
											<div className="pull-right">
												<input id="demo-nav-coll" className="toggle-switch" type="checkbox"/>
												<label for="demo-nav-coll"></label>
											</div>
											Collapsed Mode
										</div>

										<div className="clearfix">
											<div className="select pad-btm pull-right">
												<select id="demo-nav-offcanvas" defaultValue="none">
													<option value="none" disabled="disabled">-- Select Mode --</option>
													<option value="push">Push</option>
													<option value="slide">Slide in on top</option>
													<option value="reveal">Reveal</option>
												</select>
											</div>
											Off-Canvas
										</div>

										<p className="text-semibold text-main">Aside</p>
										<div className="mar-btm">
											<div className="pull-right">
												<input id="demo-asd-vis" className="toggle-switch" type="checkbox"/>
												<label for="demo-asd-vis"></label>
											</div>
											Visible
										</div>
										<div className="mar-btm">
											<div className="pull-right">
												<input id="demo-asd-fixed" className="toggle-switch" type="checkbox" />
												<label for="demo-asd-fixed"></label>
											</div>
											Fixed Position
										</div>
										<div className="mar-btm">
											<div className="pull-right">
												<input id="demo-asd-float" className="toggle-switch" type="checkbox" />
												<label for="demo-asd-float"></label>
											</div>
											Floating <span className="label label-primary">New</span>
										</div>
										<div className="mar-btm">
											<div className="pull-right">
												<input id="demo-asd-align" className="toggle-switch" type="checkbox"/>
												<label for="demo-asd-align"></label>
											</div>
											Left Side
										</div>
										<div>
											<div className="pull-right">
												<input id="demo-asd-themes" className="toggle-switch" type="checkbox"/>
												<label for="demo-asd-themes"></label>
											</div>
											Dark Version
										</div>
									</div>
								</div>
								<div className="col-lg-8">
									<div id="demo-theme">
										<div className="row bg-gray-light pad-top">
											<p className="text-semibold text-main text-lg pad-lft">Color Schemes</p>
											<div className="demo-theme-btn col-md-4 pad-ver">
												<p className="text-semibold text-main">Header</p>
												<div className="demo-justify-theme">
													<a href="#" className="demo-theme demo-a-light add-tooltip" data-theme="theme-light" data-type="a" data-title="(A). Light">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-a-navy add-tooltip" data-theme="theme-navy" data-type="a" data-title="(A). Navy Blue">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-a-ocean add-tooltip" data-theme="theme-ocean" data-type="a" data-title="(A). Ocean">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
												</div>
												<div className="demo-justify-theme">
													<a href="#" className="demo-theme demo-a-lime add-tooltip" data-theme="theme-lime" data-type="a" data-title="(A). Lime">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-a-purple add-tooltip" data-theme="theme-purple" data-type="a" data-title="(A). Purple">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-a-dust add-tooltip" data-theme="theme-dust" data-type="a" data-title="(A). Dust">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
												</div>
												<div className="demo-justify-theme">
													<a href="#" className="demo-theme demo-a-mint add-tooltip" data-theme="theme-mint" data-type="a" data-title="(A). Mint">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-a-yellow add-tooltip" data-theme="theme-yellow" data-type="a" data-title="(A). Yellow">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-a-well-red add-tooltip" data-theme="theme-well-red" data-type="a" data-title="(A). Well Red">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
												</div>
												<div className="demo-justify-theme">
													<a href="#" className="demo-theme demo-a-coffee add-tooltip" data-theme="theme-coffee" data-type="a" data-title="(A). Coffee">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-a-prickly-pear add-tooltip" data-theme="theme-prickly-pear" data-type="a" data-title="(A). Prickly pear">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-a-dark add-tooltip" data-theme="theme-dark" data-type="a" data-title="(A). Dark">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
												</div>
											</div>
											<div className="demo-theme-btn col-md-4 pad-ver">
												<p className="text-semibold text-main">Brand</p>
												<div className="demo-justify-theme">
													<a href="#" className="demo-theme demo-b-light add-tooltip" data-theme="theme-light" data-type="b" data-title="(B). Light">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-b-navy add-tooltip" data-theme="theme-navy" data-type="b" data-title="(B). Navy Blue">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-b-ocean add-tooltip" data-theme="theme-ocean" data-type="b" data-title="(B). Ocean">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
												</div>
												<div className="demo-justify-theme">
													<a href="#" className="demo-theme demo-b-lime add-tooltip" data-theme="theme-lime" data-type="b" data-title="(B). Lime">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-b-purple add-tooltip" data-theme="theme-purple" data-type="b" data-title="(B). Purple">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-b-dust add-tooltip" data-theme="theme-dust" data-type="b" data-title="(B). Dust">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
												</div>
												<div className="demo-justify-theme">
													<a href="#" className="demo-theme demo-b-mint add-tooltip" data-theme="theme-mint" data-type="b" data-title="(B). Mint">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-b-yellow add-tooltip" data-theme="theme-yellow" data-type="b" data-title="(B). Yellow">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-b-well-red add-tooltip" data-theme="theme-well-red" data-type="b" data-title="(B). Well red">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
												</div>
												<div className="demo-justify-theme">
													<a href="#" className="demo-theme demo-b-coffee add-tooltip" data-theme="theme-coffee" data-type="b" data-title="(B). Coofee">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-b-prickly-pear add-tooltip" data-theme="theme-prickly-pear" data-type="b" data-title="(B). Prickly pear">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-b-dark add-tooltip" data-theme="theme-dark" data-type="b" data-title="(B). Dark">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
												</div>
											</div>
											<div className="demo-theme-btn col-md-4 pad-ver">
												<p className="text-semibold text-main">Navigation</p>
												<div className="demo-justify-theme">
													<a href="#" className="demo-theme demo-c-light add-tooltip" data-theme="theme-light" data-type="c" data-title="(C). Light">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-c-navy add-tooltip" data-theme="theme-navy" data-type="c" data-title="(C). Navy Blue">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-c-ocean add-tooltip" data-theme="theme-ocean" data-type="c" data-title="(C). Ocean">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
												</div>
												<div className="demo-justify-theme">
													<a href="#" className="demo-theme demo-c-lime add-tooltip" data-theme="theme-lime" data-type="c" data-title="(C). Lime">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-c-purple add-tooltip" data-theme="theme-purple" data-type="c" data-title="(C). Purple">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-c-dust add-tooltip" data-theme="theme-dust" data-type="c" data-title="(C). Dust">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
												</div>
												<div className="demo-justify-theme">
													<a href="#" className="demo-theme demo-c-mint add-tooltip" data-theme="theme-mint" data-type="c" data-title="(C). Mint">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-c-yellow add-tooltip" data-theme="theme-yellow" data-type="c" data-title="(C). Yellow">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-c-well-red add-tooltip" data-theme="theme-well-red" data-type="c" data-title="(C). Well Red">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
												</div>
												<div className="demo-justify-theme">
													<a href="#" className="demo-theme demo-c-coffee add-tooltip" data-theme="theme-coffee" data-type="c" data-title="(C). Coffee">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-c-prickly-pear add-tooltip" data-theme="theme-prickly-pear" data-type="c" data-title="(C). Prickly pear">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
													<a href="#" className="demo-theme demo-c-dark add-tooltip" data-theme="theme-dark" data-type="c" data-title="(C). Dark">
														<div className="demo-theme-brand"></div>
														<div className="demo-theme-head"></div>
														<div className="demo-theme-nav"></div>
													</a>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div id="demo-bg-boxed" className="demo-bg-boxed">
								<div className="demo-bg-boxed-content">
									<p className="text-semibold text-main text-lg mar-no">Background Images</p>
									<p className="text-sm text-muted">Add an image to replace the solid background color</p>
									<div className="row">
										<div className="col-lg-4 text-justify">
											<p className="text-semibold text-main">Blurred</p>
											<div id="demo-blurred-bg" className="text-justify">
												{/*--Blurred Backgrounds--*/}
											</div>
										</div>
										<div className="col-lg-4 text-justify">
											<p className="text-semibold text-main">Polygon &amp; Geometric</p>
											<div id="demo-polygon-bg" className="text-justify">
												{/*--Polygon Backgrounds--*/}
											</div>
										</div>
										<div className="col-lg-4 text-justify">
											<p className="text-semibold text-main">Abstract</p>
											<div id="demo-abstract-bg" className="text-justify">
												{/*--Abstract Backgrounds--*/}
											</div>
										</div>
									</div>
								</div>
								<div className="demo-bg-boxed-footer">
									<button id="demo-close-boxed-img" className="btn btn-primary">Close</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<button id="demo-set-btn" className="btn" data-toggle="collapse" data-target="#demo-set-body"><i className="demo-psi-gear icon-lg"></i></button>
			</div>
		);
	}
}
