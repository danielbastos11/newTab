const DateDisplay = ({ day, date, month }) => {
  return (
    <div className="date">
      {day}, {date} de {month}
    </div>
  )
};

const TimeDisplay = ({ hours, minutes }) => {
  if(hours   < 10 ) hours   = '0' + hours;
  if(minutes < 10 ) minutes = '0' + minutes;

  return (
    <div className="hour">
      {hours}:{minutes}
    </div>
  );
};

export { TimeDisplay, DateDisplay };
