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
import Menu from './menu';

class ContentContainer extends Component {
	render() {
		return (
			<div id="content-container">
			  
			  {/*--Page Title--*/}
			  {/*--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--*/}
			  <div id="page-title">
			      <h1 className="page-header text-overflow">Dashboard</h1>

			      {/*--Searchbox--*/}
			      <div className="searchbox">
			          <div className="input-group custom-search-form">
			              <input type="text" className="form-control" placeholder="Search.."/>
			              <span className="input-group-btn">
			                  <button className="text-muted" type="button"><i className="demo-pli-magnifi-glass"></i></button>
			              </span>
			          </div>
			      </div>
			  </div>
			  {/*--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--*/}
			  {/*--End page title--*/}

			  {/*--Page content--*/}
			  {/*--===================================================--*/}
			  <div id="page-content">
			      
					<div className="row">
					    <div className="col-lg-7">
					
					        {/*--Network Line Chart--*/}
					        {/*--===================================================--*/}
					        <div id="demo-panel-network" className="panel">
					            <div className="panel-heading">
					                <div className="panel-control">
					                    <button id="demo-panel-network-refresh" data-toggle="panel-overlay" data-target="#demo-panel-network" className="btn"><i className="demo-pli-repeat-2 icon-lg"></i></button>
					                    <div className="btn-group">
					                        <button className="dropdown-toggle btn" data-toggle="dropdown" aria-expanded="false"><i className="demo-pli-gear icon-lg"></i></button>
					                        <ul className="dropdown-menu dropdown-menu-right">
					                            <li><a href="#">Action</a></li>
					                            <li><a href="#">Another action</a></li>
					                            <li><a href="#">Something else here</a></li>
					                            <li className="divider"></li>
					                            <li><a href="#">Separated link</a></li>
					                        </ul>
					                    </div>
					                </div>
					                <h3 className="panel-title">Network</h3>
					            </div>
					
					            {/*--Morris line chart placeholder--*/}
					            <div id="morris-chart-network" className="morris-full-content"></div>
					
					            {/*--Chart information--*/}
					            <div className="panel-body">
					                <div className="row pad-top">
					                    <div className="col-lg-8">
					                        <div className="media">
					                            <div className="media-left">
					                                <div className="media">
					                                    <p className="text-semibold text-main">Temperature</p>
					                                    <div className="media-left pad-no">
					                                        <span className="text-2x text-semibold text-nowrap text-main">
					                                            <i className="demo-pli-temperature"></i> 43.7
					                                        </span>
					                                    </div>
					                                    <div className="media-body">
					                                        <p className="mar-no">°C</p>
					                                    </div>
					                                </div>
					                            </div>
					                            <div className="media-body pad-lft">
					                                <div className="pad-btm">
					                                    <p className="text-semibold text-main mar-no">Today Tips</p>
					                                    <small>A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.</small>
					                                </div>
					                            </div>
					                        </div>
					                    </div>
					
					                    <div className="col-lg-4">
					                        <p className="text-semibold text-main">Bandwidth Usage</p>
					                        <ul className="list-unstyled">
					                            <li>
					                                <div className="media">
					                                    <div className="media-left">
					                                        <span className="text-2x text-semibold text-main">75.9</span>
					                                    </div>
					                                    <div className="media-body">
					                                        <p className="mar-no">Mbps</p>
					                                    </div>
					                                </div>
					                            </li>
					                            <li>
					                                <div className="clearfix">
					                                    <p className="pull-left mar-no">Outcome</p>
					                                    <p className="pull-right mar-no">75%</p>
					                                </div>
					                                <div className="progress progress-xs">
					                                    <div className="progress-bar progress-bar-info" style={{width: '75%'}}>
					                                        <span className="sr-only">75%</span>
					                                    </div>
					                                </div>
					                            </li>
					                        </ul>
					                    </div>
					                </div>
					            </div>
					
					
					        </div>
					        {/*--===================================================--*/}
					        {/*--End network line chart--*/}
					
					    </div>
					    <div className="col-lg-5">
					        <div className="row">
					            <div className="col-sm-6 col-lg-6">
					
					                {/*--Sparkline Area Chart--*/}
					                <div className="panel panel-success panel-colorful">
					                    <div className="pad-all">
					                        <p className="text-lg text-semibold"><i className="demo-pli-data-storage icon-fw"></i> HDD Usage</p>
					                        <p className="mar-no">
					                            <span className="pull-right text-bold">132Gb</span>
					                            Free Space
					                        </p>
					                        <p className="mar-no">
					                            <span className="pull-right text-bold">1,45Gb</span>
					                            Used space
					                        </p>
					                    </div>
					                    <div className="pad-all text-center">
					                        {/*--Placeholder--*/}
					                        <div id="demo-sparkline-area"></div>
					                    </div>
					                </div>
					            </div>
					            <div className="col-sm-6 col-lg-6">
					
					                {/*--Sparkline Line Chart--*/}
					                <div className="panel panel-info panel-colorful">
					                    <div className="pad-all">
					                        <p className="text-lg text-semibold"><i className="demo-pli-wallet-2 icon-fw"></i> Earning</p>
					                        <p className="mar-no">
					                            <span className="pull-right text-bold">$764</span>
					                            Today
					                        </p>
					                        <p className="mar-no">
					                            <span className="pull-right text-bold">$1,332</span>
					                            Last 7 Day
					                        </p>
					                    </div>
					                    <div className="pad-all text-center">
					
					                        {/*--Placeholder--*/}
					                        <div id="demo-sparkline-line"></div>
					
					                    </div>
					                </div>
					            </div>
					        </div>
					        <div className="row">
					            <div className="col-sm-6 col-lg-6">
					
					                {/*--Sparkline bar chart --*/}
					                <div className="panel panel-purple panel-colorful">
					                    <div className="pad-all">
					                        <p className="text-lg text-semibold"><i className="demo-pli-bag-coins icon-fw"></i> Sales</p>
					                        <p className="mar-no">
					                            <span className="pull-right text-bold">$764</span>
					                            Today
					                        </p>
					                        <p className="mar-no">
					                            <span className="pull-right text-bold">$1,332</span>
					                            Last 7 Day
					                        </p>
					                    </div>
					                    <div className="pad-all text-center">
					
					                        {/*--Placeholder--*/}
					                        <div id="demo-sparkline-bar" className="box-inline"></div>
					
					                    </div>
					                </div>
					            </div>
					            <div className="col-sm-6 col-lg-6">
					
					                {/*--Sparkline pie chart --*/}
					                <div className="panel panel-warning panel-colorful">
					                    <div className="pad-all">
					                        <p className="text-lg text-semibold"><i className="demo-pli-check icon-fw"></i> Task Progress</p>
					                        <p className="mar-no">
					                            <span className="pull-right text-bold">34</span>
					                            Completed
					                        </p>
					                        <p className="mar-no">
					                            <span className="pull-right text-bold">79</span>
					                            Total
					                        </p>
					                    </div>
					                    <div className="pad-all">
					                        <ul className="list-group list-unstyled">
					                            <li className="mar-btm">
					                                <span className="label label-warning pull-right">15%</span>
					                                <p>Progress</p>
					                                <div className="progress progress-md">
					                                    <div style={{width: '15%'}} className="progress-bar progress-bar-light">
					                                        <span className="sr-only">15%</span>
					                                    </div>
					                                </div>
					                            </li>
					                        </ul>
					                    </div>
					                </div>
					            </div>
					        </div>
					    </div>
					</div>
					
					<div className="row">
					    <div className="col-lg-4">
					        {/*--List Todo--*/}
					        {/*--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--*/}
					        <div className="panel panel-trans">
					            <div className="panel-heading">
					                <h3 className="panel-title">To do list</h3>
					            </div>
					            <div className="pad-ver">
					                <ul className="list-group bg-trans list-todo mar-no">
					                    <li className="list-group-item">
					                        <input id="demo-todolist-1" className="magic-checkbox" type="checkbox"/>
					                        <label for="demo-todolist-1"><span>Find an idea. <span className="label label-danger">Important</span></span></label>
					                    </li>
					                    <li className="list-group-item">
					                        <input id="demo-todolist-2" className="magic-checkbox" type="checkbox" checked/>
					                        <label for="demo-todolist-2"><span>Do some work</span></label>
					                    </li>
					                    <li className="list-group-item">
					                        <input id="demo-todolist-3" className="magic-checkbox" type="checkbox"/>
					                        <label for="demo-todolist-3"><span>Read the book</span></label>
					                    </li>
					                    <li className="list-group-item">
					                        <input id="demo-todolist-4" className="magic-checkbox" type="checkbox"/>
					                        <label for="demo-todolist-4"><span>Upgrade server <span className="label label-warning">Warning</span></span></label>
					                    </li>
					                    <li className="list-group-item">
					                        <input id="demo-todolist-5" className="magic-checkbox" type="checkbox" checked/>
					                        <label for="demo-todolist-5"><span>Redesign my logo <span className="label label-info">2 Mins</span></span></label>
					                    </li>
					                </ul>
					            </div>
					            <div className="input-group pad-all">
					                <input type="text" className="form-control" placeholder="New task" autocomplete="off"/>
					                <span className="input-group-btn">
					                    <button type="button" className="btn btn-success"><i className="demo-pli-add"></i></button>
					                </span>
					            </div>
					        </div>
					        {/*--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--*/}
					        {/*--End todo list--*/}
					    </div>
					    <div className="col-lg-4">
					        <div className="panel panel-trans">
					            <div className="panel-heading">
					                <div className="panel-control">
					                    <a title="" data-html="true" data-container="body" data-original-title="&lt;p class='h4 text-semibold'&gt;Information&lt;/p&gt;&lt;p style='width:150px'&gt;This is an information bubble to help the user.&lt;/p&gt;" href="#" className="demo-psi-information icon-lg icon-fw unselectable text-info add-tooltip"></a>
					                </div>
					                <h3 className="panel-title">Services</h3>
					            </div>
					            <div className="bord-btm">
					                <ul className="list-group bg-trans">
					                    <li className="list-group-item">
					                        <div className="pull-right">
					                            <input id="demo-online-status-checkbox" className="toggle-switch" type="checkbox" checked/>
					                            <label for="demo-online-status-checkbox"></label>
					                        </div>
					                        Online status
					                    </li>
					                    <li className="list-group-item">
					                        <div className="pull-right">
					                            <input id="demo-show-off-contact-checkbox" className="toggle-switch" type="checkbox" checked/>
					                            <label for="demo-show-off-contact-checkbox"></label>
					                        </div>
					                        Show offline contact
					                    </li>
					                    <li className="list-group-item">
					                        <div className="pull-right">
					                            <input id="demo-show-device-checkbox" className="toggle-switch" type="checkbox"/>
					                            <label for="demo-show-device-checkbox"></label>
					                        </div>
					                        Show my device icon
					                    </li>
					                </ul>
					            </div>
					            <div className="panel-body">
					                <div className="pad-btm">
					                    <p className="text-semibold text-main">Upgrade Progress</p>
					                    <div className="progress progress-sm">
					                        <div className="progress-bar progress-bar-purple" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" style={{width: '15%'}} role="progressbar">
					                            <span className="sr-only">15%</span>
					                        </div>
					                    </div>
					                    <small>15% Completed</small>
					                </div>
					                <div className="pad-btm">
					                    <p className="text-semibold text-main">Database</p>
					                    <div className="progress progress-sm">
					                        <div className="progress-bar progress-bar-success" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style={{width: '70%'}} role="progressbar">
					                            <span className="sr-only">70%</span>
					                        </div>
					                    </div>
					                    <small>70% Completed</small>
					                </div>
					            </div>
					        </div>
					    </div>
					    <div class='col-lg-4'>
					        <div className="panel panel-trans">
					            <div className="pad-all">
					                <div className="media mar-btm">
					                    <div className="media-left">
					                        <img src="nifty/img//profile-photos/2.png" className="img-md img-circle" alt="Avatar"/>
					                    </div>
					                    <div className="media-body">
					                        <p className="text-lg text-main text-semibold mar-no">Ralph West</p>
					                        <p>Project manager</p>
					                    </div>
					                </div>
					                <blockquote className="bq-sm bq-open bq-close">Lorem ipsum dolor sit amet, consecte tuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.</blockquote>
					            </div>
					
					            <div className="bord-top">
					                <ul className="list-group bg-trans bord-no">
					                    <li className="list-group-item list-item-sm">
					                        <div className="media-left">
					                            <i className="demo-psi-facebook icon-lg"></i>
					                        </div>
					                        <div className="media-body">
					                            <a href="#" className="btn-link text-semibold">Facebook</a>
					                        </div>
					                    </li>
					                    <li className="list-group-item list-item-sm">
					                        <div className="media-left">
					                            <i className="demo-psi-twitter icon-lg"></i>
					                        </div>
					                        <div className="media-body">
					                            <a href="#" className="btn-link text-semibold">@RalphWe</a>
					                            <br/>
					                            Design my themes with <a href="#" className="btn-link text-bold">#Bootstrap</a> Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
					                        </div>
					                    </li>
					                    <li className="list-group-item list-item-sm">
					                        <div className="media-left">
					                            <i className="demo-psi-instagram icon-lg"></i>
					                        </div>
					                        <div className="media-body">
					                            <a href="#" className="btn-link text-semibold">Ralphz</a>
					                        </div>
					                    </li>
					                    <li className="list-group-item list-item-sm">
					                        <div className="media-body">
					
					                        </div>
					                    </li>
					                </ul>
					            </div>
					        </div>
					    </div>
					</div>
					
					<div className="row">
					    <div className="col-xs-12">
					        <div className="panel">
					            <div className="panel-heading">
					                <h3 className="panel-title">Order Status</h3>
					            </div>
					
					            {/*--Data Table--*/}
					            {/*--===================================================--*/}
					            <div className="panel-body">
					                <div className="pad-btm form-inline">
					                    <div className="row">
					                        <div className="col-sm-6 table-toolbar-left">
					                            <button className="btn btn-purple"><i className="demo-pli-add icon-fw"></i>Add</button>
					                            <button className="btn btn-default"><i className="demo-pli-printer"></i></button>
					                            <div className="btn-group">
					                                <button className="btn btn-default"><i className="demo-pli-information"></i></button>
					                                <button className="btn btn-default"><i className="demo-pli-recycling"></i></button>
					                            </div>
					                        </div>
					                        <div className="col-sm-6 table-toolbar-right">
					                            <div className="form-group">
					                                <input type="text" autocomplete="off" className="form-control" placeholder="Search" id="demo-input-search2"/>
					                            </div>
					                            <div className="btn-group">
					                                <button className="btn btn-default"><i className="demo-pli-download-from-cloud"></i></button>
					                                <div className="btn-group">
					                                    <button className="btn btn-default dropdown-toggle" data-toggle="dropdown">
					                                        <i className="demo-pli-gear"></i>
					                                        <span className="caret"></span>
					                                    </button>
					                                    <ul className="dropdown-menu dropdown-menu-right" role="menu">
					                                        <li><a href="#">Action</a></li>
					                                        <li><a href="#">Another action</a></li>
					                                        <li><a href="#">Something else here</a></li>
					                                        <li className="divider"></li>
					                                        <li><a href="#">Separated link</a></li>
					                                    </ul>
					                                </div>
					                            </div>
					                        </div>
					                    </div>
					                </div>
					                <div className="table-responsive">
					                    <table className="table table-striped">
					                        <thead>
					                            <tr>
					                                <th>Invoice</th>
					                                <th>User</th>
					                                <th>Order date</th>
					                                <th>Amount</th>
					                                <th className="text-center">Status</th>
					                                <th className="text-center">Tracking Number</th>
					                            </tr>
					                        </thead>
					                        <tbody>
					                            <tr>
					                                <td><a href="#" className="btn-link"> Order #53431</a></td>
					                                <td>Steve N. Horton</td>
					                                <td><span className="text-muted"><i className="fa fa-clock-o"></i> Oct 22, 2014</span></td>
					                                <td>$45.00</td>
					                                <td className="text-center">
					                                    <div className="label label-table label-success">Paid</div>
					                                </td>
					                                <td className="text-center">-</td>
					                            </tr>
					                            <tr>
					                                <td><a href="#" className="btn-link"> Order #53432</a></td>
					                                <td>Charles S Boyle</td>
					                                <td><span className="text-muted"><i className="fa fa-clock-o"></i> Oct 24, 2014</span></td>
					                                <td>$245.30</td>
					                                <td className="text-center">
					                                    <div className="label label-table label-info">Shipped</div>
					                                </td>
					                                <td className="text-center"><i className="fa fa-plane"></i> CGX0089734531</td>
					                            </tr>
					                            <tr>
					                                <td><a href="#" className="btn-link"> Order #53433</a></td>
					                                <td>Lucy Doe</td>
					                                <td><span className="text-muted"><i className="fa fa-clock-o"></i> Oct 24, 2014</span></td>
					                                <td>$38.00</td>
					                                <td className="text-center">
					                                    <div className="label label-table label-info">Shipped</div>
					                                </td>
					                                <td className="text-center"><i className="fa fa-plane"></i> CGX0089934571</td>
					                            </tr>
					                            <tr>
					                                <td><a href="#" className="btn-link"> Order #53434</a></td>
					                                <td>Teresa L. Doe</td>
					                                <td><span className="text-muted"><i className="fa fa-clock-o"></i> Oct 15, 2014</span></td>
					                                <td>$77.99</td>
					                                <td className="text-center">
					                                    <div className="label label-table label-info">Shipped</div>
					                                </td>
					                                <td className="text-center"><i className="fa fa-plane"></i> CGX0089734574</td>
					                            </tr>
					                            <tr>
					                                <td><a href="#" className="btn-link"> Order #53435</a></td>
					                                <td>Teresa L. Doe</td>
					                                <td><span className="text-muted"><i className="fa fa-clock-o"></i> Oct 12, 2014</span></td>
					                                <td>$18.00</td>
					                                <td className="text-center">
					                                    <div className="label label-table label-success">Paid</div>
					                                </td>
					                                <td className="text-center">-</td>
					                            </tr>
					                            <tr>
					                                <td><a href="#" className="btn-link">Order #53437</a></td>
					                                <td>Charles S Boyle</td>
					                                <td><span className="text-muted"><i className="fa fa-clock-o"></i> Oct 17, 2014</span></td>
					                                <td>$658.00</td>
					                                <td className="text-center">
					                                    <div className="label label-table label-danger">Refunded</div>
					                                </td>
					                                <td className="text-center">-</td>
					                            </tr>
					                            <tr>
					                                <td><a href="#" className="btn-link">Order #536584</a></td>
					                                <td>Scott S. Calabrese</td>
					                                <td><span className="text-muted"><i className="fa fa-clock-o"></i> Oct 19, 2014</span></td>
					                                <td>$45.58</td>
					                                <td className="text-center">
					                                    <div className="label label-table label-warning">Unpaid</div>
					                                </td>
					                                <td className="text-center">-</td>
					                            </tr>
					                        </tbody>
					                    </table>
					                </div>
					                <hr/>
					                <div className="pull-right">
					                    <ul className="pagination text-nowrap mar-no">
					                        <li className="page-pre disabled">
					                            <a href="#">&lt;</a>
					                        </li>
					                        <li className="page-number active">
					                            <span>1</span>
					                        </li>
					                        <li className="page-number">
					                            <a href="#">2</a>
					                        </li>
					                        <li className="page-number">
					                            <a href="#">3</a>
					                        </li>
					                        <li>
					                            <span>...</span>
					                        </li>
					                        <li className="page-number">
					                            <a href="#">9</a>
					                        </li>
					                        <li className="page-next">
					                            <a href="#">&gt;</a>
					                        </li>
					                    </ul>
					                </div>
					            </div>
					            {/*--===================================================--*/}
					            {/*--End Data Table--*/}
					
					        </div>
					    </div>
					</div>
					
					

			  </div>
			  {/*--===================================================--*/}
			  {/*--End page content--*/}

			</div>
		);
	}
}

class Aside extends Component {
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
			                                    <input className="toggle-switch" id="demo-switch-1" type="checkbox" checked/>
			                                    <label for="demo-switch-1"></label>
			                                </div>
			                                <p className="mar-no">Show my personal status</p>
			                                <small className="text-muted">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</small>
			                            </li>
			                            <li className="list-group-item">
			                                <div className="pull-right">
			                                    <input className="toggle-switch" id="demo-switch-2" type="checkbox" checked/>
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
			                                    <input className="toggle-switch" id="demo-switch-4" type="checkbox" checked/>
			                                    <label for="demo-switch-4"></label>
			                                </div>
			                                Online status
			                            </li>
			                            <li className="list-group-item">
			                                <div className="pull-right">
			                                    <input className="toggle-switch" id="demo-switch-5" type="checkbox" checked/>
			                                    <label for="demo-switch-5"></label>
			                                </div>
			                                Show offline contact
			                            </li>
			                            <li className="list-group-item">
			                                <div className="pull-right">
			                                    <input className="toggle-switch" id="demo-switch-6" type="checkbox" checked/>
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

export default class extends Component {
	render() {
		return (
			<div className="boxed">

				{/*<ContentContainer />*/}

				<Aside />

				<Menu />

			</div>
		);
	}
}
