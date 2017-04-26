import { listen, emit } from './dispatcher';
import actions from './actions';
import api from './api';

const state = {
  formLocation: 'lectures',
  form: {
    lectures: {
      date: '',
      subject: '',
      lecturer: '',
      school: [],
      hall: 'Синий кит',
      duration: '',
    
    },
    schools: {
      name: '',
      amount: '',
    },
    halls: {
      name: '',
      capacity: '',
      description: '',
    },
  },
  location: 'lectures',
  lectures: [],
  schools: [],
  halls: [],
};

const defaultState = {
  lectures: {
      date: '',
      subject: '',
      lecturer: '',
      school: [],
      hall: 'Синий кит',
      duration: '',
    
    },
    schools: {
      name: '',
      amount: '',
    },
    halls: {
      name: '',
      capacity: '',
      description: '',
    },
};

downloadFromApi();

function downloadFromApi() {
  state.lectures = api.give('lecture');
  state.schools = api.give('school');
  state.halls = api.give('hall');
}

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

listen(actions.ADD_FORM_DATA, (type, key, value) => {
  if(key === 'school') {
    const schoolArr = state.form[type][key];
    const filtered = schoolArr.filter(e => e !== value);
    if( schoolArr.length > filtered.length) {
      state.form[type][key] = filtered; 
    }else {
      state.form[type][key].push(value); 
    }
  }else {
    state.form[type][key] = value;  
  }
  notify();
});

listen(actions.ADD_FORM, (type) => {
  const ourObj = state.form[type];
  switch (type) {
    case 'lectures':
      if(Object.keys(ourObj).length) {
        
      }
      const newObj = Object.keys(ourObj).reduce((acc, elem) => {
        if(elem !== 'date' && elem !==  'time') {
          acc[elem] = ourObj[elem];
        }
        return acc;
      }, {});
      newObj.date = new Date(Date.parse(`${ourObj.date}T${ourObj.time}`));
      console.log(newObj);
      api.edit(newObj, 'lecture');
      state.lectures = api.give('lecture');
      
      break;
    case 'halls' :
      api.edit(ourObj, 'hall');
      state.lectures = api.give('lecture');
      break;
    case 'schools' :
      api.edit(ourObj, 'school');
      state.lectures = api.give('lecture');
      break;
    default:
      throw('err wrong type');
  }
  console.log(state.form[type], defaultState[type], 'rrrrrrrrrrrrr')
  state.form[type] = defaultState[type];
  
  notify();
});

listen(actions.CHANGE_TAB, (type, locate) => {
   if(type === 'form') {
     state.formLocation = locate;
   }else {
     state.location = locate;
   }
   notify();
});
