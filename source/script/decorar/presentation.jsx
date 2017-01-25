import React from 'react';

let MemorizerWidget = React.createClass({
  render (){
    let props = this.props;

    let text = props.show == 'answer' ? props.text : props.guess;
    let toggleText = props.show == 'answer' ? 'Esconder resposta'
    : 'Ver resposta';

    return (
      <div className={props.status + ' decorar'}>
        <RefWidget loc={props.loc} changeRef={props.changeRef} />
        <textarea className="transparent" placeholder="(escreva aqui)"
          value={text} onChange={this._handleGuess}
          ></textarea>
        <div className="stats">
          <span onClick={props.reveal}>{toggleText}</span>
          <span> - {props.pct}%</span>
        </div>
      </div>
    );
  },

  _handleGuess(e){
    if(this.props.show == 'answer') return;

    let text = e.currentTarget.value;
    this.props.takeGuess(text);
  }
});

let RefWidget = React.createClass({
  render(){
    return (
      <span className="transparent ref" onDoubleClick={this.props.changeRef}>
        {this.props.loc}
      </span>
    )
  }
});


export default MemorizerWidget;
