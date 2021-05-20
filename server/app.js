const express = require("express");
const cors = require("cors");
const postRouter = require("./routers/post");

require("dotenv").config();
require("./db/databaseConnection");

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/", postRouter);

// Server Port
app.listen(port, () => {
  console.log(`Server listening in port: ${port}`);
});
