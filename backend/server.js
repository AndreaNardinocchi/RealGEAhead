/**
 * Adding Supabase, database queries, email sending, file uploads,
 * or anything that returns a Promise requires handler async.
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminUsersPlaceholder from "./routes/adminUsersPlaceholder.js";
import adminBookingsPlaceholder from "./routes/adminBookingsPlaceholder.js";
import userCreateBookings from "./routes/userCreateBookings.js";
import userCancelBookings from "./routes/userCancelBookings.js";
import userUpdateBookings from "./routes/userUpdateBookings.js";
import emailPlaceholder from "./routes/emailPlaceholder.js";
import paymentsPlaceholder from "./routes/paymentsPlaceholder.js";
import userDeleteAccount from "./routes/userDeleteAccount.js";

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
app.use(adminBookingsPlaceholder);
app.use(userCreateBookings);
app.use(userUpdateBookings);
app.use(userCancelBookings);
app.use(emailPlaceholder);
app.use(paymentsPlaceholder);
app.use(userDeleteAccount);

/* --------------------
   START SERVER
-------------------- */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
