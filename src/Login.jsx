import React, {useState} from "react";
import { TiShoppingCart } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

// const API = '?action=validateUser';


const Login = () =>{

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [user, setUser] = useState([]);

  const handleLogin = (event) =>{
    event.preventDefault();
    alert("Validating User...")
    console.log(email)
    console.log(password)
    
    fetch('database?action=validateUser', {
         redirect: "follow",
         method: 'POST',
         body: JSON.stringify({
            username: email,
            password: password,
         }),
         
      })
         .then((res) => res.json())
         .then((data) => {

            if(data['status'] === 'user validated'){
              localStorage.setItem("userId",data.id)
              // alert(email+" is valid user.")
              navigate("/home");
            }else{
              alert(data['status'])
            }

            console.log(data['status'])
         })
         .catch((err) => {
            console.log(err);
         });

  }

  return (
    <form onSubmit={handleLogin}>
    <div className="App-header">
      <div>
        <TiShoppingCart className="navbarlogin"></TiShoppingCart>
      </div>
      <div>
        <input
          type="text"
          placeholder="Email Id"
          required
          className="inputlogin"
          name="email"
          onChange={event => setEmail(event.target.value)}
          value={email}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="password"
          required
          className="inputlogin" 
          name="password"
          onChange={event => setPassword(event.target.value)}
          value={password}
        />
      </div>
      <div>
          <button className="buttonforlogin" type="submit">Login</button>
      </div>
    </div>
    </form>
  );

}



export default Login;
