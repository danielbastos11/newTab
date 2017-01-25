(function (tFlux,ReactDOM,React$1,tFluxReact) {
'use strict';

tFlux = 'default' in tFlux ? tFlux['default'] : tFlux;
ReactDOM = 'default' in ReactDOM ? ReactDOM['default'] : ReactDOM;
React$1 = 'default' in React$1 ? React$1['default'] : React$1;
tFluxReact = 'default' in tFluxReact ? tFluxReact['default'] : tFluxReact;

const DateDisplay = ({ day, date, month }) => {
  return React.createElement(
    'div',
    { className: 'date' },
    day,
    ', ',
    date,
    ' de ',
    month
  );
};

const TimeDisplay = ({ hours, minutes }) => {
  if (hours < 10) hours = '0' + hours;
  if (minutes < 10) minutes = '0' + minutes;

  return React.createElement(
    'div',
    { className: 'hour' },
    hours,
    ':',
    minutes
  );
};

let months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

let daysOfWeek = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];

let Clock$1 = React.createClass({
  displayName: 'Clock',

  getInitialState() {
    return { date: new Date() };
  },

  render() {
    let date = this.state.date;
    let timeData = {
      hours: date.getHours(),
      minutes: date.getMinutes()
    };

    let dateData = {
      day: daysOfWeek[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()]
    };

    return React.createElement(
      'div',
      { className: 'time' },
      React.createElement(TimeDisplay, timeData),
      React.createElement(DateDisplay, dateData)
    );
  },

  componentDidMount() {
    this._timerID = setInterval(() => this._tick(), 1000);
  },

  componentWillUnmount() {
    clearInterval(this._timerID);
  },

  _tick() {
    let newDate = new Date(),
        oldDate = this.state.date;

    if (newDate.getMinutes() != oldDate.getMinutes()) {
      this.setState({
        date: newDate
      });
    }
  }
});

// Individual task
let Task = props => {
  return React.createElement(
    "li",
    null,
    React.createElement("div", { className: "checkbox", onClick: () => props.onClick(props.index) }),
    props.todo
  );
};

// List of tags
let List = React.createClass({
  displayName: "List",

  render() {
    return React.createElement(
      "ul",
      { className: "list" },
      this._getTasks()
    );
  },

  _getTasks() {
    let todos = this.props.todos,
        onClick = this.props.taskCompleted;

    return todos.map((todo, index) => {
      let props = { todo, onClick, index };
      return React.createElement(Task, props);
    });
  }
});

// Counter
let Counter = props => {
  let taskCount = props.taskCount;
  let count = taskCount == 1 ? 'tarefa não concluída' : 'tarefas não concluídas';
  let frase = taskCount == 0 ? 'Não fez mais que sua obrigação' : 'Vá trabalhar, seu vagabundo!';

  return React.createElement(
    "div",
    { className: "counter" },
    React.createElement(
      "h1",
      null,
      taskCount
    ),
    React.createElement(
      "h2",
      null,
      count
    ),
    React.createElement(
      "span",
      { className: "phrase" },
      frase
    ),
    React.createElement("input", { type: "text", placeholder: "+ Add Tarefa",
      onKeyPress: props.onKeyPress })
  );
};

let TaskListContainer = React.createClass({
  displayName: 'TaskListContainer',

  render() {
    let store = this.props.store;
    return React.createElement(
      'div',
      { id: 'todoContainer' },
      React.createElement(Counter, { taskCount: store.todos.length,
        onKeyPress: this._onKeyPress }),
      React.createElement(List, { todos: store.todos,
        taskCompleted: this._taskCompleted })
    );
  },

  componentWillMount() {
    window.addEventListener('storage', this._listChanged);
  },

  componentWillUnmount() {
    window.removeEventListener('storage', this._listChanged);
  },

  _listChanged() {
    tFlux.dispatch('listChanged');
  },

  _onKeyPress(e) {
    if (e.key != 'Enter') return;

    let input = e.currentTarget,
        task = input.value;

    input.value = '';

    tFlux.dispatch('taskAdded', { task });
  },

  _taskCompleted(index) {
    tFlux.dispatch('taskCompleted', { index });
  }
});

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

tFlux.use(tFluxReact);

let TaskList = tFlux.bind(TaskListContainer, taskStore);

let MemorizerWidget = React$1.createClass({
  displayName: 'MemorizerWidget',

  render() {
    let props = this.props;

    let text = props.show == 'answer' ? props.text : props.guess;
    let toggleText = props.show == 'answer' ? 'Esconder resposta' : 'Ver resposta';

    return React$1.createElement(
      'div',
      { className: props.status + ' decorar' },
      React$1.createElement(RefWidget, { loc: props.loc, changeRef: props.changeRef }),
      React$1.createElement('textarea', { className: 'transparent', placeholder: '(escreva aqui)',
        value: text, onChange: this._handleGuess
      }),
      React$1.createElement(
        'div',
        { className: 'stats' },
        React$1.createElement(
          'span',
          { onClick: props.reveal },
          toggleText
        ),
        React$1.createElement(
          'span',
          null,
          ' - ',
          props.pct,
          '%'
        )
      )
    );
  },

  _handleGuess(e) {
    if (this.props.show == 'answer') return;

    let text = e.currentTarget.value;
    this.props.takeGuess(text);
  }
});

let RefWidget = React$1.createClass({
  displayName: 'RefWidget',

  render() {
    return React$1.createElement(
      'span',
      { className: 'transparent ref', onDoubleClick: this.props.changeRef },
      this.props.loc
    );
  }
});

var verseList = [{
  text: 'Não andem ansiosos por coisa alguma, mas em tudo, pela oração e ' + 'súplicas, e com ação de graças, apresentem seus pedidos a Deus. ' + 'E a paz de Deus, que excede todo o entendimento, guardará os seus ' + 'corações e as suas mentes em Cristo Jesus.',
  ref: 'Filipenses 4:6-7'
}, {
  text: 'Pois o amor de Cristo nos constrange, porque estamos convencidos ' + 'de que um morreu por todos; logo, todos morreram. E ele morreu por ' + 'todos para que aqueles que vivem já não vivam mais para si mesmos, ' + 'mas para aquele que por eles morreu e ressuscitou.',
  ref: '2 Coríntios 5:14-15'
}, {
  text: 'O Filho é o resplendor da glória de Deus e a expressão exata do ' + 'seu ser, sustentando todas as coisas por sua palavra poderosa. ' + 'Depois de ter realizado a purificação dos pecados, ele se ' + 'assentou à direita da Majestade nas alturas, tornando-se tão ' + 'superior aos anjos quanto o nome que herdou é superior ao deles.',
  ref: 'Hebreus 1:3-4'
}, {
  text: 'Portanto, visto que temos um grande sumo sacerdote que adentrou ' + 'os céus, Jesus, o Filho de Deus, apeguemo-nos com toda a firmeza ' + 'à fé que professamos, pois não temos um sumo sacerdote que não ' + 'possa compadecer-se das nossas fraquezas, mas sim alguém que, ' + 'como nós, passou por todo tipo de tentação, porém, sem pecado.',
  ref: 'Hebreus 4:14-15'
}];

let initialVerse = verseList[0];

let memorizeStore = tFlux.store({
  text: initialVerse.text,
  ref: initialVerse.ref,
  verseIndex: 0,
  show: 'guess',
  guess: '',
  status: 'normal',
  pct: 0
});

memorizeStore.on('TOGGLE_SHOW', (action, state) => {
  let show = state.show == 'answer' ? 'guess' : 'answer';
  let status = show == 'answer' ? 'cheating' : 'normal';

  return Object.assign({}, state, {
    show,
    status
  });
});

memorizeStore.on('CHANGE_REF', (action, state) => {
  let newTextIndex = (state.verseIndex + 1) % verseList.length;
  let newText = verseList[newTextIndex];
  return Object.assign({}, state, {
    text: newText.text,
    ref: newText.ref,
    verseIndex: newTextIndex,
    guess: '',
    state: 'normal',
    pct: 0
  });
});

memorizeStore.on('GUESS', (action, state) => {
  let text = state.text,
      guess = action.guess,
      answer = text.substr(0, guess.length);

  let pct = !guess.length ? 0 : guess.length / text.length;
  pct = pct.toPrecision(2) * 100;
  pct = Math.round(pct);

  if (guess != answer) {
    return Object.assign({}, state, {
      status: 'wrong',
      guess
    });
  } else if (guess == text) {
    return Object.assign({}, state, {
      status: 'correct',
      guess,
      pct
    });
  } else {
    return Object.assign({}, state, {
      status: 'normal',
      guess,
      pct
    });
  }
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const MemorizerContainer = React$1.createClass({
  displayName: 'MemorizerContainer',

  render() {
    let store = this.props.store;
    let events = {
      takeGuess: this.takeGuess,
      reveal: this.reveal,
      changeRef: this.changeRef
    };

    return React$1.createElement(MemorizerWidget, _extends({}, store, events, {
      loc: store.ref }));
  },

  changeRef(val) {
    tFlux.dispatch('CHANGE_REF');
  },

  reveal() {
    tFlux.dispatch('TOGGLE_SHOW');
  },

  takeGuess(guess) {
    tFlux.dispatch('GUESS', { guess });
  }
});

tFlux.use(tFluxReact);

let Memorizer = tFlux.bind(MemorizerContainer, memorizeStore);

class App extends React$1.Component {
  render() {
    return React$1.createElement(
      'div',
      { className: 'grid' },
      React$1.createElement(
        'div',
        { className: 'cover pane' },
        React$1.createElement(Clock$1, null)
      ),
      React$1.createElement(
        'div',
        { className: 'main pane' },
        React$1.createElement(Greeter, null),
        React$1.createElement(
          'ul',
          { className: 'top menu' },
          React$1.createElement(
            'li',
            { className: 'active' },
            'Bem-vindo!'
          ),
          React$1.createElement('li', { className: 'fill' })
        ),
        React$1.createElement(TaskList, null),
        React$1.createElement('hr', null),
        React$1.createElement(Memorizer, null)
      )
    );
  }
}

const Greeter = () => {
  let hour = new Date().getHours();

  return React$1.createElement(
    'div',
    { className: 'title' },
    _getGreeting(hour),
    ', Daniel'
  );
};

function _getGreeting(hour) {
  if (hour >= 5 && hour < 12) return 'Bom dia';
  if (hour >= 12 && hour < 18) return 'Boa tarde';
  if (hour >= 18 || hour < 5) return 'Boa noite';
}

ReactDOM.render(React.createElement(App, null), document.querySelector('#app'));

}(tFlux,ReactDOM,React,tFluxReact));
