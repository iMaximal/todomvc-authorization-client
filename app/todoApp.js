// Based on: https://github.com/tastejs/todomvc/blob/gh-pages/examples/react/js/app.jsx

import React, { Component } from 'react';
import {
  ReactiveBase,
  ReactiveList,
  TextField,
  DataController,
} from '@appbaseio/reactivesearch';

import Utils from './utils';
import TodoList from './todoList';

import './todomvc.scss';
import './style.scss';

const ENTER_KEY = 13;

class TodoApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTodo: '',
    };
    this.onAllData = this.onAllData.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(newTodo) {
    if (!this.props.auth.isAuthenticated() || !this.props.auth.userHasScopes(['write:todos'])) {
      return;
    }
    this.setState({ newTodo });
  }

  handleNewTodoKeyDown(event) {
    if (!this.props.auth.isAuthenticated() || !this.props.auth.userHasScopes(['write:todos'])) {
      return;
    }
    if (event.keyCode !== ENTER_KEY) {
      return;
    }
    event.preventDefault();
    const val = this.state.newTodo.trim();
    if (val) {
      this.props.model.addTodo(val);
      this.setState({ newTodo: '' });
    }
  }

  toggleAll(event) {
    if (!this.props.auth.isAuthenticated() || !this.props.auth.userHasScopes(['write:todos'])) {
      return;
    }
    const checked = event.target.checked;
    this.props.model.toggleAll(checked);
  }

  customQuery(value) {
    return {
      match_all: {},
    };
  }

  onAllData(data) {
    // merging all streaming and historic data
    let todosData = Utils.mergeTodos(data);

    // sorting todos based on creation time
    todosData = todosData.sort((a, b) => a._source.createdAt - b._source.createdAt);

    return (
      <TodoList
        todos={todosData}
        auth={this.props.auth}
        model={this.props.model}
      />
    );
  }

  render() {
    const todos = this.props.model.getValidTodos();

    // check active count of only the todos belonging to current user
    const activeTodoCount = todos.reduce((accum, todo) => todo.completed ? accum : accum + 1, 0);
    const { auth } = this.props;

    return (
      // Please use your own credentials here
      <ReactiveBase
        app="imaximal"
        credentials="85832bUST:c5de05c9-c756-4328-a009-981d6cbe4139"
        type="todo_reactjs"
      >
        <DataController
          componentId="AllTodosSensor"
          visible={false}
          showFilter={false}
          customQuery={this.customQuery}
        />
        <header className="header">
          <h1 className="main-title">Todos with Authorization</h1>
          <p className="auth-text">
            <a className="blog-link auth-link" href="https://medium.appbase.io/securing-a-react-web-app-with-authorization-rules-2e43bf5592ca" target="_blank">Read how we built it!</a>
          </p>
          {
            auth.isAuthenticated() ?
              <p className="auth-text"><a className="auth-link" onClick={auth.logout}>logout</a></p> :
              <p className="auth-text">Please <a className="auth-link" onClick={auth.login}>login</a> to modify todos</p>
          }
          <TextField
            componentId="NewTodoSensor"
            dataField="title"
            className="new-todo-container"
            placeholder="What needs to be done?"
            onKeyDown={this.handleNewTodoKeyDown.bind(this)}
            onValueChange={this.handleChange.bind(this)}
            defaultSelected={this.state.newTodo}
            autoFocus
          />
        </header>

        <section className="main">
          <input
            className="toggle-all"
            type="checkbox"
            onChange={this.toggleAll.bind(this)}
            checked={activeTodoCount === 0}
          />
          <ul className="todo-list">
            <ReactiveList
              stream
              react={{
                or: ['AllTodosSensor'],
              }}
              scrollOnTarget={window}
              showResultStats={false}
              pagination={false}
              onAllData={this.onAllData}
            />
          </ul>
        </section>
      </ReactiveBase>
    );
  }
}

export default TodoApp;
