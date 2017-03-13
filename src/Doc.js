/*
 * @author jasonHzq
 * @date 2016.05.07
 */

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { transform } from 'babel-standalone';
import AceEditor from 'ch-react-ace';

import 'ch-brace/mode/javascript';
import 'ch-brace/theme/xcode';

const debounce = (func, wait) => {
  let timer = null;

  return (...args) => {
    timer && clearTimeout(timer);

    timer = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

function defaultView() {
  return <div></div>;
}

const STYLE = `
.doc-wrapper .ace_editor {
  margin: 10px auto;
}

.error-msg {
  color: #c5695c;
}
`;

class Doc extends Component {
  static propTypes = {
    code: PropTypes.string,
    debounceWaitTime: PropTypes.number,
    showGutter: PropTypes.bool,
    ctx: PropTypes.object,
    onChange: PropTypes.func,
    name: PropTypes.string,
  };

  static defaultProps = {
    debounceWaitTime: 500,
    showGutter: true,
    code: '',
    backCode: '',
    ctx: {},
    plugins: [],
    name: 'ace-js-editor',
  };

  constructor(props, ctx) {
    super(props, ctx);
    const { debounceWaitTime, code } = props;

    this.state = {
      code: props.code,
      errorMsg: '',
    };

    this.handleCompile = debounce(this.handleCompile.bind(this), debounceWaitTime);
    this.renderPreview = this.renderPreview.bind(this);
  }

  componentDidMount() {
    const { code } = this.props;

    this.handleCompile(code);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.code !== this.props.code && nextProps.code !== this.state.code) {
      this.setState({
        code: nextProps.code,
      });
      this.handleCompile(nextProps.code);
    }
  }

  updateCode(updator) {
    const newCode = updator(this.state.code);

    this.handleCompile(newCode);
  }

  handleCompile(code) {
    const { ctx, plugins } = this.props;

    this.setState({
      code,
    });

    try {
      const parsedCode = transform(code, {
        presets: ['es2015', 'react', 'stage-0'],
        plugins,
      }).code;

      const keys = Object.keys(ctx);
      const vals = keys.map(key => ctx[key]);

      new Function('render', ...keys, parsedCode)(this.renderPreview, ...vals);

      this.setState({
        errorMsg: '',
      });
    } catch (e) {
      this.setState({
        errorMsg: e.toString(),
      });
      console.log(e.stack);
    }
  }

  renderPreview(preview) {
    const { code } = this.state;
    const { onChange } = this.props;

    if (onChange) {
      onChange(code);
    }

    if (this.props.previewContainer && preview) {
      ReactDOM.render(this.props.getPreview(preview), this.props.previewContainer);
    }
    if (this.props.reportElement && preview) {
      this.props.reportElement(preview);
    }
  }

  render() {
    const { code, backCode, className, showGutter, onChange, name, ...rest } = this.props;
    const { errorMsg } = this.state;

    return (
      <div className={`doc-wrapper ${className}`}>
        <AceEditor
          value={this.state.code}
          mode="javascript"
          theme="xcode"
          width="650px"
          tabSize={2}
          name={name}
          showPrintMargin={false}
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
          className="doc-error"
        >
          { errorMsg ? <span className="error-msg">{ errorMsg }</span> : null }
        </div>
        <style>
        {STYLE}
        </style>
      </div>
    );
  }
}

export default Doc;
