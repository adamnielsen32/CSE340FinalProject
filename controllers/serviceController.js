import { createServiceRequest, getRequestsByUser, getAllServiceRequests, updateServiceStatus } from "../models/serviceModel.js";

const statuses = ["submitted", "in_progress", "completed", "cancelled"];

export function showNewRequest(req, res) {
  res.render("service/new", { title: "Request Service", errors: [], oldData: {} });
}

export async function submitRequest(req, res, next) {
  try {
    const { serviceType, description } = req.body;
    if (!serviceType?.trim() || !description?.trim()) return res.status(400).render("service/new", {
      title: "Request Service", errors: ["Service type and description are required."], oldData: req.body
    });
    await createServiceRequest(req.session.user.userId, req.body);
    res.redirect("/service/history?created=1");
  } catch (error) { next(error); }
}

export async function showHistory(req, res, next) {
  try {
    const requests = await getRequestsByUser(req.session.user.userId);
    res.render("service/history", { title: "My Service Requests", requests, created: req.query.created === "1" });
  } catch (error) { next(error); }
}

export async function showAllRequests(req, res, next) {
  try {
    const requests = await getAllServiceRequests();
    res.render("admin/serviceRequests", { title: "Service Requests", requests, statuses });
  } catch (error) { next(error); }
}

export async function changeStatus(req, res, next) {
  try {
    if (!statuses.includes(req.body.status)) return res.status(400).render("errors/error", { title: "Invalid Status", message: "Choose a valid service status." });
    const updated = await updateServiceStatus(req.params.id, req.body.status, req.session.user.userId);
    if (!updated) return res.status(404).render("errors/error", { title: "Request Not Found", message: "That service request does not exist." });
    res.redirect("/admin/service-requests");
  } catch (error) { next(error); }
}
