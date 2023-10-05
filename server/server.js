import express from "express";
import { readdirSync } from "fs"; //allows whole routes folder to import -- Node.JS module -- FILESYSTEM
import cors from "cors";
import mongoose from "mongoose"; //db connection object
require("dotenv").config();
const morgan = require("morgan"); //shows CRUD request in console

const app = express();

//DB connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));

//middlewares
app.use(cors()); //allows cross-origin resource sharing -- also needed for express.json
app.use(morgan("dev"));
app.use(express.json()); //allows req.body etc api calls to recieve json forrmat alternative=body-parser
//route middleware
readdirSync("./routes/").map((r) => app.use("/api", require(`./routes/${r}`)));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on ${port}`));
