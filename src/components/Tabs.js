import React, { Component } from 'react';
import { getState, addChangeListener } from '../store';
import { emit } from '../dispatcher';
import './css/Tabs.css';

class Tabs extends Component {
    /*
    constructor() {
        super();
        this.state = getState();
    }
    componentDidMount() {
        addChangeListener(this.update.bind(this));
    }
    update() {
        this.setState(getState());
    }
    */
    //actions.CHANGE_TAB
    changeTab(locateParam) {
        emit(this.props.action, locateParam);
    }
    //.location
    isActivated(type) {
        if(this.props.location === type) {
            return `tabs__tab tabs__tab_activate`;
        }
        return 'tabs__tab';
    }
    render() {
        return (
          <ul className='tabs'>
            <li onClick={() => this.changeTab('lectures')} className={this.isActivated('lectures')}>Лекции</li>
            <li onClick={() => this.changeTab('schools')} className={this.isActivated('schools')}>Школы</li>
            <li onClick={() => this.changeTab('halls')} className={this.isActivated('halls')}>Аудитории</li>
          </ul>
        );
    }
}

export default Tabs;