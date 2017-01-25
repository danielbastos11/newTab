import tFlux              from 'tFlux'
import tFluxReact         from 'tFluxReact'
import TaskListContainer  from './container.jsx'
import TaskStore          from './store.js'

tFlux.use(tFluxReact);

let TaskList = tFlux.bind(TaskListContainer, TaskStore);

export default TaskList;
