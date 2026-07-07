import { validationResult } from "express-validator";
import { createContactMessage, getAllContactMessages } from "../models/contactModel.js";

function initialFormData(user) {
  if (!user) return {};
  return {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
  };
}

export function showContactForm(req, res) {
  res.render("contact/contact", {
    title: "Contact Us",
    errors: [],
    oldData: initialFormData(req.session.user),
    submitted: req.query.submitted === "1",
  });
}

export async function submitContactForm(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("contact/contact", {
      title: "Contact Us",
      errors: errors.array(),
      oldData: req.body,
      submitted: false,
    });
  }

  try {
    await createContactMessage(req.session.user?.userId, req.body);
    res.redirect("/contact?submitted=1");
  } catch (error) {
    next(error);
  }
}

export async function showContactMessages(req, res, next) {
  try {
    const messages = await getAllContactMessages();
    res.render("admin/contactMessages", { title: "Contact Messages", messages });
  } catch (error) {
    next(error);
  }
}
