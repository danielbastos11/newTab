import tFlux from 'tFlux'

let _fetchList = () => {
  let todos = localStorage.getItem('list');
  return todos ? todos.split(',') : [];
};

let taskStore = tFlux.store({
  todos: _fetchList()
});

taskStore.on('listChanged', (action, state) => {
  let todos = _fetchList();

  return { todos };
});

taskStore.on('taskAdded', (action, state) => {
  let todos = state.todos.concat(action.task);
  localStorage.setItem('list', todos);

  return { todos };
});

taskStore.on('taskCompleted', (action, state) => {
  // Copy array
  let todos = state.todos.slice();
  // Remove completed tasks
  todos.splice(action.index, 1);
  // Save
  localStorage.setItem('list', todos);

  // Return new state
  return { todos };
});

export default taskStore;
