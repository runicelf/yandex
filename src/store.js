import { listen, emit } from './dispatcher';
import actions from './actions';
import './api';

const state = {
  formLocation: 'lectures',
  location: 'lectures',
  lectures: [{school: ['ШРИ'], subject: 'Адаптивим', hall: 'Синий кит', lecturer: 'Иван Федоров',   date: new Date(), link: 'ya.ru', duration: 60}],
  schools: [{name: 'ШРИ', amount: 37}],
  halls: [{name: 'Cиний кит', capacity: 100, description: 'Самый синий и большой'}],
};

const listeners = [];

export function getState() {

  return state;
}

export function addChangeListener(fn) {
  listeners.push(fn);
}

function notify() {
  
  listeners.forEach((fn) => {
      return fn();
  });
}

listen(actions.CHANGE_TAB, (locate) => {
   state.location = locate;
   notify();
});
