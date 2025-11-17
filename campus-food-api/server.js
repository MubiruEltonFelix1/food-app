const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// temporary food data
let foods = [
  {
    id: 1,
    name: "Chapati Rolex",
    description: "Delicious Ugandan chapati wrap with eggs",
    price: 6000,
    rating: 4.7,
    image: "https://example.com/rolex.jpg",
    restaurant: "Mama Njeri's"
  }
];

// route to get all foods
app.get("/api/foods", (req, res) => {
  res.json(foods);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
