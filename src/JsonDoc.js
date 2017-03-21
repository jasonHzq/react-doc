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
    onChange: PropTypes.func,
    name: PropTypes.string,
  };

  static defaultProps = {
    debounceWaitTime: 50,
    showGutter: true,
    code: '',
    onChange: () => {},
    name: 'ace-json-editor',
  };

  constructor(props, ctx) {
    super(props, ctx);
    const { debounceWaitTime, code } = props;

    this.state = {
      code: props.code,
      errorMsg: '',
    };

    this.handleCompile = this.handleCompile.bind(this);
  }

  componentDidMount() {
    const { code } = this.props;

    this.handleCompile(code);
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

      this.setState({
        errorMsg: '',
      });
      this.props.onChange(code);
    } catch (e) {
      this.setState({
        errorMsg: e.message || e.toString(),
      });
    }
  }

  formate(code) {
    return JSON.stringify(code || this.state.code, '', 2);
  }

  render() {
    const { code, className, showGutter, onChange, name, ...rest } = this.props;
    const { errorMsg } = this.state;

    return (
      <div className={`doc-wrapper ${className}`}>
        <AceEditor
          value={this.state.code}
          mode="json"
          theme="tomorrow"
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

export default JsonDoc;
