import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Autocomplete,
  Box,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  FormHelperText,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import currencyCodes from "currency-codes"; // Import currency-codes library
import { LoadingButton } from "@mui/lab";
import { VisibilityOffTwoTone, VisibilityTwoTone } from "@mui/icons-material";
import Copyright from "../../common/Copyright";
import { encryptPwd, getPasswordErrorMessage } from "../../config/fieldConfig";
import { onSignUp } from "../../service/outerPagesService";
import { fields } from "./formFields";
import ApiService from "../../../apis/ApiService";
import { Vortex } from "react-loader-spinner";
import useFetchOnMount from "../../config/useFetchOnMount";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm();

  // Show Password Start
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Currency Options
  const [options, setOptions] = useState([]);

  // email value
  const [email, setEmail] = useState("");
  const [vToken, setVToken] = useState("");

  // Loading Button
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);

  const handleTogglePassword = () => setShowPassword((show) => !show);
  const handleToggleConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  let navigate = useNavigate();

  const fetchData = async () => {
    try {
      const verifyToken = window.location.hash.slice(1);

      if (verifyToken) {
        // Perform token verification
        const res = await ApiService.verifiedToken(verifyToken);
        setVToken(verifyToken);
        console.log(res);
        if (
          res?.status === 200 &&
          res?.data?.status === "valid" &&
          res?.data?.email !== null
        ) {
          setEmail(res.data.email);
          navigate("/sign_up");
        } else if (
          res?.status === 200 &&
          res?.data?.status === "Token Already verified"
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
    } finally {
      setShow(false);
    }
  };

  // Call the custom hook with fetchData
  useFetchOnMount(fetchData);

  useEffect(() => {
    // Get all currency codes
    const allCurrencyCodes = currencyCodes.codes();

    // Set options
    setOptions(allCurrencyCodes);
  }, []); // Empty dependency array ensures this effect runs only once when component mounts

  const onSubmit = (data) => {
    setLoading(true);

    const encryptedPassword = encryptPwd(data.password);

    data.password = encryptedPassword;
    data.confirmPwd = "";

    delete data.confirmPassword;

    onSignUp(data, navigate, vToken, setLoading);
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
            px: 7,
            py: 5,
            marginTop: 2,
            marginBottom: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            ":hover": { boxShadow: 5 },
          }}
        >
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>

          <Alert severity="info" color="warning" sx={{ m: 1 }}>
            Please do not refresh the page until the signup completed.
          </Alert>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            {fields.map((field) =>
              field.name === "userId" ? (
                <TextField
                  key={field.name}
                  margin="normal"
                  required={field.required}
                  fullWidth
                  size="small"
                  label={field.label}
                  name={field.name}
                  value={email || ""}
                  disabled
                />
              ) : (
                <TextField
                  key={field.name}
                  margin="normal"
                  required={field.required}
                  fullWidth
                  size="small"
                  label={field.label}
                  name={field.name}
                  autoComplete="off"
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
                    field.name === "password" ||
                    field.name === "confirmPassword"
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
              )
            )}
            <FormControlLabel
              control={
                <Checkbox
                  {...register("terms", { required: true })}
                  color="primary"
                />
              }
              required
              onBlur={() => {
                trigger("terms"); // Trigger validation on blur
              }}
              label={
                <Box component={"span"}>
                  I accept the{" "}
                  <Link
                    to="/terms_conditions"
                    target="_blank"
                    className="hover:underline"
                  >
                    Terms &amp; Conditions
                  </Link>
                </Box>
              }
            />
            {errors.terms && (
              <FormHelperText error>
                Please accept the terms &amp; conditions
              </FormHelperText>
            )}

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
              {!loading ? "Complete Registration" : "Loading..."}
            </LoadingButton>
          </Box>

          <Copyright sx={{ mt: 4, mb: 2 }} />
        </Box>
      </Container>
    </>
  );
}
