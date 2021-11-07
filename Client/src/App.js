import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

//CSS
import "./assets/css/custom.css";

// Index
import Index from "./views/Index";
// Register
import Register from "./views/Register";

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
            path="/Registro"
            render={() => {
              return <Register />;
            }}
          />
        </Router>
      </div>
    );
  }
}

export default App;
