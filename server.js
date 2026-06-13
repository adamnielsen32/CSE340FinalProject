import express from "express";
import dotenv from "dotenv";
import expressLayouts from "express-ejs-layouts";

dotenv.config();

const app = express();

app.set("view engine", "ejs");

app.use(expressLayouts);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

const port = process.env.PORT || 5500;

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});