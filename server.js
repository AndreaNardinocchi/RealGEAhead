// server.js
/**
 * Adding Supabase, database queries, email sending, file uploads,
 * or anything that returns a Promise requires handler async.
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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
app.use((req, _res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`, req.body);
  next();
});

/* ============================
   USER BOOKINGS
============================ */

// --------------------
// USER Create Booking
// --------------------
app.post("/user/create_booking", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Create booking endpoint wired",
  });
});

// --------------------
// USER Update Booking
// --------------------
app.post("/user/update_booking", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Update booking endpoint wired",
  });
});

// --------------------
// USER Delete Booking
// --------------------
app.post("/user/delete_booking", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Delete booking endpoint wired",
  });
});

/* ============================
   EMAIL
============================ */

app.post("/send_email", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Email endpoint wired",
  });
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

/* ============================
   ROOMS (ADMIN)
============================ */

// ADMIN Create Room
app.post("/admin/create_room", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Create room endpoint wired",
  });
});

// ADMIN Update Room
app.post("/admin/update_room", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Update room endpoint wired",
  });
});

// ADMIN Delete Room
app.post("/admin/delete_room", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Delete room endpoint wired",
  });
});

/* ============================
   BOOKINGS (ADMIN)
============================ */

// ADMIN Create Booking
app.post("/admin/create_booking", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Create booking endpoint wired",
  });
});

// ADMIN Update Booking
app.post("/admin/update_booking", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Update booking endpoint wired",
  });
});

// ADMIN Delete Booking
app.post("/admin/delete_booking", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Delete booking endpoint wired",
  });
});

/* ============================
   USERS (ADMIN)
============================ */

// ADMIN Create User
app.post("/admin/create_user", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Create user endpoint wired",
  });
});

// ADMIN Update User
app.post("/admin/update_user", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Update user endpoint wired",
  });
});

// ADMIN Delete User
app.post("/admin/delete_user", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Delete user endpoint wired",
  });
});

/* --------------------
   START SERVER
-------------------- */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
