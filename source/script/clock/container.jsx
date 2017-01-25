import { TimeDisplay, DateDisplay } from './presentation.jsx'
import { months, daysOfWeek } from './helpers.js'

let Clock = React.createClass({
  getInitialState(){
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

    return (
      <div className="time">
        <TimeDisplay { ...timeData } />
        <DateDisplay { ...dateData } />
      </div>
    );
  },

  componentDidMount() {
    this._timerID = setInterval(() => this._tick(), 1000)
  },

  componentWillUnmount() {
    clearInterval(this._timerID);
  },

  _tick() {
    let newDate = new Date(),
        oldDate = this.state.date;

    if(newDate.getMinutes() != oldDate.getMinutes()){
      this.setState({
        date: newDate
      });
    }
  }
});


export default Clock;
