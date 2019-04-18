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

export * from '../index';

import './utils.css';

// import jQuery from 'nifty/js/jquery-2.2.4.min.js';
// global.jQuery = global.$ = jQuery;
// import 'nifty/plugins/sparkline/jquery.sparkline.min.js';

import 'nifty/css/bootstrap.css';
import 'nifty/js/bootstrap.js';
import 'nifty/css/nifty.css';
import 'nifty/js/nifty.js';

import 'nifty/plugins/magic-check/css/magic-check.css';
import 'nifty/plugins/pace/pace.css';
import 'nifty/plugins/pace/pace.js';

import 'nifty/plugins/morris-js/morris.css';
import 'nifty/plugins/morris-js/morris.js';
// import 'nifty/plugins/morris-js/raphael-js/raphael.min.js';
import Raphael from 'raphael'; global.Raphael = Raphael;

import 'nifty/css/demo/nifty-demo-icons.css';
import 'nifty/css/demo/nifty-demo.css';
import 'nifty/js/demo/nifty-demo.js';
import 'nifty/js/demo/dashboard.js';
