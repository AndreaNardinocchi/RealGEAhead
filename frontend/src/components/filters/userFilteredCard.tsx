import React from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { countries, UserFilterCardProps } from "../../types/interfaces";

const styles = {
  root: {
    width: "100%",
    marginBottom: 20,
  },
  formControl: {
    marginTop: 2,
    width: "100%",
    backgroundColor: "#fff",
  },
};

const UserFilterCard: React.FC<UserFilterCardProps> = ({
  filters,
  setFilters,
}) => {
  /**
   * Generic handler for updating any filter field.
   */
  const handleChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  /** Reset all filters to default empty values */
  const resetFilters = () => {
    setFilters({
      search: "",
      email: "",
      first_name: "",
      last_name: "",
      country: "",
      role: "",
      created_at: "",
    });
  };

  return (
    <Card sx={styles.root} variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
          <FilterAltIcon fontSize="large" /> User Filters
        </Typography>

        {/* Global search across all fields */}
        <TextField
          sx={styles.formControl}
          label="Search all fields"
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
        />

        {/* Email filter*/}
        <TextField
          sx={styles.formControl}
          label="Email"
          value={filters.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        {/* First Name filter*/}
        <TextField
          sx={styles.formControl}
          label="First Name"
          value={filters.first_name}
          onChange={(e) => handleChange("first_name", e.target.value)}
        />

        {/* Last Name filter */}
        <TextField
          sx={styles.formControl}
          label="Last Name"
          value={filters.last_name}
          onChange={(e) => handleChange("last_name", e.target.value)}
        />

        {/* Country filter */}
        {/* Country filter */}
        <FormControl sx={styles.formControl}>
          <InputLabel>Country</InputLabel>
          <Select
            label="Country"
            value={filters.country}
            onChange={(e) => handleChange("country", e.target.value)}
          >
            <MenuItem value="">All Countries</MenuItem>
            {countries.map((c) => (
              <MenuItem key={c.code} value={c.name}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Role filter */}
        <FormControl sx={styles.formControl}>
          <InputLabel>Role</InputLabel>
          <Select
            label="Role"
            value={filters.role}
            onChange={(e) => handleChange("role", e.target.value)}
          >
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="guest">Guest</MenuItem>
          </Select>
        </FormControl>

        {/* Created At */}
        <TextField
          sx={styles.formControl}
          label="Created at"
          type="date"
          slotProps={{
            root: { sx: styles.formControl },
            inputLabel: { shrink: true },
          }}
          value={filters.created_at}
          onChange={(e) => handleChange("created_at", e.target.value)}
        />

        {/* Reset Button */}
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserFilterCard;
