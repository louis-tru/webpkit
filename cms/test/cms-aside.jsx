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

import { React, Page, Link, Component } from '../../lib';

export default class Aside extends Component {
	render() {
		return (
			<aside id="aside-container">
				<div id="aside">
					<div className="nano">
						<div className="nano-content">
							
							{/*--Nav tabs--*/}
							{/*--================================--*/}
							<ul className="nav nav-tabs nav-justified">
								<li className="active">
									<a href="#demo-asd-tab-1" data-toggle="tab">
										<i className="demo-pli-speech-bubble-7"></i>
									</a>
								</li>
								<li>
									<a href="#demo-asd-tab-2" data-toggle="tab">
										<i className="demo-pli-information icon-fw"></i> Report
									</a>
								</li>
								<li>
									<a href="#demo-asd-tab-3" data-toggle="tab">
										<i className="demo-pli-wrench icon-fw"></i> Settings
									</a>
								</li>
							</ul>
							{/*--================================--*/}
							{/*--End nav tabs--*/}

							{/*-- Tabs Content --*/}
							{/*--================================--*/}
							<div className="tab-content">

								{/*--First tab (Contact list)--*/}
								{/*--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--*/}
								<div className="tab-pane fade in active" id="demo-asd-tab-1">
									<p className="pad-hor mar-top text-semibold text-main">
										<span className="pull-right badge badge-warning">3</span> Family
									</p>

									{/*--Family--*/}
									<div className="list-group bg-trans">
										<a href="#" className="list-group-item">
											<div className="media-left pos-rel">
												<img className="img-circle img-xs" src="nifty/img/profile-photos/2.png" alt="Profile Picture"/>
												<i className="badge badge-success badge-stat badge-icon pull-left"></i>
											</div>
											<div className="media-body">
												<p className="mar-no">Stephen Tran</p>
												<small className="text-muted">Availabe</small>
											</div>
										</a>
										<a href="#" className="list-group-item">
											<div className="media-left pos-rel">
												<img className="img-circle img-xs" src="nifty/img/profile-photos/7.png" alt="Profile Picture"/>
											</div>
											<div className="media-body">
												<p className="mar-no">Brittany Meyer</p>
												<small className="text-muted">I think so</small>
											</div>
										</a>
										<a href="#" className="list-group-item">
											<div className="media-left pos-rel">
												<img className="img-circle img-xs" src="nifty/img/profile-photos/1.png" alt="Profile Picture"/>
												<i className="badge badge-info badge-stat badge-icon pull-left"></i>
											</div>
											<div className="media-body">
												<p className="mar-no">Jack George</p>
												<small className="text-muted">Last Seen 2 hours ago</small>
											</div>
										</a>
										<a href="#" className="list-group-item">
											<div className="media-left pos-rel">
												<img className="img-circle img-xs" src="nifty/img/profile-photos/4.png" alt="Profile Picture"/>
											</div>
											<div className="media-body">
												<p className="mar-no">Donald Brown</p>
												<small className="text-muted">Lorem ipsum dolor sit amet.</small>
											</div>
										</a>
										<a href="#" className="list-group-item">
											<div className="media-left pos-rel">
												<img className="img-circle img-xs" src="nifty/img/profile-photos/8.png" alt="Profile Picture"/>
												<i className="badge badge-warning badge-stat badge-icon pull-left"></i>
											</div>
											<div className="media-body">
												<p className="mar-no">Betty Murphy</p>
												<small className="text-muted">Idle</small>
											</div>
										</a>
										<a href="#" className="list-group-item">
											<div className="media-left pos-rel">
												<img className="img-circle img-xs" src="nifty/img/profile-photos/9.png" alt="Profile Picture"/>
												<i className="badge badge-danger badge-stat badge-icon pull-left"></i>
											</div>
											<div className="media-body">
												<p className="mar-no">Samantha Reid</p>
												<small className="text-muted">Offline</small>
											</div>
										</a>
									</div>

									<hr/>
									<p className="pad-hor text-semibold text-main">
										<span className="pull-right badge badge-success">Offline</span> Friends
									</p>

									{/*--Works--*/}
									<div className="list-group bg-trans">
										<a href="#" className="list-group-item">
											<span className="badge badge-purple badge-icon badge-fw pull-left"></span> Joey K. Greyson
										</a>
										<a href="#" className="list-group-item">
											<span className="badge badge-info badge-icon badge-fw pull-left"></span> Andrea Branden
										</a>
										<a href="#" className="list-group-item">
											<span className="badge badge-success badge-icon badge-fw pull-left"></span> Johny Juan
										</a>
										<a href="#" className="list-group-item">
											<span className="badge badge-danger badge-icon badge-fw pull-left"></span> Susan Sun
										</a>
									</div>


									<hr/>
									<p className="pad-hor mar-top text-semibold text-main">News</p>

									<div className="pad-hor">
										<p className="text-muted">Lorem ipsum dolor sit amet, consectetuer
											<a data-title="45%" className="add-tooltip text-semibold" href="#">adipiscing elit</a>, sed diam nonummy nibh. Lorem ipsum dolor sit amet.
										</p>
										<small className="text-muted"><em>Last Update : Des 12, 2014</em></small>
									</div>


								</div>
								{/*--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--*/}
								{/*--End first tab (Contact list)--*/}


								{/*--Second tab (Custom layout)--*/}
								{/*--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--*/}
								<div className="tab-pane fade" id="demo-asd-tab-2">

									{/*--Monthly billing--*/}
									<div className="pad-all">
										<p className="text-semibold text-main">Billing &amp; reports</p>
										<p className="text-muted">Get <strong>$5.00</strong> off your next bill by making sure your full payment reaches us before August 5, 2016.</p>
									</div>
									<hr className="new-section-xs"/>
									<div className="pad-all">
										<span className="text-semibold text-main">Amount Due On</span>
										<p className="text-muted text-sm">August 17, 2016</p>
										<p className="text-2x text-thin text-main">$83.09</p>
										<button className="btn btn-block btn-success mar-top">Pay Now</button>
									</div>


									<hr/>

									<p className="pad-hor text-semibold text-main">Additional Actions</p>

									{/*--Simple Menu--*/}
									<div className="list-group bg-trans">
										<a href="#" className="list-group-item"><i className="demo-pli-information icon-lg icon-fw"></i> Service Information</a>
										<a href="#" className="list-group-item"><i className="demo-pli-mine icon-lg icon-fw"></i> Usage Profile</a>
										<a href="#" className="list-group-item"><span className="label label-info pull-right">New</span><i className="demo-pli-credit-card-2 icon-lg icon-fw"></i> Payment Options</a>
										<a href="#" className="list-group-item"><i className="demo-pli-support icon-lg icon-fw"></i> Message Center</a>
									</div>


									<hr/>

									<div className="text-center">
										<div><i className="demo-pli-old-telephone icon-3x"></i></div>
										Questions?
										<p className="text-lg text-semibold text-main"> (415) 234-53454 </p>
										<small><em>We are here 24/7</em></small>
									</div>
								</div>
								{/*--End second tab (Custom layout)--*/}
								{/*--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--*/}


								{/*--Third tab (Settings)--*/}
								{/*--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--*/}
								<div className="tab-pane fade" id="demo-asd-tab-3">
									<ul className="list-group bg-trans">
										<li className="pad-top list-header">
											<p className="text-semibold text-main mar-no">Account Settings</p>
										</li>
										<li className="list-group-item">
											<div className="pull-right">
												<input className="toggle-switch" id="demo-switch-1" type="checkbox" />
												<label for="demo-switch-1"></label>
											</div>
											<p className="mar-no">Show my personal status</p>
											<small className="text-muted">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</small>
										</li>
										<li className="list-group-item">
											<div className="pull-right">
												<input className="toggle-switch" id="demo-switch-2" type="checkbox"/>
												<label for="demo-switch-2"></label>
											</div>
											<p className="mar-no">Show offline contact</p>
											<small className="text-muted">Aenean commodo ligula eget dolor. Aenean massa.</small>
										</li>
										<li className="list-group-item">
											<div className="pull-right">
												<input className="toggle-switch" id="demo-switch-3" type="checkbox"/>
												<label for="demo-switch-3"></label>
											</div>
											<p className="mar-no">Invisible mode </p>
											<small className="text-muted">Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. </small>
										</li>
									</ul>


									<hr/>

									<ul className="list-group pad-btm bg-trans">
										<li className="list-header"><p className="text-semibold text-main mar-no">Public Settings</p></li>
										<li className="list-group-item">
											<div className="pull-right">
												<input className="toggle-switch" id="demo-switch-4" type="checkbox"/>
												<label for="demo-switch-4"></label>
											</div>
											Online status
										</li>
										<li className="list-group-item">
											<div className="pull-right">
												<input className="toggle-switch" id="demo-switch-5" type="checkbox"/>
												<label for="demo-switch-5"></label>
											</div>
											Show offline contact
										</li>
										<li className="list-group-item">
											<div className="pull-right">
												<input className="toggle-switch" id="demo-switch-6" type="checkbox" />
												<label for="demo-switch-6"></label>
											</div>
											Show my device icon
										</li>
									</ul>



									<hr/>

									<p className="pad-hor text-semibold text-main mar-no">Task Progress</p>
									<div className="pad-all">
										<p>Upgrade Progress</p>
										<div className="progress progress-sm">
											<div className="progress-bar progress-bar-success" style={{width: '15%'}}><span className="sr-only">15%</span></div>
										</div>
										<small className="text-muted">15% Completed</small>
									</div>
									<div className="pad-hor">
										<p>Database</p>
										<div className="progress progress-sm">
											<div className="progress-bar progress-bar-danger" style={{width: '75%'}}><span className="sr-only">75%</span></div>
										</div>
										<small className="text-muted">17/23 Database</small>
									</div>

								</div>
								{/*--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--*/}
								{/*--Third tab (Settings)--*/}

							</div>
						</div>
					</div>
				</div>
			</aside>
		);
	}
}
