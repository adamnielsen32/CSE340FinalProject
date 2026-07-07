import express from "express";
import { checkLogin } from "../middleware/auth.js";
import { showNewRequest, submitRequest, showHistory } from "../controllers/serviceController.js";

const router = express.Router();
router.use(checkLogin);
router.get("/new", showNewRequest);
router.post("/new", submitRequest);
router.get("/history", showHistory);
export default router;
