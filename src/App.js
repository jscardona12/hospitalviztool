import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
const libVoyager = require('datavoyager');

class App extends Component {
    componentDidMount(){
        const container = document.getElementById("voyager-embed");
        const config = undefined;
        const data = {
            "values": [
                {"fieldA": "A", "fieldB": 28}, {"fieldA": "B", "fieldB": 55}, {"fieldA": "C", "fieldB": 43},
                {"fieldA": "D", "fieldB": 91}, {"fieldA": "E", "fieldB": 81}, {"fieldA": "F", "fieldB": 53},
                {"fieldA": "G", "fieldB": 19}, {"fieldA": "H", "fieldB": 87}, {"fieldA": "I", "fieldB": 52}
            ]
        };

        const voyagerInstance = libVoyager.CreateVoyager(container, config, data)
    }
  render() {
    return (
      <div id="voyager-embed" className="App">

      </div>
    );
  }
}

export default App;
