import db from './db';
function lib () {
  
  const library = () => {};
  //api methods
  library.showSchedule = showSchedule;
  library.edit = edit;
  library.give = give;
  
  function downloadData() {
      Object.keys(db).forEach(k => {
          edit([db[k], k]);
      });
  }
  
  //type = school or hall
  function edit(props, type, del) {
    if(props instanceof Array) {
        props[0].forEach(e => spread(e, props[1]));
        return;
    }else {
        spread(props, type, del);
        return;
    }
    function spread(props, type, del) {
        switch (type) {
            case 'school':
                schoolStore.editSchool(props, del);
                break;
            case 'hall' :
                lectureHallStore.edithall(props, del);
                break;
            case 'lecture' :
                lectureStore.editLecture(props, del);
                break;
            default:
                throw('err wtf?');
        }
    }
  }
  
  function give(type) {
        let result;
        switch (type) {
            case 'school':
                result = schoolStore.getStore();
                break;
            case 'hall' :
                result = lectureHallStore.getStore();
                break;
            case 'lecture' :
                result = lectureStore.getStore();
                break;
            default:
                throw('err wtf?');
        }
        return result;
    }
  function showSchedule(name, type, date1, date2) {
    return lectureStore.show(name, type, date1, date2);
  }

  class Lecture {
    constructor(props) {
      this.school = props.school;
      this.subject = props.subject;
      this.hall = props.hall;
      this.lecturer = props.lecturer;
      this.date = props.date;
      this.link = props.link;
      this.duration = parseInt(props.duration);
    }
    
    //{school: ['ШРИ'], subject: 'Адаптивим', hall: 'Синий кит', lecturer: 'Иван Федоров',   date: new Date(), link: 'ya.ru', duration: 60}
  }
  class LectureStore {
    constructor() {
      this.store = [];
    }
    getStore() {
        return this.store;
    }
    
    show(name, type, date1, date2) {
      if(type === 'school') {
        return this.findInPeriod(date1, date2).filter(lec => lec.school === name.toLowerCase());
      }
      return lectureStore.findInPeriod(date1, date2).filter(lec => lec.hall === name.toLowerCase());
    }
    
    findInPeriod(date1, date2) {
      
      if (!date1 && !date2) {
        return this.store;
      }
      if (!date1) {
        return this.store.filter(e => {
          return e.date.getTime() <= date2;
        });
      }
      if (!date2) {
        return this.store.filter(e => {
          return e.date.getTime() >= date1;
        });
      }
      return this.store.filter(e => {
        return e.date.getTime() >= date1 && e.date.getTime() <= date2;
      });
    }
    editLecture(props, del) {
      if (del) {
        this.store = this.store.filter(lec => lec.subject !== props.subject.toLowerCase());
        return;
      }
      const thisHall = lectureHallStore.findHall(props.hall);
      const thisSchools = schoolStore.findSchools(props.school);
       if(!thisHall || thisSchools.length === 0) {
        throw ('no hall or school');
      }
      
      function capacityCheck() {
          return thisHall.capacity >= schoolStore.amountCounter(thisSchools);
      }
      function dateCheck(findInPeriod) {
        function minToMs(min) {
          return min * 60000;
        }
        const thisDateLectureArr = findInPeriod(props.date.getTime(), props.date.getTime() +  minToMs(props.duration));
        return thisDateLectureArr.filter(lec => {
          return schoolStore.compareOfSchools(lec.school, thisSchools) > 0 || lec.hall === thisHall.name;
        }).length === 0;
      }
      function uniqCheck() {
          return this.store.filter(e => e.subject === props.subject).length > 0;
      }
      
      
     
      if(capacityCheck() && dateCheck(this.findInPeriod.bind(this))) {
          if(uniqCheck.call(this)) {
             this.store.push(new Lecture(props)); 
          }else {
              this.editLecture(props, true);
              this.store.push(new Lecture(props));
          }
        return true;
      }
      throw('err not enough capacity or date busy');
    }
  }
  class LectureHallStore {
    constructor() {
      this.store = [];
    }
    getStore() {
        return this.store;
    }
    edithall(props, del) {
      if(del) {
        this.store = this.store.filter(sch => sch.name !== props.name.toLowerCase());
        return;
      }
      if(this.store.filter(hall => hall.name === props.name.toLowerCase()).length !== 0) {
        this.store = this.store.filter(sch => sch.name !== props.name.toLowerCase());
      }
      this.store.push(new hall(props));
    }

    findHall(name) {
      const hall = this.store.filter(hall => {
          return hall.name.toLowerCase() === name.toLowerCase();
      });
      if(hall.length !== 0) {
        return hall[0];
      }
      return false;
    }
  }

  class hall {
    constructor(props) {
      this.name = props.name;
      this.capacity = parseInt(props.capacity);
      this.description = props.description;
    }
  }

  class SchoolStore {
    constructor() {
      this.store = [];
    }
    getStore() {
        return this.store;
    }
    editSchool(props, del) {
      if(del) {
        this.store = this.store.filter(sch => sch.name !== props.name.toLowerCase());
        return;
      }
      if(Number(props.amount) !== Number(props.amount)) {
        throw ('err NaN');
      }
      if(this.store.filter(school => school.name === props.name.toLowerCase()).length !== 0) {
        this.store = this.store.filter(sch => sch.name !== props.name.toLowerCase());
      }
      this.store.push(new School(props));
    }
    compareOfSchools(arr1, arr2) {
        return arr2.filter(sch2 => {
        return arr1.filter(sch1 => {
            return sch2.name.toLowerCase() === sch1.toLowerCase()
        }).length > 0 ;
      });
    }
    amountCounter(arrOfSchools) {
        return arrOfSchools.reduce((acc, elem) => {
            return acc + elem.amount;
        },0);
    }
    findSchools(arr) {
        /*
      const schools = name.reduce((acc, elem) => {
          const filtered = this.store.filter(sch => sch.name === elem.toLowerCase());
          if(filtered.length > 0) {
              acc.push(filtered[0]);
          }
          return acc;
      }, []);
      return schools;
      */
      return this.store.filter(sch1 => {
        return arr.filter(sch2 => {
            return sch1.name.toLowerCase() === sch2.toLowerCase()
        }).length > 0 ;
      });
    }
  }
  class School {
    constructor(props) {
      this.name = props.name;
      this.amount = parseInt(props.amount);
    }
  }
  
  
  const lectureHallStore = new LectureHallStore();
  const lectureStore = new LectureStore();
  const schoolStore = new SchoolStore(); 
  
  downloadData();
  
  return library;
}
export default lib();