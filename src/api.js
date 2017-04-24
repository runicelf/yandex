(function() {
  const library = () => {};
  //api methods
  library.showSchedule = showSchedule;
  library.editLecture = editLecture;
  library.editSchool = editSchool;
  library.editLectureHall = editLectureHall;

  window.library = library;

  //type = school or hall
  function showSchedule(name, type, date1, date2) {
    return lectureStore.show(name, type, date1, date2);
  }
  function editLecture(props, del) {
    validator(props);
    lectureStore.editLecture(props, del);
  }
  function editSchool(props, del) {
    validator(props);
    schoolStore.editSchool(props, del);
  }
  function editLectureHall(props, del) {
    validator(props);
    lectureHallStore.editLectureHall(props, del);
  }

  class Lecture {
    constructor(props) {
      this.name = props.name.toLowerCase();
      this.lecturer = props.lecturer.toLowerCase();
      this.school = props.school.toLowerCase();
      this.lectureHall = props.lectureHall.toLowerCase();
      this.date = props.date;
      this.duration = parseInt(props.duration);
    }
  }
  class LectureStore {
    constructor() {
      this.store = [];
    }
    show(name, type, date1, date2) {
      if(type === 'school') {
        return this.findInPeriod(date1, date2).filter(lec => lec.school === name.toLowerCase());
      }
      return lectureStore.findInPeriod(date1, date2).filter(lec => lec.lectureHall === name.toLowerCase());
    }
    findInPeriod(date1, date2) {
      if (!date1 && !date2) {
        return this.store;
      }
      if (!date1) {
        return this.store.filter(e => {
          return e.date <= date2;
        });
      }
      if (!date2) {
        return this.store.filter(e => {
          return e.date >= date1;
        });
      }
      return this.store.filter(e => {
        return e.date >= date1 && e.date <= date2;
      });
    }
    editLecture(props, del) {
      if (del) {
        this.store = this.store.filter(lec => lec.name !== props.name.toLowerCase());
        return;
      }
      function minToMs(min) {
        return min * 60000;
      }
      function checkType(date, duration) {
        if(Number(duration) !== Number(duration) || date !== date) {
          throw('err wrong arg');
        }
      }
      checkType(props.date, props.duration);

      const thisLectureHall = lectureHallStore.findHall(props.lectureHall);
      const thisSchool = schoolStore.findSchool(props.school);
      if(!thisLectureHall && !thisSchool) {
        throw ('no hall or school');
      }
      const thisDateLectureArr = this.findInPeriod(props.date, props.date +  minToMs(props.duration));
      const result = thisDateLectureArr.filter(lec => {
        return lec.school !== thisSchool.name || lec.lectureHall !== thisLectureHall.name || lec.name !== props.name;
      });
      if(result.length === 0 && thisLectureHall.capacity >= thisSchool.amount) {
        if(this.store.filter(lec => lec.name === props.name.toLowerCase()).length > 0) {
          this.store = this.store.filter(lec => lec.name !== props.name.toLowerCase());
        }
        this.store.push(new Lecture(props));
        return;
      }
      throw ('err not added');
    }
  }
  class LectureHallStore {
    constructor() {
      this.store = [];
    }

    editLectureHall(props, del) {
      if(del) {
        this.store = this.store.filter(sch => sch.name !== props.name.toLowerCase());
        return;
      }
      if(this.store.filter(hall => hall.name === props.name.toLowerCase()).length !== 0) {
        this.store = this.store.filter(sch => sch.name !== props.name.toLowerCase());
      }
      this.store.push(new LectureHall(props));
    }

    findHall(name) {
      const lectureHall = this.store.filter(hall => hall.name === name.toLowerCase());
      if(lectureHall.length !== 0) {
        return lectureHall[0];
      }
      return false;
    }
  }

  class LectureHall {
    constructor(props) {
      this.name = props.name.toLowerCase();
      this.capacity = parseInt(props.capacity);
      this.description = props.description.toLowerCase();
    }
  }

  class SchoolStore {
    constructor() {
      this.store = [];
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

    findSchool(name) {
      const lectureSchool = this.store.filter(hall => hall.name === name.toLowerCase());
      if(lectureSchool.length !== 0) {
        return lectureSchool[0];
      }
      return false;
    }
  }
  class School {
    constructor(props) {
      this.name = props.name.toLowerCase();
      this.amount = parseInt(props.amount);
    }
  }
  const lectureHallStore = new LectureHallStore();
  const lectureStore = new LectureStore();
  const schoolStore = new SchoolStore();

  function validator(param) {
    if(typeof param !== 'object') {
      throw('err no arg');
    }
    const result = Object.keys(param).filter(v => param[v] === '');
    if(result.length > 0) {
      throw('err no arg');
    }
  }
}
)();
