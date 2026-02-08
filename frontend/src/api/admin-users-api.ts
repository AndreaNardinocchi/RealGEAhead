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
  const res = await fetch("http://localhost:3000/admin/create-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userForm),
  });

  const data = await res.json();
  if (!res.ok) {
    alert(data.error || "Failed to save user");
    return;
  }

  return data;
};
