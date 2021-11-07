import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

//CSS
import "./assets/css/custom.css";

// Index
import Index from "./views/Index";

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
        </Router>
      </div>
    );
  }
}

export default App;
