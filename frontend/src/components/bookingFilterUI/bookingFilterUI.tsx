import React, { useState } from "react";
import { Box, Button, Paper, TextField } from "@mui/material";

const BookingFilterUI: React.FC = () => {
  // Dummy data
  const bookings = [
    {
      booking_id: "dd0b882d-146a-46ec-8fbd-8705e1413c65",
      room: "Druid’s Rest",
      first_name: "Testing",
      last_name: "Nardinocchi",
      email: "latindjango@hotmail.it",
      check_in: "2026-02-14",
      check_out: "2026-02-16",
      guests: 1,
      total_price: "€140",
      created_at: "2026-02-14T22:55:23",
      charged: "Yes",
    },
    {
      booking_id: "a1b2c3d4-5555-4444-9999-123456789000",
      room: "Oakwood Suite",
      first_name: "Maria",
      last_name: "Silva",
      email: "maria@example.com",
      check_in: "2026-03-01",
      check_out: "2026-03-05",
      guests: 2,
      total_price: "€420",
      created_at: "2026-03-01T09:12:10",
      charged: "No",
    },
    {
      booking_id: "9999abcd-2222-3333-4444-abcdefabcdef",
      room: "King’s Hollow",
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      check_in: "2026-01-10",
      check_out: "2026-01-12",
      guests: 1,
      total_price: "€180",
      created_at: "2026-01-10T14:33:55",
      charged: "Yes",
    },
  ];

  // State to open or close the search bar/filetr
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({ search: "" });

  // Filtered data
  // https://www.kindacode.com/article/how-to-create-a-filter-search-list-in-react
  // https://www.cybrosys.com/blog/how-to-build-a-search-bar-to-filter-data-in-react
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
  const filtered = bookings.filter((b) =>
    [
      b.booking_id,
      b.room,
      b.first_name,
      b.last_name,
      b.email,
      b.check_in,
      b.check_out,
      b.guests,
      b.total_price,
      b.created_at,
      b.charged,
    ]
      // We combine all the booking fields to be able to search anything that is included in the rows
      .join(" ")
      .toLowerCase()
      .includes(filters.search.toLowerCase()),
  );

  return (
    <Box sx={{ p: 2 }}>
      <h2>Bookings Filter Test Dummy Data</h2>

      {/* Filter button */}
      <Button
        variant="contained"
        sx={{ backgroundColor: "#e26d5c" }}
        // 'The logical NOT (!) (logical complement, negation) operator takes truth to falsity and vice versa.'
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT
        onClick={() => setOpen(!open)}
      >
        {open ? "Close Filters" : "Open Filters"}
      </Button>

      {/* Filter panel */}
      {open && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <TextField
            label="Search"
            fullWidth
            value={filters.search}
            // Update the filters state by keeping all existing fields (...f)
            // and replacing ONLY the "search" field with the new input value
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
          />
        </Paper>
      )}

      {/** Results
       * https://www.geeksforgeeks.org/reactjs/how-to-build-a-search-filter-using-react-hooks/
       */}
      <Box sx={{ mt: 3 }}>
        <h3>Results</h3>
        <ul>
          {filtered.map((b) => (
            <li key={b.booking_id}>
              {b.first_name} {b.last_name} — Room {b.room}
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  );
};

export default BookingFilterUI;
