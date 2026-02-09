import React from "react";
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

/**
 * This page will show rooms on the admin dashboard, now using dummy data
 */
const rooms = [
  {
    id: "1",
    name: "Basic Room",
    description: "A simple room for testing.",
    amenities: ["WiFi", "Bed"],
    capacity: 2,
    price: 50,
    images: ["img1.jpg", "img2.jpg"],
  },
  {
    id: "2",
    name: "Deluxe Room",
    description: "A nicer room with more space.",
    amenities: ["WiFi", "TV", "Mini Fridge"],
    capacity: 3,
    price: 90,
    images: ["img1.jpg"],
  },
];

const AdminRoomsPage: React.FC = () => {
  return (
    <Container sx={{ pb: 8 }}>
      <Box my={4} display="flex" justifyContent="space-between">
        <Typography variant="h4">Rooms</Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ mb: 6, overflowX: "auto", borderRadius: 2, boxShadow: 3 }}
      >
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Room ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Amenities</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Capacity</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Images</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rooms.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>

                <TableCell>
                  <Box
                    component={Link}
                    to={`/room/${r.id}`}
                    sx={{
                      color: "#472d30",
                      textDecoration: "none",
                      fontWeight: 500,
                      "&:hover": { color: "#E26D5C" },
                    }}
                  >
                    {r.name}
                  </Box>
                </TableCell>

                <TableCell>{r.description}</TableCell>

                <TableCell>{r.amenities.join(", ")}</TableCell>

                <TableCell>{r.capacity}</TableCell>

                <TableCell>€{r.price}</TableCell>

                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {r.images.map((img) => (
                      <img
                        key={img}
                        src="https://placehold.co/600x400"
                        alt=""
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 4,
                          border: "1px solid #ccc",
                        }}
                      />
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminRoomsPage;
