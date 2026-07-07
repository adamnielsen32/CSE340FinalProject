import { getAllVehicles, getCategories, getCategoryById, getVehiclesByCategory, getVehicleById } from "../models/vehicleModel.js";

export async function showInventory(req, res, next) {
  try {
    const [vehicles, categories] = await Promise.all([getAllVehicles(), getCategories()]);
    res.render("inventory/inventory", { title: "Vehicle Inventory", vehicles, categories });
  } catch (error) { next(error); }
}

export async function showCategory(req, res, next) {
  try {
    const [category, vehicles, categories] = await Promise.all([
      getCategoryById(req.params.categoryId), getVehiclesByCategory(req.params.categoryId), getCategories()
    ]);
    if (!category) return res.status(404).render("errors/error", { title: "Category Not Found", message: "That vehicle category does not exist." });
    res.render("inventory/category", { title: category.category_name, category, vehicles, categories });
  } catch (error) { next(error); }
}

export async function showVehicle(req, res, next) {
  try {
    const vehicle = await getVehicleById(req.params.vehicleId);
    if (!vehicle) return res.status(404).render("errors/error", { title: "Vehicle Not Found", message: "That vehicle does not exist." });
    res.render("inventory/detail", { title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`, vehicle });
  } catch (error) { next(error); }
}
