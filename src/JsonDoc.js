import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import AceEditor from 'ch-react-ace';
import jsonlint from 'jsonlint-mod';
import 'ch-brace/mode/json';
import 'ch-brace/theme/tomorrow';

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

class JsonDoc extends Component {
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
      jsonlint.parse(code);
    } catch (e) {
      this.setState({
        errorMsg: e.message || e.toString(),
      });
      console.log(e.stack);
    }
  }

  render() {
    const { code, className, showGutter, ...rest } = this.props;
    const { errorMsg } = this.state;

    return (
      <div className={`doc-wrapper ${className}`}>
        <AceEditor
          value={this.state.code}
          mode="json"
          theme="tomorrow"
          width="650px"
          tabSize={2}
          name="ace-json-editor"
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
