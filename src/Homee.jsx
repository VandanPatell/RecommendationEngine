import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./App.css";
import ProductCard from "./ProductCard";
import Preloader from "./Preloader";



function Homee(){

  const navigate = useNavigate();
  const [products, setproducts] = useState([]);
  const [authenticated, setauthenticated] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = () => {
    setIsLoading(true)
    return fetch("database?action=getAllProducts")
          .then((response) => response.json())
          .then((data) => {setproducts(data['data']); setIsLoading(false);});

  }

  useEffect(() => {

    const loggedInUser = localStorage.getItem('userId')

    if(loggedInUser){
      setauthenticated(loggedInUser)
    }

    fetchData();
  },[])

  if(!authenticated){
    navigate("/");
  }else{




    return (
    
    <div className="homediv d-flex flex-row align-items-stretch">
      <div className="row d-flex align-items-center justify-content-center">

        { !isLoading ?
        products.map((pr, index)=>(
            <ProductCard key={index} pid={pr.ProductId} name={pr.ProductName} price={pr.ProductPrice} img={pr.ProductImage}/>
          ))  : <p className="loading-text">Loading...</p>
        }
        

      </div>
    </div>
    );
  }

}
// <p className="text-primary">Loading...</p>
// products.map((pr, index)=>(
//             <ProductCard key={index} pid={pr.ProductId} name={pr.ProductName} price={pr.ProductPrice} img={pr.ProductImage}/>
//           ))

export default Homee;
