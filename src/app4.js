import React, { useState } from "react";
import "./App4.css";

function App(){
  const [foods, setFoods] = useState([
    { id: 1, name: "Chapati & Beans", price: 200 },
    { id: 2, name: "Matoke with Beef", price: 500 },
    { id: 3, name: "Roasted Maize", price: 100 },
  ]);

  const [cart, setCart]=useState([]);

  const addToCart=(food)=>{
  setCart([...cart, food])
}
    return(
      <div>
        <NavBar/>
        <Body foods={foods} cart={cart} addToCart={addToCart}/>
      </div>
    )
}

function NavBar(){
  return(
    <div>
      <h1>Campus Food Marketplace</h1>
    </div>
  )
}

function Body({foods,cart, addToCart}){
  return(
    <div>
      <h1>Food Items</h1>
      <div className="food-items">
        <ul>
          {foods.map((food)=>(
            <li key={food.id}>{food.name} - UGX {food.price}
            <button onClick={()=>addToCart(food)}>Add To Cart</button>
            </li>
          ))}
        </ul>
        <div className="cart-section">
          <h1>Cart</h1>
          <ul>
            {cart.map((item, index)=>(
              <li key={index}>{item.name} - UGX {item.price}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}



export default App;
