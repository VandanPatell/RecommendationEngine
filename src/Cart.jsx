import React, { useEffect, useState } from "react";
import { BsCart2 } from "react-icons/bs";

import CartCard from "./CartCard";
import ProductCard from "./ProductCard";


function Cart(){

  const userId = localStorage.getItem('userId');
  const [products, setproducts] = useState([]);
  const [recommended, setrecommended] = useState([]);

  const fetchDataCartItems = () => {
    return fetch('database?action=getCartDetails', {
         redirect: "follow",
         method: 'POST',
         body: JSON.stringify({
            cust_id: userId,
         }),
         
      })
         .then((res) => res.json())
         .then((data) => {
            setproducts(data['data']['ItemDetails'])
            console.log(data)
         })
         .catch((err) => {
            console.log(err);
         });
  }
 
  const fetchDataRecommendedItems = () => {
    const loggedInUser = localStorage.getItem('userId')
    // let url = '/'+loggedInUser
    // console.log(url)
    return fetch("http://localhost:5000/"+loggedInUser,{
          redirect: "follow"
        }).then((response) => response.json())
          .then((data) => setrecommended(data['recommendation']))
          .catch((err)=>{
            console.log(err)
          });
  }

  useEffect(() => {
    fetchDataCartItems();
    fetchDataRecommendedItems();
  },[])  


  return (
    <div className="bgforcart">
      <div className="cart">
        <div className="cartlogologo">
          <BsCart2 className="cartcart"></BsCart2>
        </div>

        {
          products.map((pr)=>(
            <CartCard pid={pr.ProductId} name={pr.ProductName} price={pr.ProductPrice} img={pr.ProductImage}/>
          ))
        }
        
        <br />

        <div>
          <h3>Recommended products</h3>
        </div>
        <br />

        <div className="row">
        {
          recommended.map((pr)=>(
            <ProductCard pid={pr.ProductId} name={pr.ProductName} price={pr.ProductPrice} img={pr.ProductImage}/>
          ))
        }
        </div>
        

        <br />
        <br />
      </div>
    </div>
  );
}

export default Cart;
