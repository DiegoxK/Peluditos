//modules
import express from "express";
import morgan from "morgan";
import cors from "cors";
import history from "connect-history-api-fallback";
import mongoose from "mongoose";

//server mongoose
const uri =
  "mongodb+srv://Di:DataBase@cluster0.3f6p4.mongodb.net/peludito?retryWrites=true&w=majority";
const db = mongoose.connection;

mongoose.connect(uri);

db.once("open", () => {
  console.log("Database is conected to: ", uri);
});

db.on("error", (err) => {
  console.log(err);
});

//server html requests
const app = express();

//middlewares
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
//==============================================================
app.use("/api", require("./routes/users"));
app.use("/api", require("./routes/pets"));

//routes
// app.get("/", (req, res) => {
//   res.send("Hello");
// });

//History routes
app.use(history());

//staticRouter
app.use(express.static("./static"));

//puerto
app.set("port", process.env.PORT || 3001);
app.listen(app.get("port"), () => {
  console.log("Server listen to port: " + app.get("port"));
});
