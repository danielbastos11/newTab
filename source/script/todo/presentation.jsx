// Individual task
let Task = (props) => {
  return (
    <li>
      <div className="checkbox" onClick={() => props.onClick(props.index)}>
      </div>
      {props.todo}
    </li>
  );
};

// List of tags
let List = React.createClass({
  render(){
    return (
      <ul className="list">
        {this._getTasks()}
      </ul>
    )
  },

  _getTasks(){
    let todos = this.props.todos,
        onClick = this.props.taskCompleted;

    return todos.map((todo, index) => {
      let props = {todo, onClick, index};
      return <Task {...props} />;
    });
  }
});

// Counter
let Counter = (props) => {
  let taskCount = props.taskCount;
  let count = taskCount == 1 ? 'tarefa não concluída'
                             : 'tarefas não concluídas';
  let frase = taskCount == 0 ? 'Não fez mais que sua obrigação'
                             : 'Vá trabalhar, seu vagabundo!';

  return (
    <div className="counter">
      <h1>{taskCount}</h1>
      <h2>{count}</h2>
      <span className="phrase">{frase}</span>
      <input type="text" placeholder="+ Add Tarefa"
             onKeyPress={props.onKeyPress}>
      </input>
    </div>
  );
};

export { Counter, List };
