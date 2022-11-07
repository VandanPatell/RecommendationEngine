import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
// import "./App.css";
// import img1 from "./img/Amul Bread.png";


const cust_id = localStorage.getItem('userId')

function addToCart(pid){
  let p_id = Number(pid)
 
  fetch('database?action=addToCart', {
         redirect: "follow",
         method: 'POST',
         body: JSON.stringify({
            cust_id: cust_id,
            p_id: p_id,
         }),
         
      })
         .then((res) => res.json())
         .then((data) => {
            alert(data['status'])
         })
         .catch((err) => {
            console.log(err);
         });

}



function productCard(props){
	return(
		
		<div className="col mb-4">
          <div className="card">
            <img src={props.img} class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title">{props.name}</h5>
              <p class="card-text">Rs.{props.price}</p>
              <button onClick={() => addToCart(props.pid)} class="btn btn-primary">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
		);

	// return "productCard";

}

export default productCard