import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BsCart2 } from "react-icons/bs";
import { TiShoppingCart } from "react-icons/ti";



function navbartag() {

  return (
    <div>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark ">
        <div className="container-fluid">
          <a className="navbar-brand" href="/home">
            <TiShoppingCart classNameName="navbarlogo"></TiShoppingCart>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/home">
                  Home
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="/logout">
                  logout
                </a>
              </li>
            </ul>
          </div>
          <div className="d-flex">
            <ul>
              <a className="nav-link" href="/cart" >
                <BsCart2 className="cartlogo"></BsCart2>
              </a>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default navbartag;
