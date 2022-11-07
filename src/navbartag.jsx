import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BsCart2 } from "react-icons/bs";
import { TiShoppingCart } from "react-icons/ti";



function navbartag() {

  return (
    <div>
      <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark ">
        <div class="container-fluid">
          <a class="navbar-brand" href="/home">
            <TiShoppingCart className="navbarlogo"></TiShoppingCart>
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/home">
                  Home
                </a>
              </li>

              <li class="nav-item">
                <a class="nav-link" href="/logout">
                  logout
                </a>
              </li>
            </ul>
          </div>
          <div className="d-flex">
            <ul>
              <a class="nav-link" href="/cart" >
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
