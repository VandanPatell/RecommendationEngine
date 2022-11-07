import React from "react";
// import img11 from "./img/Amul Bread.png";

const cust_id = localStorage.getItem('userId')


function removeFromCart(pid){
  let p_id = Number(pid)

  fetch('database?action=removeFromCart', {
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
            window.location.reload(false)
         })
         .catch((err) => {
            console.log(err);
         });

}

function CartCard(props){

	return(
		<div className="cartcard">
          <div className="cardincart">
            <div className="row">
              <div className="col-3">
                <img src={props.img} class="card-img-top" alt="..." />
              </div>

              <div class="col">
                <h5 class="card-title">{props.name}</h5>
                <p class="card-text">Rs.{props.price}</p>
                <button onClick={() => removeFromCart(props.pid)} class="btn btn-primary">
                  Remove from Cart
                </button>
              </div>
            </div>
          </div>
        </div>

		)
}

export default CartCard