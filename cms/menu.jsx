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


export default class Menu extends Component {
	render() {
		return (
			<nav id="mainnav-container">
			    <div id="mainnav">

			        {/*--Menu--*/}
			        {/*--================================--*/}
			        <div id="mainnav-menu-wrap">
			            <div className="nano">
			                <div className="nano-content">

			                    {/*--Profile Widget--*/}
			                    {/*--================================--*/}
			                    <div id="mainnav-profile" className="mainnav-profile">
			                        <div className="profile-wrap">
			                            <div className="pad-btm">
			                                <span className="label label-success pull-right">New</span>
			                                <img className="img-circle img-sm img-border" src="nifty/img/profile-photos/1.png" alt="Profile Picture"/>
			                            </div>
			                            <a href="#profile-nav" className="box-block" data-toggle="collapse" aria-expanded="false">
			                                <span className="pull-right dropdown-toggle">
			                                    <i className="dropdown-caret"></i>
			                                </span>
			                                <p className="mnp-name">Aaron Chavez</p>
			                                <span className="mnp-desc">aaron.cha@themeon.net</span>
			                            </a>
			                        </div>
			                        <div id="profile-nav" className="collapse list-group bg-trans">
			                            <a href="#" className="list-group-item">
			                                <i className="demo-pli-male icon-lg icon-fw"></i> View Profile
			                            </a>
			                            <a href="#" className="list-group-item">
			                                <i className="demo-pli-gear icon-lg icon-fw"></i> Settings
			                            </a>
			                            <a href="#" className="list-group-item">
			                                <i className="demo-pli-information icon-lg icon-fw"></i> Help
			                            </a>
			                            <a href="#" className="list-group-item">
			                                <i className="demo-pli-unlock icon-lg icon-fw"></i> Logout
			                            </a>
			                        </div>
			                    </div>


			                    {/*--Shortcut buttons--*/}
			                    {/*--================================--*/}
			                    <div id="mainnav-shortcut">
			                        <ul className="list-unstyled">
			                            <li className="col-xs-3" data-content="My Profile">
			                                <a className="shortcut-grid" href="#">
			                                    <i className="demo-psi-male"></i>
			                                </a>
			                            </li>
			                            <li className="col-xs-3" data-content="Messages">
			                                <a className="shortcut-grid" href="#">
			                                    <i className="demo-psi-speech-bubble-3"></i>
			                                </a>
			                            </li>
			                            <li className="col-xs-3" data-content="Activity">
			                                <a className="shortcut-grid" href="#">
			                                    <i className="demo-psi-thunder"></i>
			                                </a>
			                            </li>
			                            <li className="col-xs-3" data-content="Lock Screen">
			                                <a className="shortcut-grid" href="#">
			                                    <i className="demo-psi-lock-2"></i>
			                                </a>
			                            </li>
			                        </ul>
			                    </div>
			                    {/*--================================--*/}
			                    {/*--End shortcut buttons--*/}


			                    <ul id="mainnav-menu" className="list-group">

			            {/*--Category name--*/}
			            <li className="list-header">Navigation</li>

			            {/*--Menu list item--*/}
			            <li className="active-link">
			                <a href="index.html">
			                    <i className="demo-psi-home"></i>
			                    <span className="menu-title">
									<strong>Dashboard</strong>
								</span>
			                </a>
			            </li>

			            {/*--Menu list item--*/}
			            <li>
			                <a href="#">
			                    <i className="demo-psi-split-vertical-2"></i>
			                    <span className="menu-title">
									<strong>Layouts</strong>
								</span>
								<i className="arrow"></i>
			                </a>

			                {/*--Submenu--*/}
			                <ul className="collapse">
			                    <li><a href="layouts-collapsed-navigation.html">Collapsed Navigation</a></li>
								<li><a href="layouts-offcanvas-navigation.html">Off-Canvas Navigation</a></li>
								<li><a href="layouts-offcanvas-slide-in-navigation.html">Slide-in Navigation</a></li>
								<li><a href="layouts-offcanvas-revealing-navigation.html">Revealing Navigation</a></li>
								<li className="list-divider"></li>
								<li><a href="layouts-aside-right-side.html">Aside on the right side</a></li>
								<li><a href="layouts-aside-left-side.html">Aside on the left side</a></li>
								<li><a href="layouts-aside-dark-theme.html">Dark version of aside</a></li>
								<li className="list-divider"></li>
								<li><a href="layouts-fixed-navbar.html">Fixed Navbar</a></li>
								<li><a href="layouts-fixed-footer.html">Fixed Footer</a></li>
								
			                </ul>
			            </li>

			            {/*--Menu list item--*/}
			            <li>
			                <a href="widgets.html">
			                    <i className="demo-psi-gear-2"></i>
			                    <span className="menu-title">
									<strong>Widgets</strong>
									<span className="pull-right badge badge-warning">24</span>
								</span>
			                </a>
			            </li>

			            <li className="list-divider"></li>

			            {/*--Category name--*/}
			            <li className="list-header">Components</li>

			            {/*--Menu list item--*/}
			            <li>
			                <a href="#">
			                    <i className="demo-psi-boot-2"></i>
			                    <span className="menu-title">UI Elements</span>
								<i className="arrow"></i>
			                </a>

			                {/*--Submenu--*/}
			                <ul className="collapse">
			                    <li><a href="ui-buttons.html">Buttons</a></li>
								<li><a href="ui-panels.html">Panels</a></li>
								<li><a href="ui-modals.html">Modals</a></li>
								<li><a href="ui-progress-bars.html">Progress bars</a></li>
								<li><a href="ui-components.html">Components</a></li>
								<li><a href="ui-typography.html">Typography</a></li>
								<li><a href="ui-list-group.html">List Group</a></li>
								<li><a href="ui-tabs-accordions.html">Tabs &amp; Accordions</a></li>
								<li><a href="ui-alerts-tooltips.html">Alerts &amp; Tooltips</a></li>
								
			                </ul>
			            </li>

			            {/*--Menu list item--*/}
			            <li>
			                <a href="#">
			                    <i className="demo-psi-pen-5"></i>
			                    <span className="menu-title">Forms</span>
								<i className="arrow"></i>
			                </a>

			                {/*--Submenu--*/}
			                <ul className="collapse">
			                    <li><a href="forms-general.html">General</a></li>
								<li><a href="forms-components.html">Advanced Components</a></li>
								<li><a href="forms-validation.html">Validation</a></li>
								<li><a href="forms-wizard.html">Wizard</a></li>
								<li><a href="forms-file-upload.html">File Upload</a></li>
								<li><a href="forms-text-editor.html">Text Editor</a></li>
								<li><a href="forms-markdown.html">Markdown</a></li>
								
			                </ul>
			            </li>

			            {/*--Menu list item--*/}
			            <li>
			                <a href="#">
			                    <i className="demo-psi-receipt-4"></i>
			                    <span className="menu-title">Tables</span>
								<i className="arrow"></i>
			                </a>

			                {/*--Submenu--*/}
			                <ul className="collapse">
			                    <li><a href="tables-static.html">Static Tables</a></li>
								<li><a href="tables-bootstrap.html">Bootstrap Tables</a></li>
								<li><a href="tables-datatable.html">Data Tables</a></li>
								<li><a href="tables-footable.html">Foo Tables</a></li>
								
			                </ul>
			            </li>

			            {/*--Menu list item--*/}
			            <li>
			                <a href="charts.html">
			                    <i className="demo-psi-bar-chart"></i>
			                    <span className="menu-title">Charts</span>
			                </a>
			            </li>

			            <li className="list-divider"></li>

			            {/*--Category name--*/}
			            <li className="list-header">More</li>

			            {/*--Menu list item--*/}
			            <li>
			                <a href="#">
			                    <i className="demo-psi-repair"></i>
			                    <span className="menu-title">Miscellaneous</span>
								<i className="arrow"></i>
			                </a>

			                {/*--Submenu--*/}
			                <ul className="collapse">
			                    <li><a href="misc-timeline.html">Timeline</a></li>
								<li><a href="misc-calendar.html">Calendar</a></li>
								<li><a href="misc-maps.html">Google Maps</a></li>
								
			                </ul>
			            </li>

			            {/*--Menu list item--*/}
			            <li>
			                <a href="#">
			                    <i className="demo-psi-mail"></i>
			                    <span className="menu-title">Email</span>
								<i className="arrow"></i>
			                </a>

			                {/*--Submenu--*/}
			                <ul className="collapse">
			                    <li><a href="mailbox.html">Inbox</a></li>
								<li><a href="mailbox-message.html">View Message</a></li>
								<li><a href="mailbox-compose.html">Compose Message</a></li>
								<li><a href="mailbox-templates.html">Email Templates<span className="label label-info pull-right">New</span></a></li>
								
			                </ul>
			            </li>

			            {/*--Menu list item--*/}
			            <li>
			                <a href="#">
			                    <i className="demo-psi-file-html"></i>
			                    <span className="menu-title">Pages</span>
								<i className="arrow"></i>
			                </a>

			                {/*--Submenu--*/}
			                <ul className="collapse">
			                    <li><a href="pages-blank.html">Blank Page</a></li>
								<li><a href="pages-profile.html">Profile</a></li>
								<li><a href="pages-search-results.html">Search Results</a></li>
								<li><a href="pages-faq.html">FAQ</a></li>
								<li className="list-divider"></li>
								<li><a href="pages-404.html">404 Error</a></li>
								<li><a href="pages-500.html">500 Error</a></li>
								<li className="list-divider"></li>
								<li><a href="pages-login.html">Login</a></li>
								<li><a href="pages-register.html">Register</a></li>
								<li><a href="pages-password-reminder.html">Password Reminder</a></li>
								<li><a href="pages-lock-screen.html">Lock Screen</a></li>
								
			                </ul>
			            </li>


			                        {/*--Menu list item--*/}
			                        <li>
			                            <a href="#">
			                                <i className="demo-psi-tactic"></i>
			                                <span className="menu-title">Menu Level</span>
			                                <i className="arrow"></i>
			                            </a>

			                            {/*--Submenu--*/}
			                            <ul className="collapse">
			                                <li><a href="#">Second Level Item</a></li>
			                                <li><a href="#">Second Level Item</a></li>
			                                <li><a href="#">Second Level Item</a></li>
			                                <li className="list-divider"></li>
			                                <li>
			                                    <a href="#">Third Level<i className="arrow"></i></a>

			                                    {/*--Submenu--*/}
			                                    <ul className="collapse">
			                                        <li><a href="#">Third Level Item</a></li>
			                                        <li><a href="#">Third Level Item</a></li>
			                                        <li><a href="#">Third Level Item</a></li>
			                                        <li><a href="#">Third Level Item</a></li>
			                                    </ul>
			                                </li>
			                                <li>
			                                    <a href="#">Third Level<i className="arrow"></i></a>

			                                    {/*--Submenu--*/}
			                                    <ul className="collapse">
			                                        <li><a href="#">Third Level Item</a></li>
			                                        <li><a href="#">Third Level Item</a></li>
			                                        <li><a href="#">Third Level Item</a></li>
			                                        <li className="list-divider"></li>
			                                        <li><a href="#">Third Level Item</a></li>
			                                        <li><a href="#">Third Level Item</a></li>
			                                    </ul>
			                                </li>
			                            </ul>
			                        </li>


			            <li className="list-divider"></li>

			            {/*--Category name--*/}
			            <li className="list-header">Extras</li>

			            {/*--Menu list item--*/}
			            <li>
			                <a href="#">
			                    <i className="demo-psi-happy"></i>
			                    <span className="menu-title">Icons Pack</span>
								<i className="arrow"></i>
			                </a>

			                {/*--Submenu--*/}
			                <ul className="collapse">
			                    <li><a href="icons-ionicons.html">Ion Icons</a></li>
								<li><a href="icons-themify.html">Themify</a></li>
								<li><a href="icons-font-awesome.html">Font Awesome</a></li>
								
			                </ul>
			            </li>

			            {/*--Menu list item--*/}
			            <li>
			                <a href="#">
			                    <i className="demo-psi-medal-2"></i>
			                    <span className="menu-title">
									PREMIUM ICONS
									<span className="label label-danger pull-right">BEST</span>
								</span>
			                </a>

			                {/*--Submenu--*/}
			                <ul className="collapse">
			                    <li><a href="premium-line-icons.html">Line Icons Pack</a></li>
								<li><a href="premium-solid-icons.html">Solid Icons Pack</a></li>
								
			                </ul>
			            </li>

			            {/*--Menu list item--*/}
			            <li>
			                <a href="helper-classes.html">
			                    <i className="demo-psi-inbox-full"></i>
			                    <span className="menu-title">Helper Classes</span>
			                </a>
			            </li>                                </ul>


			                    {/*--Widget--*/}
			                    {/*--================================--*/}
			                    <div className="mainnav-widget">

			                        {/*-- Show the button on collapsed navigation --*/}
			                        <div className="show-small">
			                            <a href="#" data-toggle="menu-widget" data-target="#demo-wg-server">
			                                <i className="demo-pli-monitor-2"></i>
			                            </a>
			                        </div>

			                        {/*-- Hide the content on collapsed navigation --*/}
			                        <div id="demo-wg-server" className="hide-small mainnav-widget-content">
			                            <ul className="list-group">
			                                <li className="list-header pad-no pad-ver">Server Status</li>
			                                <li className="mar-btm">
			                                    <span className="label label-primary pull-right">15%</span>
			                                    <p>CPU Usage</p>
			                                    <div className="progress progress-sm">
			                                        <div className="progress-bar progress-bar-primary" style={{width: '15%'}}>
			                                            <span className="sr-only">15%</span>
			                                        </div>
			                                    </div>
			                                </li>
			                                <li className="mar-btm">
			                                    <span className="label label-purple pull-right">75%</span>
			                                    <p>Bandwidth</p>
			                                    <div className="progress progress-sm">
			                                        <div className="progress-bar progress-bar-purple" style={{width: '75%'}}>
			                                            <span className="sr-only">75%</span>
			                                        </div>
			                                    </div>
			                                </li>
			                                <li className="pad-ver"><a href="#" className="btn btn-success btn-bock">View Details</a></li>
			                            </ul>
			                        </div>
			                    </div>
			                    {/*--================================--*/}
			                    {/*--End widget--*/}

			                </div>
			            </div>
			        </div>
			        {/*--================================--*/}
			        {/*--End menu--*/}

			    </div>
			</nav>
		)
	}
}
