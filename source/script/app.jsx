import React            from 'react'
import Clock            from './clock/index.js'
import TodoList         from './todo/index.js'
import Decorar          from './decorar/index.js'

class App extends React.Component {
  render(){
    return (
      <div className="grid">
        <div className="cover pane">
          <Clock />
        </div>
        <div className="main pane">
          <Greeter />
          <ul className="top menu">
            <li className="active">Bem-vindo!</li>
            <li className="fill"></li>
          </ul>
          <TodoList />
          <hr />
          <Decorar />
        </div>
      </div>
    )
  }
};

const Greeter = () => {
  let hour = new Date().getHours();

  return (
    <div className="title">
      {_getGreeting(hour)}, Daniel
    </div>
  )
};

function _getGreeting (hour){
  if(hour >= 5  && hour < 12) return 'Bom dia'  ;
  if(hour >= 12 && hour < 18) return 'Boa tarde';
  if(hour >= 18 || hour < 5 ) return 'Boa noite';
}

export default App;
