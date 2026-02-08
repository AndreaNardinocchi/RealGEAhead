import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getUsers } from "../api/guestease-api";
import { countries, User } from "../types/interfaces";
import { adminCreateUserApi } from "../api/admin-users-api";
import AdminUserModal from "../components/adminUserModal/adminUserModal";

/**
 * This is the admin users page wher all users can be viewed, created, updated and deleted
 * by the 'admin'
 */

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [openUserModal, setOpenUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // React Query client used for cache invalidation after mutations
  const queryClient = useQueryClient();
  // Controls visibility of the success snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Stores the text that will appear inside the Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [userForm, setUserForm] = useState({
    first_name: "",
    last_name: "",
    country: "",
    zip_code: "",
    email: "",
    role: "guest",
  });

  useEffect(() => {
    document.title = "Users Admin Dashboard | GuestEase";
  });

  /**
   * React Query is a data-fetching and caching library that simplifies working with
   * asynchronous data in React applications. Instead of manually managing loading states,
   * errors, caching, refetching, and background updates, React Query handles all of this
   * automatically. This results in cleaner components, fewer bugs, and a much smoother UX.
   * React Query v5 is the latest, actively maintained version of TanStack Query.
   * It introduces a simpler, more consistent API using a single options object:
   *
   *    useQuery({ queryKey: [...], queryFn: ... })
   *
   * https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
   * https://tanstack.com/query/latest/docs/framework/react/quick-start
   *    */
  const {
    data: profiles,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserForm({
      first_name: "",
      last_name: "",
      email: "",
      role: "guest",
      country: "",
      zip_code: "",
    });
    setOpenUserModal(true);
  };

  const handleSaveUser = async () => {
    try {
      const newUser = {
        first_name: userForm.first_name,
        last_name: userForm.last_name,
        email: userForm.email,
        role: userForm.role,
        country: userForm.country,
        zip_code: userForm.zip_code,
      };
      await adminCreateUserApi(newUser);
      // This clears out the cache and alloes us to see the created booking without having to refresh the page
      // https://tanstack.com/query/v4/docs/framework/react/guides/query-invalidation
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // Message to confirm the booking has beeen created

      setSnackbarMessage("User created successfully!");
      setSnackbarOpen(true);
      setOpenUserModal(false);
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <Typography color="error" mt={4}>
          {(error as Error).message}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ pb: 8, overflow: "visible", mt: 4 }}>
      <Box my={4} display="flex" justifyContent="space-between">
        <Typography variant="h4">Users</Typography>
        <Button
          variant="contained"
          onClick={handleOpenCreateUser}
          sx={{ backgroundColor: "#e26d5c" }}
        >
          + Create User
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          mb: 6,
          overflowX: "auto",
          borderRadius: 2,
          boxShadow: 3,
          "&::-webkit-scrollbar": { height: 8 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bbb",
            borderRadius: 4,
          },
        }}
      >
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>User ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>First Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Last Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Country</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Zip Code</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {profiles?.map((u) => (
              <TableRow
                key={u.id}
                sx={{
                  "&:hover": { backgroundColor: "#fafafa" },
                  transition: "0.2s",
                }}
              >
                <TableCell sx={{ fontWeight: 500 }}>{u.id}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.first_name}</TableCell>
                <TableCell>{u.last_name}</TableCell>
                <TableCell>{u.country}</TableCell>
                <TableCell>{u.zip_code}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{new Date(u.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AdminUserModal
        open={openUserModal}
        onClose={() => setOpenUserModal(false)}
        onSave={editingUser ? handleSaveUser : handleSaveUser}
        countries={countries ?? []}
        editingUser={editingUser}
        userForm={userForm}
        setUserForm={setUserForm}
      />
      {/* https://mui.com/material-ui/react-snackbar/ */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default AdminUsersPage;
