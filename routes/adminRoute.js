import express from "express";
import { checkEmployee, checkOwner } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", checkEmployee, (req, res) => {
  res.render("admin/dashboard", {
    title: "Admin Dashboard",
  });
});

router.get("/owner", checkOwner, (req, res) => {
  res.render("admin/owner", {
    title: "Owner Dashboard",
  });
});

export default router;