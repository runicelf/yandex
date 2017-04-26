import React, { Component } from 'react';
import { getState, addChangeListener } from '../store';
import './css/Table.css';
import Tabs from './Tabs';
import Row from './Row';
import actions from '../actions';

class Table extends Component {
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
    chooseHeader(type) {
        let result;
        console.log(type);
        switch (type) {
            case 'lectures':
                result = (['Школа', 'Тема', 'Аудитория', 'Лектор', 'Дата', 'Материалы' ]);
                break;
            case 'schools':
                result = (['Название', 'Количество студентов']);
                break;
            case 'halls':
                result = (['Название', 'Вместимость', 'Описание']);
                break;
            default :
                throw('err wrong header');
        }
        return result;
    }
  render() {
    return (
        <div>
            <Tabs action={actions.CHANGE_TAB} type='table' location={this.state.location}/>
            <table className='table'>
                <thead className='table__thead'>
                    <tr>
                    {
                        this.chooseHeader(getState().location).map(e => {
                            return <th className='table__th'>{e}</th>;
                        })
                    }
                    </tr>
                </thead>
                <tbody className='table__data'>
                  {
                    getState()[getState().location].map(row => <Row data={row}/>)
                  }
                </tbody>
          </table>
      </div>
    );
  }
}

export default Table;