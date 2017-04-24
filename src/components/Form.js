import React, { Component } from 'react';
import Tabs from './Tabs';
import { getState, addChangeListener } from '../store';
import './css/Form.css';
class Form extends Component{
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
    getOptions(type) {
        let result;
        switch (type) {
            case 'school':
                result = this.state.schools.map(sch => sch.name);
                break;
            case 'hall':
                result = this.state.halls.map(hall => hall.name);
                break;
            default:
                throw('err wrong option');
        }
        return result.map(name => <option>{name}</option>);
    }
    renderForm() {
        
        let result;
        switch (this.state.formLocation) {
            case 'lectures':
                result = [
                    <b className='form__b'>Дата</b>,
                    <input className='form__input date' name='date' type='date'/>,
                    <b className='form__b'>Время</b>,
                    <input className='form__input' type='time' name='time'/>,
                    <b className='form__b'>Тема лекции</b>,
                    <input className='form__input' type='text' name='name' placeholder='Тема лекции'/>,
                    <b className='form__b'>Лектор</b>,
                    <input className='form__input' type='text' name='lecturer' placeholder='Лектор'/>,
                    <b className='form__b'>Школа</b>,
                    <select className='form__input' >
                        {this.getOptions('school')}
                    </select>,
                    <b className='form__b'>Аудитория</b>,
                    <select className='form__input' >
                        {this.getOptions('hall')}
                    </select>,
                    <b className='form__b'>Продолжительность лекции</b>,
                    <input className='form__input' type='text' name='duration' placeholder='Продолжительность лекции'/>];
                break;
            default:
                throw('err wrong location');
        }
        return result;
    }
    render() {
        return (
            <div className='wrapper'>
                <Tabs/>
                <form className='form'>
                {
                    this.renderForm()
                }
                </form>
            </div>
        );
    }
}

export default Form;