import {
  createCategory,
  createVehicle,
  deleteCategory,
  deleteVehicle,
  getAllVehiclesForAdmin,
  getCategoriesForAdmin,
  getCategoryById,
  getVehicleById,
  updateCategory,
  updateVehicle,
} from "../models/vehicleModel.js";

function checkboxValue(value) {
  return value === "on" || value === "true";
}

function cleanVehicleData(body) {
  return {
    categoryId: body.categoryId === "" ? NaN : Number(body.categoryId),
    vin: (body.vin || "").trim(),
    year: body.year === "" ? NaN : Number(body.year),
    make: (body.make || "").trim(),
    model: (body.model || "").trim(),
    trim: (body.trim || "").trim(),
    mileage: body.mileage === "" ? NaN : Number(body.mileage),
    price: body.price === "" ? NaN : Number(body.price),
    color: (body.color || "").trim(),
    transmission: (body.transmission || "").trim(),
    fuelType: (body.fuelType || "").trim(),
    description: (body.description || "").trim(),
    imageUrl: (body.imageUrl || "").trim(),
    imageAlt: (body.imageAlt || "").trim(),
    isFeatured: checkboxValue(body.isFeatured),
    isAvailable: checkboxValue(body.isAvailable),
  };
}

function validateVehicle(data) {
  const errors = [];

  if (!data.categoryId) errors.push("Please choose a category.");
  if (!data.year || data.year < 1900 || data.year > 2100) errors.push("Year must be between 1900 and 2100.");
  if (!data.make) errors.push("Make is required.");
  if (!data.model) errors.push("Model is required.");
  if (!Number.isFinite(data.mileage) || data.mileage < 0) errors.push("Mileage must be 0 or higher.");
  if (!Number.isFinite(data.price) || data.price < 0) errors.push("Price must be 0 or higher.");
  if (!data.description) errors.push("Description is required.");
  if (data.vin && data.vin.length > 17) errors.push("VIN must be 17 characters or fewer.");

  return errors;
}

function cleanCategoryData(body) {
  return {
    categoryName: (body.categoryName || "").trim(),
    description: (body.description || "").trim(),
  };
}

function validateCategory(data) {
  const errors = [];

  if (!data.categoryName) errors.push("Category name is required.");
  if (data.categoryName.length > 50) errors.push("Category name must be 50 characters or fewer.");

  return errors;
}

async function renderVehicleForm(res, options) {
  const categories = await getCategoriesForAdmin();

  return res.render("admin/vehicleForm", {
    categories,
    errors: [],
    vehicle: {},
    ...options,
  });
}

async function renderCategoryForm(res, options) {
  return res.render("admin/categoryForm", {
    errors: [],
    category: {},
    ...options,
  });
}

export async function showOwnerVehicles(req, res, next) {
  try {
    const vehicles = await getAllVehiclesForAdmin();
    res.render("admin/vehicles", {
      title: "Manage Vehicles",
      vehicles,
      message: req.query.message || "",
      error: req.query.error || "",
    });
  } catch (error) {
    next(error);
  }
}

export async function showNewVehicle(req, res, next) {
  try {
    await renderVehicleForm(res, {
      title: "Add Vehicle",
      action: "/admin/vehicles",
      submitLabel: "Add vehicle",
    });
  } catch (error) {
    next(error);
  }
}

export async function addVehicle(req, res, next) {
  try {
    const vehicle = cleanVehicleData(req.body);
    const errors = validateVehicle(vehicle);

    if (errors.length) {
      return renderVehicleForm(res, {
        title: "Add Vehicle",
        action: "/admin/vehicles",
        submitLabel: "Add vehicle",
        vehicle,
        errors,
      });
    }

    await createVehicle(vehicle);
    res.redirect("/admin/vehicles?message=Vehicle added.");
  } catch (error) {
    if (error.code === "23505") {
      return renderVehicleForm(res, {
        title: "Add Vehicle",
        action: "/admin/vehicles",
        submitLabel: "Add vehicle",
        vehicle: cleanVehicleData(req.body),
        errors: ["That VIN is already used by another vehicle."],
      });
    }

    next(error);
  }
}

export async function showEditVehicle(req, res, next) {
  try {
    const vehicle = await getVehicleById(req.params.id);

    if (!vehicle) {
      return res.status(404).render("errors/error", {
        title: "Vehicle Not Found",
        message: "That vehicle does not exist.",
      });
    }

    await renderVehicleForm(res, {
      title: "Edit Vehicle",
      action: `/admin/vehicles/${vehicle.vehicle_id}`,
      submitLabel: "Save changes",
      vehicle: {
        ...vehicle,
        categoryId: vehicle.category_id,
        fuelType: vehicle.fuel_type,
        imageUrl: vehicle.image_url,
        imageAlt: vehicle.image_alt,
        isFeatured: vehicle.is_featured,
        isAvailable: vehicle.is_available,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function saveVehicle(req, res, next) {
  try {
    const currentVehicle = await getVehicleById(req.params.id);

    if (!currentVehicle) {
      return res.status(404).render("errors/error", {
        title: "Vehicle Not Found",
        message: "That vehicle does not exist.",
      });
    }

    const vehicle = cleanVehicleData(req.body);
    const errors = validateVehicle(vehicle);

    if (errors.length) {
      return renderVehicleForm(res, {
        title: "Edit Vehicle",
        action: `/admin/vehicles/${req.params.id}`,
        submitLabel: "Save changes",
        vehicle: { ...vehicle, vehicle_id: req.params.id },
        errors,
      });
    }

    await updateVehicle(req.params.id, vehicle);
    res.redirect("/admin/vehicles?message=Vehicle updated.");
  } catch (error) {
    if (error.code === "23505") {
      return renderVehicleForm(res, {
        title: "Edit Vehicle",
        action: `/admin/vehicles/${req.params.id}`,
        submitLabel: "Save changes",
        vehicle: { ...cleanVehicleData(req.body), vehicle_id: req.params.id },
        errors: ["That VIN is already used by another vehicle."],
      });
    }

    next(error);
  }
}

export async function removeVehicle(req, res, next) {
  try {
    await deleteVehicle(req.params.id);
    res.redirect("/admin/vehicles?message=Vehicle deleted.");
  } catch (error) {
    next(error);
  }
}

export async function showOwnerCategories(req, res, next) {
  try {
    const categories = await getCategoriesForAdmin();
    res.render("admin/categories", {
      title: "Manage Categories",
      categories,
      message: req.query.message || "",
      error: req.query.error || "",
    });
  } catch (error) {
    next(error);
  }
}

export async function showNewCategory(req, res, next) {
  try {
    await renderCategoryForm(res, {
      title: "Add Category",
      action: "/admin/categories",
      submitLabel: "Add category",
    });
  } catch (error) {
    next(error);
  }
}

export async function addCategory(req, res, next) {
  try {
    const category = cleanCategoryData(req.body);
    const errors = validateCategory(category);

    if (errors.length) {
      return renderCategoryForm(res, {
        title: "Add Category",
        action: "/admin/categories",
        submitLabel: "Add category",
        category,
        errors,
      });
    }

    await createCategory(category);
    res.redirect("/admin/categories?message=Category added.");
  } catch (error) {
    if (error.code === "23505") {
      return renderCategoryForm(res, {
        title: "Add Category",
        action: "/admin/categories",
        submitLabel: "Add category",
        category: cleanCategoryData(req.body),
        errors: ["That category already exists."],
      });
    }

    next(error);
  }
}

export async function showEditCategory(req, res, next) {
  try {
    const category = await getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).render("errors/error", {
        title: "Category Not Found",
        message: "That category does not exist.",
      });
    }

    await renderCategoryForm(res, {
      title: "Edit Category",
      action: `/admin/categories/${category.category_id}`,
      submitLabel: "Save changes",
      category: {
        ...category,
        categoryName: category.category_name,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function saveCategory(req, res, next) {
  try {
    const currentCategory = await getCategoryById(req.params.id);

    if (!currentCategory) {
      return res.status(404).render("errors/error", {
        title: "Category Not Found",
        message: "That category does not exist.",
      });
    }

    const category = cleanCategoryData(req.body);
    const errors = validateCategory(category);

    if (errors.length) {
      return renderCategoryForm(res, {
        title: "Edit Category",
        action: `/admin/categories/${req.params.id}`,
        submitLabel: "Save changes",
        category: { ...category, category_id: req.params.id },
        errors,
      });
    }

    await updateCategory(req.params.id, category);
    res.redirect("/admin/categories?message=Category updated.");
  } catch (error) {
    if (error.code === "23505") {
      return renderCategoryForm(res, {
        title: "Edit Category",
        action: `/admin/categories/${req.params.id}`,
        submitLabel: "Save changes",
        category: { ...cleanCategoryData(req.body), category_id: req.params.id },
        errors: ["That category already exists."],
      });
    }

    next(error);
  }
}

export async function removeCategory(req, res, next) {
  try {
    await deleteCategory(req.params.id);
    res.redirect("/admin/categories?message=Category deleted.");
  } catch (error) {
    if (error.code === "23503") {
      return res.redirect("/admin/categories?error=Move or delete vehicles in that category first.");
    }

    next(error);
  }
}
