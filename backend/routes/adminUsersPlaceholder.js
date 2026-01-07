/**
 * Scaffolding of a router through which we will manage the Admin user CRUD logic
 */
import express from "express";

/**
 * express.Router is a way to organize related routes together. This will allow us to apply
 * middleware for different parts of our app.
 *
 * https://www.geeksforgeeks.org/web-tech/express-js-express-router-function/
 */
const router = express.Router();

/* ============================
   USERS (ADMIN)
============================ */

// ADMIN Create User
router.post("/admin/create_user", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Create user endpoint wired",
  });
});

// ADMIN Update User
router.post("/admin/update_user", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Update user endpoint wired",
  });
});

// ADMIN Delete User
router.post("/admin/delete_user", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Delete user endpoint wired",
  });
});

export default router;
