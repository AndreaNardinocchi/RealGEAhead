// server.js
/**
 * Adding Supabase, database queries, email sending, file uploads,
 * or anything that returns a Promise requires handler async.
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminUsersPlaceholder from "./routes/adminUsersPlaceholder.js";
import adminBookingsPlaceholder from "./routes/adminBookingsPlaceholder.js";
import userBookingsPlaceholder from "./routes/userBookingsPlaceholder.js";
import emailPlaceholder from "./routes/emailPlaceholder.js";
import paymentsPlaceholder from "./routes/paymentsPlaceholder.js";

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
  })
);

/* ---------------------------
   Logging
---------------------------- */
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`, req.body);
  next();
});

/* ============================
   USER PROFILE
============================ */

// --------------------
// USER Delete Booking
// --------------------

/**
 * 'This function should only be called on a server.
 * Never expose your service_role key in the browser.'
 * deleteUser()
 *
 * https://supabase.com/docs/reference/javascript/auth-admin-deleteuser
 *  */
app.post("/user/delete_user", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Delete booking endpoint wired",
  });
});

/**
 * Mounting the routes with app.use()
 *
 * https://expressjs.com/en/4x/api.html#router
 *
 * */
app.use(adminUsersPlaceholder);
app.use(adminBookingsPlaceholder);
app.use(userBookingsPlaceholder);
app.use(emailPlaceholder);
app.use(paymentsPlaceholder);

/* ============================
   ROOMS (ADMIN) WILL BE HANDLED BY THE FRONTEND
============================ */
/**
 * We might actually create a logic in the front-end to manage rooms CRUD via
 * Supabase directly.
 * Right now, we don't have any sensitive or server‑only data that requires
 * backend processing. Even the room price is not a secret.
 *
 */
// ADMIN Create Room
// app.post("/admin/create_room", async (req, res) => {
//   res.json({
//     status: "placeholder",
//     message: "Create room endpoint wired",
//   });
// });

// // ADMIN Update Room
// app.post("/admin/update_room", async (req, res) => {
//   res.json({
//     status: "placeholder",
//     message: "Update room endpoint wired",
//   });
// });

// // ADMIN Delete Room
// app.post("/admin/delete_room", async (req, res) => {
//   res.json({
//     status: "placeholder",
//     message: "Delete room endpoint wired",
//   });
// });

/* --------------------
   START SERVER
-------------------- */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
