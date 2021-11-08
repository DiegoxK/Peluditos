import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

//CSS
import "./assets/css/custom.css";
// Index
import Index from "./views/Index";
// Register
import Register from "./views/Register";
import Login from "./views/Login";
import Adoption from "./views/Adoption";

// URL
let url = "http://localhost:3001";

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Route
            exact
            path="/"
            render={() => {
              return <Index />;
            }}
          />
          <Route
            path="/registro"
            render={() => {
              return <Register url={url} />;
            }}
          />
          <Route
            path="/login"
            render={() => {
              return <Login url={url} />;
            }}
          />
          <Route
            path="/adoption"
            render={() => {
              return <Adoption />;
            }}
          />
        </Router>
      </div>
    );
  }
}

export default App;
