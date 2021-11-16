import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
//CSS
import "./assets/css/custom.css";
// Index
import Index from "./views/Index";
// Views
import Register from "./views/Register";
import Login from "./views/Login";
import Adoptions from "./views/Adoptions";
import PetInfo from "./views/PetInfo";
import UsersCrud from "./views/UsersCrud";

// URL
const url = "http://localhost:3001";

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
            path="/adoptions"
            render={() => {
              return <Adoptions url={url} />;
            }}
          />
          <Route
            path="/usersCrud"
            render={() => {
              return <UsersCrud url={url} />;
            }}
          />
          <Route
            path="/adoption/:petId"
            render={() => {
              return <PetInfo url={url} />;
            }}
          />
        </Router>
      </div>
    );
  }
}

export default App;
