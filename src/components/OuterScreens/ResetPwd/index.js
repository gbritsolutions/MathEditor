import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  CssBaseline,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { VisibilityOffTwoTone, VisibilityTwoTone } from "@mui/icons-material";
import Copyright from "../../common/Copyright";
import { getPasswordErrorMessage } from "../../config/fieldConfig";
import { onResetPwd } from "../../service/outerPagesService";
import { fields } from "./formFields";

export default function ResetPwd() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();

  // Show Password Start
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading Button
  const [loading, setLoading] = useState(false);

  const handleToggleCurrentPassword = () =>
    setShowCurrentPassword((show) => !show);

  const handleTogglePassword = () => setShowPassword((show) => !show);

  const handleToggleConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  let navigate = useNavigate();

  const onSubmit = (data) => {
    setLoading(true);

    onResetPwd(data, navigate, setLoading);
  };

  return (
    <>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 6,
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            ":hover": { boxShadow: 5 },
          }}
        >
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            {fields.map((field) => (
              <TextField
                key={field.name}
                margin="normal"
                required={field.required}
                fullWidth
                label={field.label}
                name={field.name}
                autoComplete="off"
                size="small"
                type={
                  field.name === "oldPassword"
                    ? showCurrentPassword
                      ? "text"
                      : "password"
                    : field.name === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : field.name === "confirmPassword"
                    ? showConfirmPassword
                      ? "text"
                      : "password"
                    : field.type
                }
                autoFocus={field.autoFocus}
                InputProps={
                  field.name === "oldPassword" ||
                  field.name === "password" ||
                  field.name === "confirmPassword"
                    ? {
                        endAdornment: (
                          <IconButton
                            aria-label={`toggle ${field.label} visibility`}
                            onClick={
                              field.name === "password"
                                ? handleTogglePassword
                                : field.name === "confirmPassword"
                                ? handleToggleConfirmPassword
                                : handleToggleCurrentPassword
                            }
                            onMouseDown={(event) => event.preventDefault()}
                            edge="end"
                          >
                            {field.name === "password" ? (
                              showPassword ? (
                                <VisibilityOffTwoTone />
                              ) : (
                                <VisibilityTwoTone />
                              )
                            ) : field.name === "confirmPassword" ? (
                              showConfirmPassword ? (
                                <VisibilityOffTwoTone />
                              ) : (
                                <VisibilityTwoTone />
                              )
                            ) : showCurrentPassword ? (
                              <VisibilityOffTwoTone />
                            ) : (
                              <VisibilityTwoTone />
                            )}
                          </IconButton>
                        ),
                      }
                    : null
                }
                {...register(field.name, {
                  required: field.required
                    ? `${field.label} is required`
                    : false,
                  validate:
                    field.name === "password"
                      ? (value) => getPasswordErrorMessage(value)
                      : field.name === "confirmPassword"
                      ? (value) =>
                          value === getValues("password") ||
                          "New Passwords do not match"
                      : null,
                })}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
                onChange={(e) => {
                  setValue(field.name, e.target.value); // Update the form value
                  trigger(field.name); // Trigger validation on change
                }}
                onBlur={() => {
                  trigger(field.name); // Trigger validation on blur
                }}
              />
            ))}

            <LoadingButton
              variant="contained"
              type="submit"
              fullWidth
              loading={loading}
              loadingPosition="start"
              startIcon={<></>}
              style={{
                backgroundColor: loading ? "#448aff" : undefined,
                color: loading ? "#fff" : undefined,
              }}
              sx={{ my: 1 }}
            >
              {!loading ? "Reset" : "Loading..."}
            </LoadingButton>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Box>
      </Container>
    </>
  );
}
