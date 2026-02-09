import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slide,
  FormControl,
} from "@mui/material";
import { roles, UserModalProps } from "../../types/interfaces";
import { TransitionProps } from "@mui/material/transitions";

/**
 * This is a nice transition effect we were eager to try out,
 * and worked out well.
 * https://mui.com/material-ui/react-dialog/#transitions
 */
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AdminUserModal: React.FC<UserModalProps> = ({
  open,
  onClose,
  onSave,
  countries,
  editingUser,
  userForm,
  setUserForm,
}) => {
  const [errors, setErrors] = React.useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    country: "",
    zip_code: "",
  });

  const sanitize = {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes
    lettersOnly: (value: string) => value.replace(/[^A-Za-z]/g, ""),
    noSpaces: (value: string) => value.replace(/\s+/g, ""),
    lettersNumbersHyphens: (value: string) =>
      value.replace(/[^A-Za-z0-9-]/g, "").replace(/\s+/g, ""),
    emailSafe: (value: string) => value.replace(/\s+/g, ""),
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { mx: 2 } } }}
      slots={{ transition: Transition }}
    >
      <DialogTitle>{editingUser ? "Update User" : "Create User"}</DialogTitle>

      <DialogContent>
        <TextField
          margin="dense"
          label="First Name"
          fullWidth
          slotProps={{
            inputLabel: { shrink: true },
          }}
          value={userForm.first_name}
          onChange={(e) => {
            const value = sanitize.lettersOnly(e.target.value);
            setUserForm({ ...userForm, first_name: value });
          }}
        />

        <TextField
          margin="dense"
          type="text"
          label="Last Name"
          fullWidth
          /** slotProps property.
           * https://mui.com/material-ui/api/menu/#props
           * https://mui.com/material-ui/api/menu/#slots
           * */
          slotProps={{
            inputLabel: { shrink: true },
          }}
          value={userForm.last_name}
          onChange={(e) => {
            const value = sanitize.lettersOnly(e.target.value);
            setUserForm({ ...userForm, last_name: value });
          }}
        />

        {!editingUser && (
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            slotProps={{
              inputLabel: { shrink: true },
            }}
            value={userForm.email}
            onChange={(e) => {
              const value = sanitize.emailSafe(e.target.value);
              setUserForm({ ...userForm, email: value });
            }}
          />
        )}

        <FormControl fullWidth margin="dense">
          <InputLabel id="role-label" shrink>
            Role
          </InputLabel>

          <Select
            labelId="role-label"
            id="role"
            value={userForm.role}
            label="Role"
            onChange={(e) =>
              setUserForm({ ...userForm, role: e.target.value as string })
            }
            displayEmpty
          >
            <MenuItem disabled value="">
              <span style={{ color: "#aaa" }}>Select role</span>
            </MenuItem>

            {roles.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel id="country-label">Country</InputLabel>

          <Select
            labelId="country-label"
            id="country"
            value={userForm.country}
            label="Country"
            onChange={(e) =>
              setUserForm({ ...userForm, country: e.target.value as string })
            }
            displayEmpty
          >
            <MenuItem disabled value="">
              <span style={{ color: "#aaa" }}>Country</span>
            </MenuItem>

            {countries.map((c) => (
              <MenuItem key={c.code} value={c.name}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="dense"
          label="Zip Code"
          fullWidth
          value={userForm.zip_code}
          onChange={(e) => {
            const value = sanitize.lettersNumbersHyphens(e.target.value);
            setUserForm({ ...userForm, zip_code: value });
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: "#472d30",
            "&:hover": { color: "#E26D5C" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            // console.log("FINAL SAVE PAYLOAD:", userForm);
            onSave();
          }}
          sx={{
            backgroundColor: "#472d30",
            color: "#fff",
            "&:hover": { backgroundColor: "#E26D5C" },
            px: 5,
          }}
        >
          {/* This very same modal will be used for updates too */}
          {editingUser ? "Update User" : "Create User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminUserModal;
