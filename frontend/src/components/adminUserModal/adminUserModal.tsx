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
} from "@mui/material";
import { UserModalProps } from "../../types/interfaces";
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
          type="text"
          label="First Name"
          fullWidth
          slotProps={{
            inputLabel: { shrink: true },
          }}
          value={userForm.first_name}
          onChange={(e) => {
            setUserForm({ ...userForm, first_name: e.target.value });
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
          onChange={(e) =>
            setUserForm({ ...userForm, last_name: e.target.value })
          }
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
            onChange={(e) =>
              setUserForm({ ...userForm, email: e.target.value })
            }
          />
        )}

        <TextField
          margin="dense"
          label="Role"
          fullWidth
          value={userForm.role}
          onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
        />

        <InputLabel id="countries" shrink>
          Countries
        </InputLabel>
        <Select
          value={userForm.country}
          onChange={(e) =>
            // countries[] is an array of strings; this sets one selected string
            setUserForm({ ...userForm, country: e.target.value as string })
          }
          fullWidth
          displayEmpty
          renderValue={(value) =>
            value ? value : <span style={{ color: "#aaa" }}>Country</span>
          }
        >
          {countries.map((c) => (
            <MenuItem key={c.code} value={c.name}>
              {c.name}
            </MenuItem>
          ))}
        </Select>

        <TextField
          margin="dense"
          label="Zip Code"
          fullWidth
          slotProps={{
            inputLabel: { shrink: true },
          }}
          value={userForm.zip_code}
          onChange={(e) =>
            setUserForm({ ...userForm, zip_code: e.target.value })
          }
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
          onClick={onSave}
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
