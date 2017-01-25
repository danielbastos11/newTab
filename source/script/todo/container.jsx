import { List, Counter } from './presentation.jsx'
import tFlux from 'tFlux'

let TaskListContainer = React.createClass({
  render(){
    let store = this.props.store;
    return (
      <div id="todoContainer">
        <Counter taskCount={store.todos.length}
                 onKeyPress={this._onKeyPress} >
        </Counter>
        <List todos={store.todos}
              taskCompleted={this._taskCompleted} >
        </List>
      </div>
    );
  },

  componentWillMount() {
    window.addEventListener('storage', this._listChanged);
  },

  componentWillUnmount(){
    window.removeEventListener('storage', this._listChanged);
  },

  _listChanged(){
    tFlux.dispatch('listChanged');
  },

  _onKeyPress(e){
    if(e.key != 'Enter') return;

    let input = e.currentTarget,
        task  = input.value;

    input.value = '';

    tFlux.dispatch('taskAdded', { task });
  },

  _taskCompleted(index){
    tFlux.dispatch('taskCompleted', { index });
  }
});


export default TaskListContainer;
