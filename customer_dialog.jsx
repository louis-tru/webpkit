import './utils.css';
import './dialog.css';
import React, { Component } from 'react';
import ReactDom from 'react-dom';

class CustomizeDialog extends Component {

  constructor(props) {
    super(props);
    this.state = { opacity: 0 };
  }

  componentDidMount() {
    setTimeout(e => {
      this.setState({ opacity: 1 });
      if (this.refs.prompt) {
        var props = this.props;
        this.refs.prompt.value = typeof props.prompt == 'string' ? props.prompt : '';
      }
    }, 50);
  }

  m_handleClick_1(cb, e) {
    this.setState({ opacity: 0 });
    setTimeout(e => {
      cb(this);
      document.body.removeChild(this.refs.root.parentNode);
    }, 500);
  }

  m_handleChange_1 = e => {

  }

  render() {

    var props = this.props;
    var buttons = props.buttons || {};

    return (
      <div ref="root" className="dialog" style={{ opacity: this.state.opacity }}>
        <div className="modal-dialog">

          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal"><i className="pci-cross pci-circle"></i></button>
              <h4 className="modal-title">{props.text}</h4>
            </div>

            <div className="modal-body" style={{ minHeight: 125 }}>
              <div className="col-md-9">

                {/* <!-- Radio Buttons --> */}
                <div className="radio">
                  <input id="demo-form-radio" className="magic-radio" type="radio" name="form-radio-button" />
                  <label htmlFor="demo-form-radio">吴亦凡星球</label>
                </div>
                <div className="radio">
                  <input id="demo-form-radio-2" className="magic-radio" type="radio" name="form-radio-button" />
                  <label htmlFor="demo-form-radio-2">毛不易星球</label>
                </div>
                <div className="radio">
                  <input id="demo-form-radio-3" className="magic-radio" type="radio" name="form-radio-button" />
                  <label htmlFor="demo-form-radio-3">杨超越星球</label>
                </div>

              </div>
            </div>

            <div className="modal-footer">
              {
                (e => {
                  var r = [];
                  for (var i in buttons) {
                    var t = i[0] == '@' ? i.substr(1) : i;
                    var cls = i[0] == '@' ? 'btn btn-primary' : 'btn btn-default';
                    r.push(<div key={i} className={cls}
                      onClick={this.m_handleClick_1.bind(this, buttons[i])}>{t}</div>);
                  }
                  return r;
                })()
              }
            </div>
          </div>

        </div>
      </div>
    );
  }

  static show_customize(lable, buttons) {
    var div = document.createElement('div');
    document.body.appendChild(div);

    return ReactDom.render(
      <CustomizeDialog
        buttons={buttons}
        text={lable} />, div);
  }
}

export function customize(clabel, cb) {
  cb = cb || function () { }

  return CustomizeDialog.show_customize(clabel, {
    '取消': e => cb(false),
    '@确定': e => cb(true),
    // '@确定': e => cb(e.refs.prompt.value, true),
  }, true);
}
