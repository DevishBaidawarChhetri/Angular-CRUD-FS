const express = require("express");
const cors = require("cors");
const path = require("path");
const postRouter = require("./routers/post");

require("dotenv").config();
require("./db/databaseConnection");

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use("/images", express.static(path.join("../server/images")));
app.use(cors());

// Routes
app.use("/", postRouter);

// Server Port
app.listen(port, () => {
  console.log(`Server listening in port: ${port}`);
});
