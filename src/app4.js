import React, { useState } from "react";
import "./App4.css";

function App(){
  const [foods, setFoods] = useState([
    { id: 1, name: "Chapati & Beans", price: 200, quantity:1 },
    { id: 2, name: "Matoke with Beef", price: 500, quantity:1 },
    { id: 3, name: "Roasted Maize", price: 100, quantity:1 },
  ]);

  const [cart, setCart]=useState([]);
  const [newFood, setNewFood] = useState({ name: "", price: "", category: "" });

  const addToCart=(food)=>{
    const existingItem=cart.find((item)=>item.id===food.id);
    if (existingItem){
      setCart(
        cart.map((item)=>(
          item.id===food.id?{...item, quantity:item.quantity+1}:item
        ))
      )
    }else{
      setCart([...cart, {...food, quantity:1}])
    }
}

  const removeFromCart=(indexToBeRemoved)=>{
    setCart(cart.filter((_,index)=>index!==indexToBeRemoved))
  }

   // 1️⃣ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFood({ ...newFood, [name]: value });
  };

  // 2️⃣ Add new food to the list
  const handleAddFood = (e) => {
    e.preventDefault();
    if (!newFood.name || !newFood.price || !newFood.category) return;

    const newItem = {
      id: Date.now(), // unique id
      name: newFood.name,
      price: parseInt(newFood.price),
      category: newFood.category,
    };

    setFoods([...foods, newItem]);
    setNewFood({ name: "", price: "", category: "" }); // reset form
  };


    return(
      <div>
        <NavBar/>
        <Body foods={foods} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} handleAddFood={handleAddFood} handleChange={handleChange} newFood={newFood} setFoods={setFoods}/>
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

function Body({foods,cart, addToCart,removeFromCart, handleAddFood, handleChange, newFood}){
  return(
    <div>
      <h1>Add New Food Items</h1>
      <form onSubmit={handleAddFood} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="name"
          placeholder="Food Name"
          value={newFood.name}
          onChange={handleChange}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newFood.price}
          onChange={handleChange}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newFood.category}
          onChange={handleChange}
          style={{ marginRight: "10px" }}
        />
        <button type="submit">Add Food</button>
      </form>
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
              <li key={index}>
                {item.name} - UGX {item.price} - Quantity: {item.quantity}
                <button onClick={()=>removeFromCart(index)}>Remove From Cart</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}



export default App;
