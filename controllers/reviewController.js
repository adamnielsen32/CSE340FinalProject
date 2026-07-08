import { validationResult } from "express-validator";
import { createReview, deleteReview, getReviewsByVehicle } from "../models/reviewModel.js";
import { getVehicleById } from "../models/vehicleModel.js";

function averageRating(reviews) {
  if (!reviews.length) return null;
  return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
}

export async function addReview(req, res, next) {
  try {
    const vehicle = await getVehicleById(req.params.vehicleId);
    if (!vehicle) return res.status(404).render("errors/error", {
      title: "Vehicle Not Found", message: "That vehicle does not exist.",
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const reviews = await getReviewsByVehicle(vehicle.vehicle_id);
      return res.status(400).render("inventory/detail", {
        title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        vehicle, reviews, averageRating: averageRating(reviews),
        reviewErrors: errors.array(), reviewData: req.body, reviewAdded: false,
      });
    }

    await createReview(vehicle.vehicle_id, req.session.user.userId, Number(req.body.rating), req.body.title, req.body.body);
    res.redirect(`/inventory/detail/${vehicle.vehicle_id}?reviewAdded=1#reviews`);
  } catch (error) { next(error); }
}

export async function removeReview(req, res, next) {
  try {
    const deleted = await deleteReview(req.params.reviewId, req.session.user.userId, req.session.user.role);
    if (!deleted) return res.status(403).render("errors/error", {
      title: "Review Not Deleted", message: "You may only delete your own reviews.",
    });
    res.redirect(`/inventory/detail/${deleted.vehicle_id}#reviews`);
  } catch (error) { next(error); }
}
