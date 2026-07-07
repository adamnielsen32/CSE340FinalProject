import express from "express";
import dotenv from "dotenv";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import accountRoute from "./routes/accountRoute.js";
import adminRoute from "./routes/adminRoute.js";
import inventoryRoute from "./routes/inventoryRoute.js";
import serviceRoute from "./routes/serviceRoute.js";
import contactRoute from "./routes/contactRoute.js";

dotenv.config();

const app = express();

app.set("view engine", "ejs");

app.use(expressLayouts);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use("/account", accountRoute);
app.use("/admin", adminRoute);
app.use("/inventory", inventoryRoute);
app.use("/service", serviceRoute);
app.use("/contact", contactRoute);

app.get("/", (req, res) => {
  res.render("index", { title: "Used Car Dealership" });
});

app.use((req, res) => res.status(404).render("errors/error", { title: "Page Not Found", message: "The page you requested could not be found." }));
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render("errors/error", { title: "Something Went Wrong", message: "We could not complete your request. Please try again." });
});

const port = process.env.PORT || 5500;

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
