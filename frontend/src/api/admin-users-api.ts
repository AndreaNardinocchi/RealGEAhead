/**
 * Create User (Admin)
 * Sends a POST request to the admin backend to create a user.
 */
export const adminCreateUserApi = async (userForm: {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  country: string;
  zip_code: string;
}) => {
  const res = await fetch(
    "https://realgeahead-1.onrender.com/admin/create-user",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userForm),
    },
  );

  const data = await res.json();
  if (!res.ok) {
    // alert(data.error || "Failed to save user");
    // We needed to throw an error to prevent the snackbar from popping up even
    // when the user being created was using an existing email and would fail
    throw new Error(data.error || "Failed to save user");
    // return;
  }

  return data;
};

/**
 * Update User (Admin)
 */
export const adminUpdateUserApi = async (userForm: {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  country: string;
  zip_code: string;
}) => {
  const res = await fetch(
    "https://realgeahead-1.onrender.com/admin/update-user",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userForm),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update user");
  }

  return data;
};

/**
 * Delete User (Admin)
 */
export const adminDeleteUserApi = async (id: string, role: string | null) => {
  const res = await fetch(
    "https://realgeahead-1.onrender.com/admin/delete-user",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to delete user");
  }

  return data;
};
