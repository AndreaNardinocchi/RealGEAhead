/**
 * Adding Supabase, database queries, email sending, file uploads,
 * or anything that returns a Promise requires handler async.
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminUsersPlaceholder from "./routes/adminUsersPlaceholder.js";
import adminCreateBookings from "./routes/adminCreateBookings.js";
import adminCreateUsers from "./routes/adminCreateUsers.js";
import adminUpdateBookings from "./routes/adminUpdateBookings.js";
import adminCancelBookings from "./routes/adminCancelBookings.js";
import userCreateBookings from "./routes/userCreateBookings.js";
import userCancelBookings from "./routes/userCancelBookings.js";
import userUpdateBookings from "./routes/userUpdateBookings.js";
import emailPlaceholder from "./routes/emailPlaceholder.js";
import stripePayments from "./routes/stripeSetupIntentPayments.js";
import userDeleteAccount from "./routes/userDeleteAccount.js";
import stripeSavePayment from "./routes/stripeSavePaymentMethod.js";
import createStripeCustomer from "./routes/createStripeCustomer.js";

// --------------------
// ENV SETUP
// --------------------
dotenv.config();

// --------------------
// APP SETUP
// --------------------
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

/* ---------------------------
   Logging
---------------------------- */
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`, req.body);
  next();
});

/**
 * Mounting the routes with app.use()
 *
 * https://expressjs.com/en/4x/api.html#router
 *
 * */
app.use(adminUsersPlaceholder);
app.use(adminCreateBookings);
app.use(adminUpdateBookings);
app.use(adminCancelBookings);
app.use(userCreateBookings);
app.use(userCancelBookings);
app.use(userUpdateBookings);
app.use(emailPlaceholder);
app.use(stripePayments);
app.use(userDeleteAccount);
app.use(stripeSavePayment);
app.use(createStripeCustomer);
app.use(adminCreateUsers);

/* --------------------
   START SERVER
-------------------- */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
