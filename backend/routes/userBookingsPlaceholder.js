/**
 * Scaffolding of a router through which we will manage the user booking CRUD logic
 */
import express from "express";

/**
 * express.Router is a way to organize related routes together. This will allow us to apply
 * middleware for different parts of our app.
 *
 * https://www.geeksforgeeks.org/web-tech/express-js-express-router-function/
 */
const router = express.Router();

// --------------------
// USER Create Booking
// --------------------
router.post("/user/create_booking", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Create booking endpoint wired",
  });
});

// --------------------
// USER Update Booking
// --------------------
router.post("/user/update_booking", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Update booking endpoint wired",
  });
});

// --------------------
// USER Delete Booking
// --------------------
router.post("/user/delete_booking", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Delete booking endpoint wired",
  });
});

export default router;
