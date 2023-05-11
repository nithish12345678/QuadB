import React, { Component } from "react";
import { Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import { MainPage } from "./components/MainPage";


class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route path="/" exact component={MainPage} />


        </div>
      </BrowserRouter>
    );
  }
}

export default App;
