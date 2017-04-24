import React, { Component } from 'react';
import Table from './Table';

import './css/reset.css';
import './css/App.css';
import Form from './Form';
class App extends Component {
  render() {
    return (
      <div className='main'>
        <Form/>
        
        <Table/>
      </div>
    );
  }
}

export default App;
