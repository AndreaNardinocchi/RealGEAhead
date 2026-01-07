/**
 * Scaffolding of a router through which we will manage the email notifications logic
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
   EMAIL
============================ */

router.post("/send_email", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Email endpoint wired",
  });
});

export default router;
