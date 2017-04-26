import React, { Component } from 'react';
import Tabs from './Tabs';
import { getState, addChangeListener } from '../store';
import './css/Form.css';
import actions from '../actions';
import { emit } from '../dispatcher';

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
                result = this.state.schools.map(sch => sch.name)
                    .map(name => <option value={name}>{name}</option>);
                break;
            case 'hall':
                result = this.state.halls.map(hall => hall.name)
                    .map(name => <option value={name}>{name}</option>);
                break;
            default:
                throw('err wrong option');
        }
        return result;
    }
    getValue(type) {
        let result = 'Добавить ';
        switch (this.state.formLocation) {
            case 'lectures':
                result += 'лекцию';
                break;
            case 'schools':
                result += 'школу';
                break;
            case 'halls':
                result += 'аудиторию';
                break;
            default: 
                throw('err wrong value');
        }   
        return result;
    }
    addValueOnStore(e) {
        console.log(e.target.value, '---', e.target.name, e);
        if(e.target.value === '') {
            return;
        }
        emit(actions.ADD_FORM_DATA, this.state.formLocation, e.target.name, e.target.value);
    }
    schoolBlock(school) {
        return (
            <div>
                <input id={school} type='checkbox' onClick={this.addValueOnStore.bind(this)} name='school' value={school} className='form__school-block'></input>
                <label className='form__school-block-label' htmlFor={school}>{school}</label>
            </div>
            );
    }
    addForm(e) {
        e.preventDefault();
        /*
        if(typeof this.state.form[this.state.formLocation].school === 'undefined') {
            const e = {target: {value: ['ШРИ'], name: 'school'}};
            this.addValueOnStore(e);
        }
        if(typeof this.state.form[this.state.formLocation].halls === 'undefined') {
            const e = {target: {value: 'Синий кит', name: 'hall'}};
            this.addValueOnStore(e);
        }
        */
        emit(actions.ADD_FORM, this.state.formLocation);
        console.log(this.state.form);
    }
    getForm() {
        const location = this.state.formLocation;
        let result;
        switch (location) {
            case 'lectures':
                result = [
                    <b className='form__b'>Дата</b>,
                    <input className='form__input' name='date' type='date' onChange={this.addValueOnStore.bind(this)} value={this.state.form[location].date}/>,
                    <b className='form__b'>Время</b>,
                    <input className='form__input' type='time' name='time' onChange={this.addValueOnStore.bind(this) } value={this.state.form[location].time}/>,
                    <b className='form__b'>Тема лекции</b>,
                    <input className='form__input' type='text' name='subject' placeholder='Тема лекции' onChange={this.addValueOnStore.bind(this)}  value={this.state.form[location].subject}/>,
                    <b className='form__b'>Лектор</b>,
                    <input className='form__input' type='text' name='lecturer' placeholder='Лектор' onChange={this.addValueOnStore.bind(this)}  value={this.state.form[location].lecturer}/>,
                    <b className='form__b'>Школа</b>,
                    <div className='form__select-school-input'>
                        {
                            this.state.form.lectures.school.map(e => this.schoolBlock(e))
                        }
                        </div>,
                    <select multiple='multiple' className='form__input' name='school' onChange={this.addValueOnStore.bind(this)}  value={[]}>
                        {this.getOptions('school')}
                    </select>,
                    <b className='form__b'>Аудитория</b>,
                    <select className='form__input' onChange={this.addValueOnStore.bind(this)} name='hall'  value={this.state.form[location].hall}>
                        {this.getOptions('hall')}
                    </select>,
                    <b className='form__b'>Продолжительность лекции</b>,
                    <input className='form__input' type='text' name='duration' placeholder='Продолжительность лекции' onChange={this.addValueOnStore.bind(this)}  value={this.state.form[location].duration}/>];
                break;
            case 'halls':
                result = [
                    <b className='form__b'>Название</b>,
                    <input className='form__input' name='name' type='text' onChange={this.addValueOnStore.bind(this)} value={this.state.form[location].name}/>,
                    <b className='form__b'>Вместимость</b>,
                    <input className='form__input' name='capacity' type='text' onChange={this.addValueOnStore.bind(this)} value={this.state.form[location].capacity}/>,
                    <b className='form__b'>Описание</b>,
                    <input className='form__input' name='description' type='text' onChange={this.addValueOnStore.bind(this)} value={this.state.form[location].description}/>
                    ];
                break;
            case 'schools':
                result = [
                    <b className='form__b'>Название</b>,
                    <input className='form__input' name='name' type='text' onChange={this.addValueOnStore.bind(this)} value={this.state.form[location].name}/>,
                    <b className='form__b'>Количество студентов</b>,
                    <input className='form__input' name='amount' type='text' onChange={this.addValueOnStore.bind(this)} value={this.state.form[location].amount}/>,
                    ];
                break;
            default:
                throw('err wrong location');
        }
        return result;
    }
    render() {
        return (
            <div className='wrapper'>
                <Tabs action={actions.CHANGE_TAB} type='form' location={this.state.formLocation}/>
                <form className='form'>
                {
                    [
                    this.getForm(),
                    <input onClick={this.addForm.bind(this)} type='submit' name='submit' className="form__submit" value={this.getValue()}/>
                    ]
                }
                </form>
            </div>
        );
    }
}

export default Form;