export function checkLogin(req, res, next) {
  if (req.session.user) {
    return next();
  }

  res.redirect("/account/login");
}

export function checkEmployee(req, res, next) {
  if (
    req.session.user &&
    (req.session.user.role === "employee" || req.session.user.role === "owner")
  ) {
    return next();
  }

  res.status(403).render("errors/error", {
    title: "Access Denied",
    message: "You do not have permission to view this page.",
  });
}

export function checkOwner(req, res, next) {
  if (req.session.user && req.session.user.role === "owner") {
    return next();
  }

  res.status(403).render("errors/error", {
    title: "Access Denied",
    message: "Only owners can view this page.",
  });
}