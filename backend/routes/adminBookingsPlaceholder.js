/**
 * Scaffolding of a router through which we will manage the Admin booking CRUD logic
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
   BOOKINGS (ADMIN)
============================ */

// ADMIN Create Booking
router.post("/admin/create_booking", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Create booking endpoint wired",
  });
});

// ADMIN Update Booking
router.post("/admin/update_booking", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Update booking endpoint wired",
  });
});

// ADMIN Delete Booking
router.post("/admin/delete_booking", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Delete booking endpoint wired",
  });
});

export default router;
