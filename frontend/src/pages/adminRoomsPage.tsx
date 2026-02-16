import React, { useEffect, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../api/guestease-api";
import { getPublicUrl } from "../utils/supabaseAssetsStorage";
import { Link } from "react-router-dom";
import AdminRoomModal from "../components/adminRoomModal/adminRoomModal";
import AdminSubNav from "../components/adminSubNav/adminSubNav";
import AdminDashboardHeader from "../components/adminDashboardHeader/adminDashboardHeader";
import { useAdminCreateRoom } from "../hooks/useAdminCreateRoom";
import { supabase } from "../supabase/supabaseClient";
import { uploadRoomImages } from "../utils/uploadRoomImages";
import { Room } from "../types/interfaces";
import { useAdminUpdateRoom } from "../hooks/useAdminUpdateRoom";
import { useAdminDeleteRoom } from "../hooks/useAdminDeleteRoom";
import AlertDialogSlide from "../components/deleteRoomConfirm/deleteRoomConfirm";

const AdminRoomsPage: React.FC = () => {
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
   * */
  const {
    data: rooms,
    isLoading,
    isError,
    refetch,
  } = useQuery({ queryKey: ["rooms"], queryFn: getRooms });

  // We create a state for the adminRoomModal
  const [openRoomModal, setOpenRoomModal] = useState(false);

  // This state holds the list of image files selected by the admin before uploading.
  // It stores an array of File objects coming from an <input type="file" multiple /> element.
  // https://developer.mozilla.org/en-US/docs/Web/API/File
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // This is the state we use to update rooms
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // This is a state to itemize the existing images, and allow new image uploads
  // as well as their removal if needed
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Controls visibility of the success snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Stores the text that will appear inside the Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Controls whether the delete‑confirmation dialog is visible
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Holds the ID of the room the user intends to delete
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);

  // Browser title
  useEffect(() => {
    document.title = `Roos Admin Dashboard | GuestEase`;
  });

  // This is the form state that the admin will fill out to create a room
  // when the modal open
  const [roomForm, setRoomForm] = useState({
    name: "",
    description: "",
    amenities: "",
    capacity: "",
    price: "",
  });

  // This will handle the modal create room form
  const handleOpenCreateRoom = () => {
    setEditingRoom(null);
    setRoomForm({
      name: "",
      description: "",
      amenities: "",
      capacity: "",
      price: "",
    });
    setOpenRoomModal(true);
  };

  const handleOpenUpdateRoom = (r: Room) => {
    const imgs = r.images;
    setExistingImages(imgs);

    setEditingRoom(r);
    setRoomForm({
      name: r.name,
      description: r.description ?? "",
      amenities: (r.amenities ?? []).join(", "),
      capacity: String(r.capacity ?? ""),
      price: String(r.price ?? ""),
    });

    setSelectedFiles([]);
    setOpenRoomModal(true);
  };

  // We use the useAdminCreateRoom hook
  const createRoom = useAdminCreateRoom();

  /**
   * Create Room handler which builds a room payload,
   * then triggers the React Query mutation.
   * https://tanstack.com/query/latest/docs/framework/react/reference/useMutation
   * */
  const handleSaveRoom = async () => {
    try {
      // Normalize and prepare data for Supabase
      const roomPayload = {
        name: roomForm.name.trim(),
        // trim(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
        description: roomForm.description.trim(),
        amenities: roomForm.amenities
          .split(",")
          // Amenities are an array of strings
          .map((a) => a.trim())
          // .filter(Boolean) removes empty or falsy values from the array after splitting.
          // https://www.geeksforgeeks.org/javascript/how-to-remove-falsy-values-from-an-array-in-javascript/
          .filter(Boolean),
        capacity: Number(roomForm.capacity),
        price: Number(roomForm.price),
      };

      // Create the room first
      const result = await createRoom.mutateAsync(roomPayload);
      const roomId = result.id;

      // Upload images
      let uploadedImages: string[] = [];
      if (selectedFiles.length > 0) {
        uploadedImages = await uploadRoomImages(roomId, selectedFiles);
      }

      // Save image paths into the room
      if (uploadedImages.length > 0) {
        const { error: imgError } = await supabase
          .from("rooms")
          .update({ images: uploadedImages })
          .eq("id", roomId);

        if (imgError) throw imgError;
      }
      setSnackbarMessage("Room created successfully!");
      setSnackbarOpen(true);
      // Refresh rooms list
      // https://tanstack.com/query/v4/docs/framework/react/reference/useQuery
      refetch();
      setOpenRoomModal(false);
      setSelectedFiles([]);
    } catch (err) {
      console.error("Error saving room:", err);
    }
  };

  const updateRoom = useAdminUpdateRoom();

  /**
   * Update Room handler which updates the room payload,
   * then triggers the React Query mutation.
   * https://tanstack.com/query/latest/docs/framework/react/reference/useMutation
   * */
  const handleUpdateRoom = async () => {
    if (!editingRoom) return;
    try {
      // We create a variable string for new uploaded images
      let newUploadedImages: string[] = [];
      // If any image file is selected...
      if (selectedFiles.length > 0) {
        // ... then we upload via the uploadRoomImages, which will push them to the newUploadedImages list
        newUploadedImages = await uploadRoomImages(
          editingRoom.id,
          selectedFiles,
        );
      }

      // We finally create an overarching finalImages list encompassing the below lists through the spread operator
      const finalImages = [...existingImages, ...newUploadedImages];
      // Update room details with images included now
      await updateRoom.mutateAsync({
        id: editingRoom.id,
        name: roomForm.name,
        description: roomForm.description,
        amenities: roomForm.amenities
          .split(",")
          // Amenities are an array of strings
          .map((a) => a.trim())
          // .filter(Boolean) removes empty or falsy values from the array after splitting.
          // https://www.geeksforgeeks.org/javascript/how-to-remove-falsy-values-from-an-array-in-javascript/
          .filter(Boolean),
        capacity: Number(roomForm.capacity),
        price: Number(roomForm.price),
        images: finalImages,
      });
      setSnackbarMessage("Room updated successfully!");
      setSnackbarOpen(true);
      // Refresh rooms list
      // https://tanstack.com/query/v4/docs/framework/react/reference/useQuery
      refetch();
      setOpenRoomModal(false);
      setSelectedFiles([]);
    } catch (err) {
      console.error("Error saving room:", err);
    }
  };

  const deleteRoom = useAdminDeleteRoom();

  const handleDeleteRoom = async (id: string) => {
    if (!roomToDelete) return;

    await deleteRoom.mutateAsync({ id });
    setSnackbarMessage("Room deleted successfully!");
    setSnackbarOpen(true);
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch#syntax
    setDeleteDialogOpen(false);
    setRoomToDelete(null);
    // Refresh rooms list
    // https://tanstack.com/query/v4/docs/framework/react/reference/useQuery
    refetch();
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
        <Box textAlign="center" mt={4}>
          <Typography color="error">Failed to load rooms.</Typography>
          <Button onClick={() => refetch()} sx={{ mt: 2 }}>
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <AdminDashboardHeader />
      <AdminSubNav />
      <Container maxWidth="xl" sx={{ pb: 8 }}>
        <Box my={4} display="flex" justifyContent="space-between">
          <Typography variant="h4">Rooms</Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#e26d5c" }}
            onClick={handleOpenCreateRoom}
          >
            + Create Room
          </Button>
        </Box>

        {/* Table wrapper */}
        <TableContainer
          component={Paper}
          sx={{
            mb: 6, // overflowX: "auto" ensures horizontal scrolling on smaller screens.
            //  https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-x
            overflowX: "auto",
            overflowY: "auto",
            maxHeight: {
              xs: "50vh",
              sm: "150vh",
            },
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#f5f5f5",
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                }}
              >
                <TableCell sx={{ fontWeight: "bold" }}>Room ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Amenities</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Capacity</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Images
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                ></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rooms?.map((r) => {
                const images = r.images ?? [];
                return (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>

                    <TableCell sx={{ verticalAlign: "middle" }}>
                      <Box
                        component={Link}
                        to={`/room/${r.id}`}
                        sx={{
                          color: "#472d30",
                          textDecoration: "none",
                          fontWeight: 500,
                          display: "inline-block",
                          "&:hover": { color: "#E26D5C" },
                        }}
                      >
                        {r.name}
                      </Box>
                    </TableCell>

                    <TableCell>{r.description}</TableCell>

                    {/* Amenities formatting */}
                    <TableCell>{r.amenities.join(", ") ?? []}</TableCell>

                    <TableCell>{r.capacity}</TableCell>
                    <TableCell>€{r.price}</TableCell>

                    {/* Images column */}
                    <TableCell sx={{ verticalAlign: "middle" }}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          overflowX: "auto",
                          maxWidth: 300,
                          p: 1,
                          "&::-webkit-scrollbar": { height: 6 },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#ccc",
                            borderRadius: 3,
                          },
                        }}
                      >
                        {images.map((img: any) => {
                          // This reflects the image path we have in supabase storage
                          // const fullPath = `rooms/${r.id}/${img}`;
                          const fullPath = img;
                          // console.log("IMG VALUE:", img);

                          return (
                            <img
                              key={fullPath}
                              src={
                                /**
                                 * The uploaded image path is like 'rooms/a77ddc44-0a5e-4585-b4e7-5b61cb2865d3/1770573915402-DruidsRest2.jpg',
                                 * as per 'const filePath = `rooms/${roomId}/${Date.now()}-${safeName}`;' in the adminRoomsPage.tsx file.
                                 * Hence, we are saying below, that if 'img' does include 'rooms/' in its path, that mean it has been uploaded by
                                 * the admin and will show the uploaded path. Otherwise, it will enable the old image path display, whose
                                 * image was originally manually uploaded straight into supabase
                                 */
                                img.includes("rooms/")
                                  ? getPublicUrl(fullPath) // New uploaded images path
                                  : getPublicUrl(`rooms/${r.id}/${img}`) // old seeded images
                              }
                              alt=""
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: 4,
                                border: "1px solid #ccc",
                                flexShrink: 0,
                              }}
                            />
                          );
                        })}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        sx={{ mr: 1 }}
                        onClick={() => handleOpenUpdateRoom(r)}
                      >
                        Update
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setRoomToDelete(r.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <AdminRoomModal
          open={openRoomModal}
          onClose={() => setOpenRoomModal(false)}
          onSave={editingRoom ? handleUpdateRoom : handleSaveRoom}
          roomForm={roomForm}
          editingRoom={editingRoom}
          existingImages={existingImages}
          setRoomForm={setRoomForm}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          setExistingImages={setExistingImages}
        />
        {/* https://mui.com/material-ui/react-snackbar/ */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
        <AlertDialogSlide
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={() => handleDeleteRoom(roomToDelete ?? "")}
        />
      </Container>
    </>
  );
};

export default AdminRoomsPage;
