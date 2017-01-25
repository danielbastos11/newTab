import React           from 'react'
import tFlux           from 'tFlux'
import tFluxReact      from 'tFluxReact'
import MemorizerWidget from './presentation.jsx'
import MemorizerStore  from './store.js'

const MemorizerContainer = React.createClass({
  render(){
    let store = this.props.store;
    let events = {
      takeGuess: this.takeGuess,
      reveal: this.reveal,
      changeRef: this.changeRef
    };

    return (
      <MemorizerWidget {...store} {...events}
        loc={store.ref} />
    );
  },

  changeRef(val){
    tFlux.dispatch('CHANGE_REF');
  },

  reveal(){
    tFlux.dispatch('TOGGLE_SHOW');
  },

  takeGuess(guess){
    tFlux.dispatch('GUESS', { guess });
  }
});

export default MemorizerContainer;
