import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Doc from 'react-doc';

const css = `
  .item {
    margin-top: 20px;
  }
`;

const code = `
const Todo = function(props) {
  const { list } = props;
  const items = list.map((item, i) => {
    const { name, time } = item;

    return (
      <li className="item" key={'item-' + i}>
        {name}
        <p className="time"><span className="title">time: </span> {time}</p>
        <style>
        {css}
        </style>
      </li>
    );
  });

  return (
    <div>
      {items}
    </div>
  );
}

const todoList = [{
  name: 'walk the dog',
  time: '08:00 a.m.',
}, {
  name: 'read book',
  time: '10:00 a.m.',
}, {
  name: 'do homework',
  time: '02:00 p.m.'
}];

render(<Todo list={todoList} />);
`;

class Demo1 extends Component {
  render() {
    return (
      <div>
        <div className="header">demo1</div>
        <Doc code={code} ctx={{ css }} height="600px" className="demo-doc" />
        <style>
        {`
          .demo-doc {
            margin-top: 20px;
          }

          .demo-doc .ace_editor {
            float: left;
            margin-top: 0px;
          }

          .demo-doc .doc-preview {
            width: 280px;
            float: right;
          }
        `}
        </style>
      </div>
    );
  }
}

ReactDOM.render(<Demo1 />, document.getElementById('app'));
