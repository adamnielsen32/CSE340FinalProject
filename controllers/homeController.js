import { getFeaturedVehicles } from "../models/vehicleModel.js";

export async function showHome(req, res, next) {
  try {
    const featuredVehicles = await getFeaturedVehicles(3);

    res.render("index", {
      title: "Used Car Dealership",
      featuredVehicles,
    });
  } catch (error) {
    next(error);
  }
}
