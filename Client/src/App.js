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
import PetRegister from "./views/PetRegister";
import Products from "./views/Products";
import Payment from "./views/Payment";
import ProductRegister from "./views/ProductRegister";

// URL
const url = "http://localhost:3001";

// Cookies function
const readCookie = (cname) => {
  var name = cname + "=";
  var decoded_cookie = decodeURIComponent(document.cookie);
  var carr = decoded_cookie.split(";");
  for (var i = 0; i < carr.length; i++) {
    var c = carr[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

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
              return <PetInfo readCookie={readCookie} url={url} />;
            }}
          />
          <Route
            path="/petRegister"
            render={() => {
              return <PetRegister url={url} />;
            }}
          />
          <Route
            path="/products/:productId"
            render={() => {
              return <Products readCookie={readCookie} url={url} />;
            }}
          />
          <Route
            path="/payment/:productId"
            render={() => {
              return <Payment url={url} />;
            }}
          />
          <Route
            path="/productRegister"
            render={() => {
              return <ProductRegister url={url} />;
            }}
          />
        </Router>
      </div>
    );
  }
}

export default App;
