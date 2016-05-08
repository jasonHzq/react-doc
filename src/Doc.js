/*
 * @author jasonHzq
 * @date 2016.05.07
 */

import React, { Component, PropTypes } from 'react';
import { transform } from 'babel-standalone';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/xcode';

const debounce = (func, wait) => {
  let timer = null;

  return (...args) => {
    timer && clearTimeout(timer);

    timer = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

class Doc extends Component {
  static propTypes = {
    backCode: PropTypes.string,
    code: PropTypes.string,
    debounceWaitTime: PropTypes.number,
    showGutter: PropTypes.bool,
  };

  static defaultProps = {
    debounceWaitTime: 500,
    showGutter: true,
    code: '',
    backCode: '',
  };

  constructor(props, ctx) {
    super(props, ctx);
    const { debounceWaitTime, code } = props;

    this.state = {
      code: props.code,
      errorMsg: '',
    };

    this.handleCompile = debounce(this.handleCompile.bind(this), debounceWaitTime);
    this.mountedPreview = this.mountedPreview.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
  }

  componentDidMount() {
    const { code, backCode } = this.props;

    this.handleCompile(code, backCode);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.code !== this.state.code) {
      this.setState({
        code: nextProps.code,
      });
    }
  }

  handleCompile(code) {
    const { backCode } = this.props;

    this.setState({
      code,
    });

    try {
      const parsedCode = transform(backCode + code, {
        presets: ['es2015', 'react', 'stage-0'],
      }).code;

      new Function('React', 'render', parsedCode)(React, this.renderPreview);

      this.setState({
        errorMsg: '',
      });
    } catch (e) {
      this.setState({
        errorMsg: e.toString(),
      });
    }
  }

  renderPreview(preview) {
    this.setState({
      preview,
    });
  }

  mountedPreview(preview) {
    this.preview = preview;
  }

  render() {
    const { code, backCode, className, showGutter, ...rest } = this.props;
    const { errorMsg } = this.state;

    return (
      <div className={`doc-wrapper ${className}`}>
        <AceEditor
          value={this.state.code}
          mode="javascript"
          theme="xcode"
          width="600px"
          tabSize={2}
          enableLiveAutocompletion
          enableBasicAutocompletion
          showGutter={showGutter}
          setOptions={{
            useWorker: false,
          }}
          editorProps={{
            $blockScrolling: true,
          }}
          onChange={this.handleCompile}
          {...rest}
        />
        <div
          className="doc-preview"
          ref={this.mountedPreview}
        >
          { errorMsg ? <span className="error-msg">{ errorMsg }</span> : this.state.preview }
        </div>
        <style>
        {`
          .doc-wrapper .ace_editor, .doc-wrapper .doc-preview {
            border: 1px solid rgba(16,16,16,0.1);
            border-radius: 4px;
          }

          .doc-wrapper .ace_editor {
            float: left;
          }

          .doc-wrapper .doc-preview {
            width: 280px;
            float: right;
            padding: 15px 20px;
            background-color: white;
          }

          .doc-wrapper .doc-preview .error-msg {
            color: #c5695c;
          }
        `}
        </style>
      </div>
    );
  }
}

export default Doc;
