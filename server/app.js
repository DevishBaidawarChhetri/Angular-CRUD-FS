const express = require("express");
const cors = require("cors");
const path = require("path");
const postRouter = require("./routers/post");
const userRouter = require("./routers/user");

require("dotenv").config();
require("./db/databaseConnection");

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use("/images", express.static(path.join("../server/images")));
app.use(cors());

// Routes
app.use("/api/posts", postRouter);
app.use("/api/user", userRouter);

// Server Port
app.listen(port, () => {
  console.log(`Server listening in port: ${port}`);
});
