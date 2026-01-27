import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import toast from "react-hot-toast";
import { VisibilityOffTwoTone, VisibilityTwoTone } from "@mui/icons-material";
import Copyright from "../../common/Copyright";
import { getPasswordErrorMessage } from "../../config/fieldConfig";
import { onRecoverPwd } from "../../service/outerPagesService";
import { fields } from "./formFields";
import ApiService from "../../../apis/ApiService";
import useFetchOnMount from "../../config/useFetchOnMount";
import { Vortex } from "react-loader-spinner";
import { RECOVER_FAILED2 } from "../../config/toastMessage";

export default function RecoverPwd() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();

  // Show Password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading Button
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);

  const handleTogglePassword = () => setShowPassword((show) => !show);
  const handleToggleConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const [resetToken, setResetToken] = useState("");

  const fetchData = async () => {
    try {
      // Get the hash part of the URL
      const hash = window.location.hash;
      // Remove the leading '#' character
      const verifyToken = hash.slice(1);
      setResetToken(verifyToken);

      if (verifyToken) {
        // Perform token verification
        const res = await ApiService.verifyResetPasswordToken(verifyToken);
        console.log(res);
        if (res && res.status === 200 && res.data === "valid") {
          navigate("/recover_pwd");
        } else if (
          res?.status === 200 &&
          res?.data === "Invalid verification token"
        ) {
          navigate("/token_verified");
        } else {
          navigate("/access_denied");
        }
      } else {
        navigate("/access_denied");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(RECOVER_FAILED2);
    } finally {
      setShow(false);
    }
  };

  // Call the custom hook with fetchData
  useFetchOnMount(fetchData);

  let navigate = useNavigate();

  const onSubmit = (data) => {
    setLoading(true);

    onRecoverPwd(data, resetToken, navigate, setLoading);
  };

  return (
    <>
      {show && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.5)", // Semi-transparent white background
            zIndex: 9999, // Ensure it's above other content
          }}
        >
          <Vortex
            visible={true}
            height="80"
            width="80"
            ariaLabel="vortex-loading"
            wrapperStyle={{}}
            wrapperClass="vortex-wrapper"
            colors={["red", "green", "blue", "yellow", "orange", "purple"]}
          />
        </Box>
      )}

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
            Recover Password
          </Typography>

          <Alert severity="info" color="warning" sx={{ m: 2 }}>
            Please do not refresh the page until the recover your password.
          </Alert>

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
                required
                fullWidth
                label={field.label}
                name={field.name}
                autoComplete="off"
                size="small"
                type={
                  field.name === "password"
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
                  field.name === "password" || field.name === "confirmPassword"
                    ? {
                        endAdornment: (
                          <IconButton
                            aria-label={`toggle ${field.label} visibility`}
                            onClick={
                              field.name === "password"
                                ? handleTogglePassword
                                : handleToggleConfirmPassword
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
                            ) : showConfirmPassword ? (
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
                          "Passwords do not match"
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
              {!loading ? "Recover" : "Loading..."}
            </LoadingButton>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/sign_in" variant="body2">
                  Remember your password? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Box>
      </Container>
    </>
  );
}
