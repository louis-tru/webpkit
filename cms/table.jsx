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

import CMSPage from './page';
import { Root, React } from '..';
import 'nifty/plugins/datatables/media/js/jquery.dataTables.js';
import 'nifty/plugins/datatables/media/css/dataTables.bootstrap.css';
import 'nifty/plugins/datatables/extensions/Responsive/css/dataTables.responsive.css';

export default class extends CMSPage {
  onLoad() {
    const flag = this.props.initial === undefined ? true : this.props.initial

    if (flag) {
      $('#demo-dt-basic').dataTable({
        "paging": false,
        "info": false,
        "search": false,
        "searching": false
      })
    }
  }
  // shouldComponentUpdate(a, b) {
  //   debugger
  //   // if (b.loading_complete) {
  //   //   return false
  //   // }
  // }
  renderHeader() {
    let { operating, header } = this.props
    
    if (operating && header.last(0) !== '操作' ) {
      header.push('操作')
    }

    let headArr = []

    for (let i = 0; i < header.length; i++) {
      let item = (<th className="min-tablet" key={i}>{header[i]}</th>)
      headArr.push(item)
    }
    return headArr
  }
  renderLists() {
    let { lists, header, operating, renderLists } = this.props
    // debugger
    return renderLists(header, lists, operating)
  }
  render() {
    return (
      <table id="demo-dt-basic" className="table table-striped table-bordered" cellSpacing="0" width="100%" style={{textAlign: 'center'}}>
        <thead>
          <tr>
            {this.renderHeader()}
          </tr>
        </thead>
        <tbody>
          {this.renderLists()}
        </tbody>
      </table>
    );
  }
}
