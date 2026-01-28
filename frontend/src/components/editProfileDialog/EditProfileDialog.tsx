import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Slide,
  MenuItem,
} from "@mui/material";
import { countries, EditProfileDialogProps } from "../../types/interfaces";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";

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

/**
 * This component creates a pop up / modal form to dialog with the user data,
 * and update them.
 * https://mui.com/material-ui/react-dialog/
 * https://mui.com/material-ui/react-text-field/
 */

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  open,
  formData,
  setFormData,
  onClose,
  onSave,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slots={{ transition: Transition }}
    >
      <DialogTitle>Edit Profile</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="First Name"
          value={formData.first_name}
          /**
           * Updates the 'first_name' field inside formData.
           * 'e' is the change event from the TextField with '.target.value` which is the new text the user typed
           * will be updating the data that are copied '{ ...formData }' from the existing form data
           * 'first_name: e.target.value' replaces only the first_name field
           * https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components
           * https://stackoverflow.com/questions/64105922/why-these-brackets-in-this-function-setformdata-formdata-e-target-name
           * https://coderspacket.com/posts/submit-form-data-in-reactjs/
           * https://clouddevs.com/react/forms/
           */
          onChange={(e) =>
            setFormData({ ...formData, first_name: e.target.value })
          }
        />

        <TextField
          label="Last Name"
          value={formData.last_name}
          onChange={(e) =>
            setFormData({ ...formData, last_name: e.target.value })
          }
        />

        <TextField
          select
          fullWidth
          required
          label="Country"
          value={formData.country}
          onChange={(e) =>
            setFormData({ ...formData, country: e.target.value })
          }
        >
          {countries.map((c) => (
            <MenuItem key={c.code} value={c.name}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Zip Code"
          value={formData.zip_code}
          onChange={(e) =>
            setFormData({ ...formData, zip_code: e.target.value })
          }
        />
      </DialogContent>

      <DialogActions>
        <Button
          sx={{ color: "#472d30", "&:hover": { color: "#e26d5c" } }}
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          sx={{ backgroundColor: "#472d30", "&:hover": { bgcolor: "#e26d5c" } }}
          onClick={onSave}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileDialog;
