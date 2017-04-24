import React, { Component } from 'react';
import { getState, addChangeListener } from '../store';
import './css/Row.css';

class Row extends Component {
    chooseDataLabel(prop) {
        let result;
        switch (prop) {
            case 'school':
                result = 'Школа';
                break;
            case 'subject':
                result = 'Тема';
                break;
            case 'hall':
                result = 'Аудитория';
                break;
            case 'lecturer':
                result = 'Лектор';
                break;
            case 'date':
                result = 'Дата';
                break;
            case 'link':
                result = 'Материалы';
                break;
            case 'name':
                result = 'Название';
                break;
            case 'amount':
                result = 'Количество'
                break;
            case 'capacity':
                result = 'Вместимость';
                break;
            case 'description':
                result = 'Описание';
                break;
             default:
                throw('err wrong label');
        }
        return result;
    }
    ifDate(prop) {
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        };
        if(prop instanceof Date) {
            return prop.toLocaleString('ru', options);
        }
        return prop;
    }
    render() {
        return (
        <tr className='table__tr'>
            {
                Object.keys(this.props.data).filter(e => e !== 'duration').map(k => {
                    return <td data-label={this.chooseDataLabel(k)} className='table__td'>{this.ifDate(this.props.data[k])}</td>;
                })
            }
        </tr>
        );
    }
}


export default Row;