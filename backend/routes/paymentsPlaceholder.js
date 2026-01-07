/**
 * Scaffolding of a router through which we will manage the payment logic.
 * Stripe is the online payment processor that will be utilized.
 *
 * https://docs.stripe.com/
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
   PAYMENTS
============================ */

router.post("/create_payment", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Create payment endpoint wired",
  });
});

export default router;
