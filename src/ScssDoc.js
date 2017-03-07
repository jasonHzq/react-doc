import Sass from 'sass.js/dist/sass.js';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import AceEditor from 'ch-react-ace';
import 'ch-brace/mode/scss';
import 'ch-brace/theme/tomorrow';

Sass.setWorkerUrl('http://sass.js.org/js/sass.js/sass.worker.js');
const sass = new Sass();

const debounce = (func, wait) => {
  let timer = null;

  return (...args) => {
    timer && clearTimeout(timer);

    timer = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

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
  };

  static defaultProps = {
    debounceWaitTime: 500,
    showGutter: true,
    code: '',
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
    }
  }

  updateCode(updator) {
    const newCode = updator(this.state.code);

    this.handleCompile(newCode);
  }

  handleCompile(code) {
    this.setState({
      code,
    });

    try {
      sass.compile(code, resule => {
        const parsedCode = resule.text;
        const errorMsg = resule.formatted;

        if (errorMsg) {
          this.setState({
            errorMsg,
          });
        } else {
          this.setState({
            errorMsg: '',
          });

          this.renderPreview(parsedCode);
        }
      });
    } catch (e) {
      this.setState({
        errorMsg: e.toString(),
      });
      console.log(e.stack);
    }
  }

  renderPreview(preview) {
    const previewDom = (
      <style>
        {preview}
      </style>
    );

    if (this.props.previewContainer) {
      ReactDOM.render(previewDom, this.props.previewContainer);
    }

    if (this.props.reportElement) {
      this.props.reportElement(preview, previewDom);
    }
  }

  render() {
    const { code, className, showGutter, ...rest } = this.props;
    const { errorMsg } = this.state;

    return (
      <div className={`doc-wrapper ${className}`}>
        <AceEditor
          value={this.state.code}
          mode="scss"
          theme="tomorrow"
          width="650px"
          tabSize={2}
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
