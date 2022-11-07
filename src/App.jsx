import React from "react";
import Navbartagg from "./navbartag";
import Homee from "./Homee";
import Cart from "./Cart";
import Login from "./Login";
import Logout from "./Logout";


import { BrowserRouter, Route, Routes } from "react-router-dom";


const App = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Login />
            </div>
          }
        ></Route>
        <Route
          path="/Home"
          element={
            <React.Fragment>
              <Navbartagg></Navbartagg>
              <Homee></Homee>

            </React.Fragment>
          }
        ></Route>
        <Route
          path="/cart"
          element={
            <>
              <Navbartagg></Navbartagg>
              <Cart></Cart>
            </>
          }
        ></Route>

        <Route
          path="/logout"
          element={
            <>
              <Logout />
            </>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
