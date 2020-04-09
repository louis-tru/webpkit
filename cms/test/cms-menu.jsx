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

import { React } from '../../lib';
import Menu from '../menu';

export default class TestMenu extends Menu {

	renderMain() {
		return [
			'Navigation',
			{ icon: 'demo-psi-home', title: 'Dashboard', go: 'index.html', bold:1 },
			{
				icon: 'demo-psi-split-vertical-2', title: 'Layouts', selected:1, children: [
					{ title: 'Collapsed Navigation', go: 'layouts-collapsed-navigation.html' },
					{ title: 'Off-Canvas Navigation', go: 'layouts-offcanvas-navigation.html' },
					{ title: 'Slide-in Navigation', go: 'layouts-offcanvas-slide-in-navigation.html' },
					{ title: 'Revealing Navigation', go: 'layouts-offcanvas-revealing-navigation.html' },
					'-',
					{ title: 'Aside on the right side', go: 'layouts-aside-right-side.html' },
					{ title: 'Aside on the left side', go: 'layouts-aside-left-side.html' },
					{ go: 'layouts-aside-dark-theme.html', title: 'Dark version of aside' },
					'-',
					{ title: 'Fixed Navbar', go: 'layouts-fixed-navbar.html' },
					{ title: 'Fixed Footer', go: 'layouts-fixed-footer.html' },
				],
			},
			{ icon: 'demo-psi-gear-2', title: 'Widgets', num: 24, go: 'widgets.html', bold:1 },
			'-',
			'Components',
			{
				icon: 'demo-psi-boot-2', title: 'UI Elements', children: [
					{ title: 'Buttons', go: 'ui-buttons.html' },
					{ title: 'Panels', go: 'ui-panels.html' },
					{ title: 'Modals', go: 'ui-modals.html' },
					{ title: 'Progress bars', go: 'ui-progress-bars.html' },
					{ title: 'Components', go: 'ui-components.html' },
					{ title: 'Typography', go: 'ui-typography.html' },
					{ title: 'List Group', go: 'ui-list-group.html' },
					{ title: 'Tabs &amp; Accordions', go: 'ui-tabs-accordions.html' },
					{ title: 'Alerts &amp; Tooltips', go: 'ui-alerts-tooltips.html' },
				],
			},
			{ icon: 'demo-psi-pen-5', 'title': 'Forms', children: [
					{ title: 'General', go: 'forms-general.html' },
					{ title: 'Advanced Components', go: 'forms-components.html' },
					{ title: 'Validation', go: 'forms-validation.html' },
					{ title: 'Wizard', go: 'forms-wizard.html' },
					{ title: 'File Upload', go: 'forms-file-upload.html' },
					{ title: 'Text Editor', go: 'forms-text-editor.html' },
					{ title: 'Markdown', go: 'forms-markdown.html' },
				],
			},
			{ icon: 'demo-psi-receipt-4', title: 'Tables', children: [
					{ title: 'Static Tables',  go: 'tables-static.html' },
					{ title: 'Bootstrap Tables',  go: 'tables-bootstrap.html' },
					{ title: 'Data Tables',  go: 'tables-datatable.html' },
					{ title: 'Foo Tables',  go: 'tables-footable.html' },
				],
			},
			{ icon: 'demo-psi-bar-chart', title: 'Charts', go: 'charts.html' },
			'-',
			'More',
			{ icon: 'demo-psi-repair', title: 'Miscellaneous', children: [
					{ title: 'Timeline', go: 'misc-timeline.html' },
					{ title: 'Calendar', go: 'misc-calendar.html' },
					{ title: 'Google Maps', go: 'misc-maps.html' },
				],
			},
			{ icon: 'demo-psi-mail', title: 'Email', children: [
					{ title: 'Inbox', go: 'mailbox.html' },
					{ title: 'View Message', go: 'mailbox-message.html' },
					{ title: 'Compose Message', go: 'mailbox-compose.html' },
					{ title: 'Email Templates', go: 'mailbox-templates.html', label: 'New', color: 'label-info' },
				],
			},
			{
				icon: 'demo-psi-file-html', title: 'Pages', children: [
					{ title: 'Blank Page', go: 'pages-blank.html' },
					{ title: 'Profile', go: 'pages-profile.html' },
					{ title: 'Search Results', go: 'pages-search-results.html' },
					{ title: 'FAQ', go: 'pages-faq.html' },
					'-',
					{ title: '404 Error', go: 'pages-404.html' },
					{ title: '500 Error', go: 'pages-500.html' },
					'-',
					{ title: 'Login', go: 'pages-login.html' },
					{ title: 'Register', go: 'pages-register.html' },
					{ title: 'Password Reminder', go: 'pages-password-reminder.html' },
					{ title: 'Lock Screen', go: 'pages-lock-screen.html' },
				],
			},
			{
				icon: 'demo-psi-tactic', title: 'Menu Level', children: [
					{ title: 'Second Level Item', go: '#' },
					{ title: 'Second Level Item', go: '#' },
					{ title: 'Second Level Item', go: '#' },
					'-',
					{ title: 'Third Level', children: [
							{ title: 'Third Level Item', go: '#' },
							{ title: 'Third Level Item', go: '#' },
							{ title: 'Third Level Item', go: '#' },
							{ title: 'Third Level Item', go: '#' },
						],
					},
					{ title: 'Third Level', children: [
							{ title: 'Third Level Item', go: '#' },
							{ title: 'Third Level Item', go: '#' },
							{ title: 'Third Level Item', go: '#' },
							'-',
							{ title: 'Third Level Item', go: '#' },
							{ title: 'Third Level Item', go: '#' },
						],
					},
				],
			},
			'-',
			'Extras',
			{ icon: 'demo-psi-happy', title: 'Icons Pack', children: [
					{ title: 'Ion Icons', go: 'icons-ionicons.html' },
					{ title: 'Themify', go: 'icons-themify.html' },
					{ title: 'Font Awesome', go: 'icons-font-awesome.html' },
				],
			},
			{ icon: 'demo-psi-medal-2', title: 'PREMIUM ICONS', label: 'BEST', color: '#ef5350', children: [
					{ title: 'Line Icons Pack', go: 'premium-line-icons.html' },
					{ title: 'Solid Icons Pack', go: 'premium-solid-icons.html' },
				],
			},
			{ icon: 'demo-psi-inbox-full', title: 'Helper Classes', go: 'helper-classes.html' },
		];
	}

	renderProfile() {
		return (
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
		);
	}

	renderShortcut() {
		return (
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
		);
	}

	renderWidget() {
		return (
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
		);
	}

}
