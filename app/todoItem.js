// Based on: https://github.com/tastejs/todomvc/blob/gh-pages/examples/react/js/todoItem.jsx

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
import { TextField } from '@appbaseio/reactivesearch';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

class TodoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editText: '',
      editing: false,
      autoFocus: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.editing && this.state.editing) {
      this.setState({ autoFocus: true });
      let node = ReactDOM.findDOMNode(this.refs.editField);
      node = node.childNodes[0].children[0];
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }

  handleBlur = () => {
    this.setState({
      editText: this.props.todo.title,
      editing: false,
    });
  }

  handleSubmit(event) {
    const val = this.state.editText.trim();
    if (val) {
      this.props.onSave(val);
      this.setState({
        editText: val,
        editing: false,
      });
    } else {
      this.props.onDestroy();
    }
  }

  handleEdit = () => {
    this.setState({
      editText: this.props.todo.title,
      editing: true,
    });
  }

  handleKeyDown = (event) => {
    if (event.which === ESCAPE_KEY) {
      this.setState({
        editText: this.props.todo.title,
        editing: false,
      });
    } else if (event.which === ENTER_KEY) {
      this.handleSubmit(event);
    }
  }

  handleChange = (value) => {
    if (this.state.editing) {
      this.setState({ editText: value });
    }
  }

  render() {
    return (
      <li
        className={classNames({
          completed: this.props.todo.completed,
          editing: this.state.editing,
        })}
      >
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.completed}
            onChange={this.props.onToggle}
          />
          <label onDoubleClick={this.handleEdit}>
            {this.props.todo.title}
          </label>
          <button className="destroy" onClick={this.props.onDestroy} />
        </div>
        <TextField
          ref="editField"
          autoFocus={this.state.autoFocus}
          componentId="EditSensor"
          dataField="name"
          className="edit-todo-container"
          defaultSelected={this.state.editText}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
          onValueChange={this.handleChange}
        />
        {
          !this.state.editing &&
          <img src={this.props.todo.avatar} className="user-avatar" data-tip={this.props.todo.name} />
        }
        <ReactTooltip effect="solid" />
      </li>
    );
  }
}

export default TodoItem;
