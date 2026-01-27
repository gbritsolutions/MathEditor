export const fields = [
  {
    label: "Current Password",
    name: "oldPassword",
    type: "password",
    helperText: "Please enter your current password",
    autoFocus: true,
    required: true,
  },
  {
    label: "New Password",
    name: "password",
    type: "password",
    helperText: "Please create your new password",
    required: true,
  },
  {
    label: "Confirm Password",
    name: "confirmPassword",
    type: "password",
    helperText: "Please reenter your new password",
    required: true,
  },
];
