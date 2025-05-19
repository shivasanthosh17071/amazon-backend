const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const bodyParser = require("body-parser");

const app = express();
const port = 8080;
const server = http.createServer(app);
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
// Routers
const customerRouter = require("./view/customer");
const productRouter = require("./view/product");

// ======= MIDDLEWARE =======
// Enable CORS - allow all origins (or customize origin if needed)
app.use(
  cors({
    origin: "*", // or replace '*' with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json()); // Parse JSON request bodies

// ======= ROUTES =======
app.use(customerRouter);
app.use(productRouter);

const password = "Raavan143";
// ======= DATABASE CONNECTION =======
// mongoose.connect('mongodb://localhost:27017')
mongoose
  .connect(
    `mongodb+srv://shivasanthoshqt:${password}@cluster0.b4z0d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// ======= START SERVER =======
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
