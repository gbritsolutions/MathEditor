import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { VisibilityOffTwoTone, VisibilityTwoTone } from "@mui/icons-material";
import toast from "react-hot-toast";
import Captcha from "../../common/Captcha";
import Copyright from "../../common/Copyright";
import { CAPTCHA_FAIL } from "../../config/toastMessage";
import { encryptPwd, validateNotEmptySpace } from "../../config/fieldConfig";
import { onGoogleSignIn, onSignIn } from "../../service/outerPagesService";
import { fields } from "./formFields";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function SignIn({ setIsAuthenticated, setRes }) {
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  // Loading Button
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);

  const handleCaptchaChange = (isCaptchaChecked) => {
    setIsCaptchaChecked(isCaptchaChecked);
  };

  let navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(false); //To set frontend authentication
    setRes(false);

    // To remove session storage for logout
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("organizationName");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("beneficiaryId");
    sessionStorage.removeItem("orgId");
    sessionStorage.removeItem("response");
    sessionStorage.removeItem("googleLogin");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data) => {
    const user = { ...data };
    if (isCaptchaChecked === true) {
      setLoading(true);
      // Introduce a delay using setTimeout
      // setTimeout(() => {
      try {
        const encryptedText = encryptPwd(user.password);
        user.password = encryptedText;
        onSignIn(user, navigate, setIsAuthenticated, setRes, setLoading);
      } catch (error) {
        navigate("/register");
        console.log(error);
      }
      // After the delay, set loading back to false
      // setLoading(false);
      // }, 1000); // Adjust the delay time (in milliseconds) as needed
    } else {
      toast.error(CAPTCHA_FAIL);
    }
  };

  const handleLoginSuccess = (response) => {
    const decodedToken = jwtDecode(response.credential);

    const googleToken = response.credential;

    if (decodedToken.email_verified === true) {
      onGoogleSignIn(googleToken, setIsAuthenticated, setRes, navigate);
    }
  };

  const handleLoginFailure = (error) => {
    console.error("Login Failed:", error);
    toast.error(error);
  };

  return (
    <>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              m: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 3 }}
            >
              {fields.map((field) => (
                <TextField
                  key={field.name}
                  margin="normal"
                  size="small"
                  required={field.required}
                  fullWidth
                  label={field.label}
                  name={field.name}
                  autoComplete={field.autoComplete}
                  type={
                    field.name === "password"
                      ? showPassword
                        ? "text"
                        : "password"
                      : field.type
                  }
                  InputProps={
                    field.name === "password"
                      ? {
                          endAdornment: (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
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
                    validate: {
                      validateNotEmptySpace: (value) =>
                        field.required ? validateNotEmptySpace(value) : true,
                    }, // Apply validateNotEmptySpace for all fields
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

              <Captcha onCaptchaChange={handleCaptchaChange} />

              <FormControlLabel
                control={<Checkbox {...register("remember")} color="primary" />}
                label="Remember me"
              />

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
                {!loading ? "Sign In" : "Loading..."}
              </LoadingButton>

              <Grid container>
                <Grid item xs>
                  <Link href="/forgot_pwd" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Register Now"}
                  </Link>
                </Grid>
              </Grid>

              {/* <GoogleOAuthProvider
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 2,
                  }}
                >
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onFailure={handleLoginFailure}
                    cookiePolicy="single_host_origin"
                    shape="pill"
                    theme="filled_blue"
                  />
                </Box>
              </GoogleOAuthProvider> */}

              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
