import React, { useEffect, useState } from "react";
import { BsCart2 } from "react-icons/bs";
import "./App.css"; 
import CartCard from "./CartCard";
import ProductCard from "./ProductCard";


function Cart(){

  const userId = localStorage.getItem('userId');
  const [products, setproducts] = useState([]);
  const [recommended, setrecommended] = useState([]);

  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);



  const fetchDataCartItems = () => {
    setIsProductsLoading(true)
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
            setIsProductsLoading(false)
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

    setIsRecommendationsLoading(true)
    return fetch("http://localhost:5000/"+loggedInUser,{
          redirect: "follow"
        }).then((response) => response.json())
          .then((data) => {
            setrecommended(data['recommendation']) 
            setIsRecommendationsLoading(false)
          })
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
          !isProductsLoading ?
          products.map((pr, index)=>(
            <CartCard key={index} pid={pr.ProductId} name={pr.ProductName} price={pr.ProductPrice} img={pr.ProductImage}/>
          )) : <p className="loading-text-dark">Loading Cart Items...</p>
        }

        <br />

        <div>
          <h3>Frequently Brought Products</h3>
        </div>
        <br />

        <div className="row">
        {
          !isRecommendationsLoading ?
          recommended.map((pr, index)=>(
            <ProductCard key={index} pid={pr.ProductId} name={pr.ProductName} price={pr.ProductPrice} img={pr.ProductImage}/>
          )) : <p className="loading-text-dark">Loading Recommendations...</p>
        }
        </div>
        

        <br />
        <br />
      </div>
    </div>
  );
}

export default Cart;
