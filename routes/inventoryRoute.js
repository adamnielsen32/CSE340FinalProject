import express from "express";
import { showInventory, showCategory, showVehicle } from "../controllers/inventoryController.js";

const router = express.Router();
router.get("/", showInventory);
router.get("/category/:categoryId", showCategory);
router.get("/detail/:vehicleId", showVehicle);
export default router;
