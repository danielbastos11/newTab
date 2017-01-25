'use strict';

import tFlux      from 'tFlux'
import verseList from './verseList.js'

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
  let show   = (state.show == 'answer') ? 'guess' : 'answer';
  let status = (show == 'answer') ? 'cheating' : 'normal';

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

  if(guess != answer){
    return Object.assign({}, state, {
      status: 'wrong',
      guess
    });
  }
  else if(guess == text) {
    return Object.assign({}, state, {
      status: 'correct',
      guess,
      pct
    });
  }
  else {
    return Object.assign({}, state, {
      status: 'normal',
      guess,
      pct
    });
  }
});

export default memorizeStore;
