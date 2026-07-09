import express from "express";
import { checkEmployee, checkOwner } from "../middleware/auth.js";
import { showAllRequests, changeStatus } from "../controllers/serviceController.js";
import { showContactMessages } from "../controllers/contactController.js";
import {
  addCategory,
  addVehicle,
  removeCategory,
  removeVehicle,
  saveCategory,
  saveVehicle,
  showEditCategory,
  showEditVehicle,
  showNewCategory,
  showNewVehicle,
  showOwnerCategories,
  showOwnerVehicles,
} from "../controllers/adminController.js";

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

router.get("/service-requests", checkEmployee, showAllRequests);
router.post("/service-requests/:id/status", checkEmployee, changeStatus);
router.get("/contact-messages", checkEmployee, showContactMessages);

router.get("/vehicles", checkOwner, showOwnerVehicles);
router.get("/vehicles/new", checkOwner, showNewVehicle);
router.post("/vehicles", checkOwner, addVehicle);
router.get("/vehicles/:id/edit", checkOwner, showEditVehicle);
router.post("/vehicles/:id", checkOwner, saveVehicle);
router.post("/vehicles/:id/delete", checkOwner, removeVehicle);

router.get("/categories", checkOwner, showOwnerCategories);
router.get("/categories/new", checkOwner, showNewCategory);
router.post("/categories", checkOwner, addCategory);
router.get("/categories/:id/edit", checkOwner, showEditCategory);
router.post("/categories/:id", checkOwner, saveCategory);
router.post("/categories/:id/delete", checkOwner, removeCategory);

export default router;
