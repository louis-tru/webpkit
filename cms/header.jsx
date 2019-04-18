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

export default class extends Component {
	render() {
		return (
			<header id="navbar">
				<div id="navbar-container" className="boxed">

					{/*--Brand logo & name--*/}
					{/*--================================--*/}
					<div className="navbar-header">
						<a href="index.html" className="navbar-brand">
							<img src="nifty/img/logo.png" alt="Nifty Logo" className="brand-icon" />
							<div className="brand-title">
								<span className="brand-text">Nifty</span>
							</div>
						</a>
					</div>
					{/*--================================--*/}
					{/*--End brand logo & name--*/}

					{/*--Navbar Dropdown--*/}
					{/*--================================--*/}
					<div className="navbar-content clearfix">
						<ul className="nav navbar-top-links pull-left">

							{/*--Navigation toogle button--*/}
							{/*--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--*/}
							<li className="tgl-menu-btn">
								<a className="mainnav-toggle" href="#">
									<i className="demo-pli-view-list"></i>
								</a>
							</li>
							{/*--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--*/}
							{/*--End Navigation toogle button--*/}


							{/*--Notification dropdown--*/}
							{/*--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--*/}
							<li className="dropdown">
								<a href="#" data-toggle="dropdown" className="dropdown-toggle">
									<i className="demo-pli-bell"></i>
									<span className="badge badge-header badge-danger"></span>
								</a>

								{/*--Notification dropdown menu--*/}
								<div className="dropdown-menu dropdown-menu-md">
									<div className="pad-all bord-btm">
										<p className="text-semibold text-main mar-no">You have 9 notifications.</p>
									</div>
									<div className="nano scrollable">
										<div className="nano-content">
											<ul className="head-list">

												{/*-- Dropdown list--*/}
												<li>
													<a href="#">
														<div className="clearfix">
															<p className="pull-left">Database Repair</p>
															<p className="pull-right">70%</p>
														</div>
														<div className="progress progress-sm">
															<div style={{width: '70%'}} className="progress-bar">
																<span className="sr-only">70% Complete</span>
															</div>
														</div>
													</a>
												</li>

												{/*-- Dropdown list--*/}
												<li>
													<a href="#">
														<div className="clearfix">
															<p className="pull-left">Upgrade Progress</p>
															<p className="pull-right">10%</p>
														</div>
														<div className="progress progress-sm">
															<div style={{width: '10%'}} className="progress-bar progress-bar-warning">
																<span className="sr-only">10% Complete</span>
															</div>
														</div>
													</a>
												</li>

												{/*-- Dropdown list--*/}
												<li>
												<a className="media" href="#">
												<span className="badge badge-success pull-right">90%</span>
														<div className="media-left">
															<i className="demo-pli-data-settings icon-2x"></i>
														</div>
														<div className="media-body">
															<div className="text-nowrap">HDD is full</div>
															<small className="text-muted">50 minutes ago</small>
														</div>
													</a>
												</li>

												{/*-- Dropdown list--*/}
												<li>
													<a className="media" href="#">
														<div className="media-left">
															<i className="demo-pli-file-edit icon-2x"></i>
														</div>
														<div className="media-body">
															<div className="text-nowrap">Write a news article</div>
															<small className="text-muted">Last Update 8 hours ago</small>
														</div>
													</a>
												</li>

												{/*-- Dropdown list--*/}
												<li>
												<a className="media" href="#">
													<span className="label label-danger pull-right">New</span>
														<div className="media-left">
															<i className="demo-pli-speech-bubble-7 icon-2x"></i>
														</div>
														<div className="media-body">
															<div className="text-nowrap">Comment Sorting</div>
															<small className="text-muted">Last Update 8 hours ago</small>
														</div>
													</a>
												</li>

												{/*-- Dropdown list--*/}
												<li>
													<a className="media" href="#">
														<div className="media-left">
															<i className="demo-pli-add-user-plus-star icon-2x"></i>
														</div>
														<div className="media-body">
															<div className="text-nowrap">New User Registered</div>
															<small className="text-muted">4 minutes ago</small>
														</div>
													</a>
												</li>

												{/*-- Dropdown list--*/}
												<li className="bg-gray">
													<a className="media" href="#">
														<div className="media-left">
															<img className="img-circle img-sm" alt="Profile Picture" src="nifty/img/profile-photos/9.png"/>
														</div>
														<div className="media-body">
															<div className="text-nowrap">Lucy sent you a message</div>
															<small className="text-muted">30 minutes ago</small>
														</div>
													</a>
												</li>

												{/*-- Dropdown list--*/}
												<li className="bg-gray">
													<a className="media" href="#">
														<div className="media-left">
															<img className="img-circle img-sm" alt="Profile Picture" src="nifty/img/profile-photos/3.png"/>
														</div>
														<div className="media-body">
															<div className="text-nowrap">Jackson sent you a message</div>
															<small className="text-muted">40 minutes ago</small>
														</div>
													</a>
												</li>
											</ul>
										</div>
									</div>

									{/*--Dropdown footer--*/}
									<div className="pad-all bord-top">
										<a href="#" className="btn-link text-dark box-block">
											<i className="fa fa-angle-right fa-lg pull-right"></i>Show All Notifications
										</a>
									</div>
								</div>
							</li>
							{/*--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--*/}
							{/*--End notifications dropdown--*/}


							{/*--Mega dropdown--*/}
							{/*--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--*/}
							<li className="mega-dropdown">
								<a href="#" className="mega-dropdown-toggle">
									<i className="demo-pli-layout-grid"></i>
								</a>
								<div className="dropdown-menu mega-dropdown-menu">
									<div className="row">
										<div className="col-sm-4 col-md-3">

											{/*--Mega menu list--*/}
											<ul className="list-unstyled">
													<li className="dropdown-header"><i className="demo-pli-file icon-fw"></i> Pages</li>
													<li><a href="#">Profile</a></li>
													<li><a href="#">Search Result</a></li>
													<li><a href="#">FAQ</a></li>
													<li><a href="#">Sreen Lock</a></li>
													<li><a href="#" className="disabled">Disabled</a></li>
														</ul>

										</div>
										<div className="col-sm-4 col-md-3">

										{/*--Mega menu list--*/}
										<ul className="list-unstyled">
												<li className="dropdown-header"><i className="demo-pli-mail icon-fw"></i> Mailbox</li>
												<li><a href="#"><span className="pull-right label label-danger">Hot</span>Indox</a></li>
												<li><a href="#">Read Message</a></li>
												<li><a href="#">Compose</a></li>
										</ul>
										<p className="pad-top mar-top bord-top text-sm">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes.</p>
										</div>
										<div className="col-sm-4 col-md-3">
											{/*--Mega menu list--*/}
											<ul className="list-unstyled">
												<li>
													<a href="#" className="media mar-btm">
														<span className="badge badge-success pull-right">90%</span>
														<div className="media-left">
															<i className="demo-pli-data-settings icon-2x"></i>
														</div>
														<div className="media-body">
															<p className="text-semibold text-dark mar-no">Data Backup</p>
															<small className="text-muted">This is the item description</small>
														</div>
													</a>
												</li>
												<li>
													<a href="#" className="media mar-btm">
														<div className="media-left">
															<i className="demo-pli-support icon-2x"></i>
														</div>
														<div className="media-body">
															<p className="text-semibold text-dark mar-no">Support</p>
															<small className="text-muted">This is the item description</small>
														</div>
													</a>
												</li>
												<li>
													<a href="#" className="media mar-btm">
														<div className="media-left">
															<i className="demo-pli-computer-secure icon-2x"></i>
														</div>
														<div className="media-body">
															<p className="text-semibold text-dark mar-no">Security</p>
															<small className="text-muted">This is the item description</small>
														</div>
													</a>
												</li>
												<li>
													<a href="#" className="media mar-btm">
														<div className="media-left">
															<i className="demo-pli-map-2 icon-2x"></i>
														</div>
														<div className="media-body">
															<p className="text-semibold text-dark mar-no">Location</p>
															<small className="text-muted">This is the item description</small>
														</div>
													</a>
												</li>
											</ul>
										</div>
										<div className="col-sm-12 col-md-3">
											<p className="dropdown-header"><i className="demo-pli-file-jpg icon-fw"></i> Gallery</p>
											<ul className="list-unstyled list-inline text-justify">

												<li className="pad-btm">
													<img src="nifty/img/thumbs/mega-menu-2.jpg" alt="thumbs"/>
												</li>
												<li className="pad-btm">
													<img src="nifty/img/thumbs/mega-menu-3.jpg" alt="thumbs"/>
												</li>
												<li className="pad-btm">
													<img src="nifty/img/thumbs/mega-menu-1.jpg" alt="thumbs"/>
												</li>
												<li className="pad-btm">
													<img src="nifty/img/thumbs/mega-menu-4.jpg" alt="thumbs"/>
												</li>
												<li className="pad-btm">
													<img src="nifty/img/thumbs/mega-menu-5.jpg" alt="thumbs"/>
												</li>
												<li className="pad-btm">
													<img src="nifty/img/thumbs/mega-menu-6.jpg" alt="thumbs"/>
												</li>
											</ul>
											<a href="#" className="btn btn-sm btn-block btn-default">Browse Gallery</a>
										</div>
									</div>
								</div>
							</li>
							{/*--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--*/}
							{/*--End mega dropdown--*/}

						</ul>
						<ul className="nav navbar-top-links pull-right">

							{/*--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--*/}
							{/*--End user dropdown--*/}

							<li>
								<a href="#" className="aside-toggle navbar-aside-icon">
									<i className="pci-ver-dots"></i>
								</a>
							</li>
						</ul>
					</div>
					{/*--================================--*/}
					{/*--End Navbar Dropdown--*/}

				</div>
			</header>
		);
	}
}
