// Based on: https://github.com/tastejs/todomvc/blob/gh-pages/examples/react/js/footer.jsx

import React, { Component } from 'react';
import {
  ReactiveElement,
  DataController,
} from '@appbaseio/reactivesearch';

import Utils from './utils';
import TodoButton from './todoButton';

const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';

class TodoFooter extends Component {
  onAllData = (data) => {
    // merging all streaming and historic data
    const todosData = Utils.mergeTodos(data);

    const activeTodoCount = todosData.reduce((accum, todo) => todo._source.completed ? accum : accum + 1, 0);

    const activeTodoWord = Utils.pluralize(activeTodoCount, 'item');

    return (
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {activeTodoWord} left
      </span>
    );
  }

  render() {
    let clearButton = null;

    if (this.props.completedCount > 0) {
      clearButton = (
        <button
          className="clear-completed"
          onClick={this.props.onClearCompleted}
        >
          Clear completed
        </button>
      );
    }

    const nowShowing = this.props.nowShowing;
    return (
      <footer className="footer">
        <DataController
          componentId="ActiveCountSensor"
          visible={false}
          showFilter={false}
          customQuery={
            function (value) {
              return {
                match_all: {},
              };
            }
          }
        />
        <ReactiveElement
          componentId="ActiveCount"
          stream
          showResultStats={false}
          onAllData={this.onAllData}
          react={{
            or: ['ActiveCountSensor'],
          }}
        />
        <ul className="filters">
          <div className="rbc-buttongroup">
            <TodoButton label="All" value="all" active={nowShowing === ALL_TODOS} onClick={this.props.handleToggle} />
            <TodoButton label="Active" value="active" active={nowShowing === ACTIVE_TODOS} onClick={this.props.handleToggle} />
            <TodoButton label="Completed" value="completed" active={nowShowing === COMPLETED_TODOS} onClick={this.props.handleToggle} />
          </div>
        </ul>
        {clearButton}
      </footer>
    );
  }
}

export default TodoFooter;
