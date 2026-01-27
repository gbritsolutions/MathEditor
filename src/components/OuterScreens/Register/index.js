import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CssBaseline,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  FlagImage,
  defaultCountries,
  parseCountry,
  usePhoneInput,
} from "react-international-phone";
import toast from "react-hot-toast";
import { fields } from "./formFields";
import axiosClient from "../../../apis/Api";
import Captcha from "../../common/Captcha";
import Copyright from "../../common/Copyright";
import { validateNotEmptySpace } from "../../config/fieldConfig";
import { onRegister } from "../../service/outerPagesService";
import { CAPTCHA_FAIL } from "../../config/toastMessage";

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();

  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);

  // Loading Button
  const [loading, setLoading] = useState(false);

  // CountryPhone Start
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: "in",
      countries: defaultCountries,
    });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    const formData = {
      ...data,
      country: country.name,
      phone: inputValue,
    };

    const domain = axiosClient.defaults.apiUrl;

    if (isCaptchaChecked === true) {
      setLoading(true);
      onRegister(formData, navigate, domain, setLoading);
    } else {
      toast.error(CAPTCHA_FAIL);
    }
  };

  const handleCaptchaChange = (isCaptchaChecked) => {
    setIsCaptchaChecked(isCaptchaChecked);
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
              my: 2,
              mx: 7,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button href="/sign_in" variant="outlined">
                  Sign In
                </Button>
              </Grid>
            </Grid>
            <Typography component="h1" variant="h5">
              Register Here
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
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
                  type={field.type}
                  autoFocus={field.autoFocus}
                  InputProps={
                    field.name === "phone"
                      ? {
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              style={{
                                marginRight: "2px",
                                marginLeft: "-8px",
                              }}
                            >
                              <Select
                                MenuProps={{
                                  style: {
                                    height: "300px",
                                    width: "360px",
                                    top: "10px",
                                    left: "-34px",
                                  },
                                  transformOrigin: {
                                    vertical: "top",
                                    horizontal: "left",
                                  },
                                }}
                                sx={{
                                  width: "max-content",
                                  fieldset: {
                                    display: "none",
                                  },
                                  '&.Mui-focused:has(div[aria-expanded="false"])':
                                    {
                                      fieldset: {
                                        display: "block",
                                      },
                                    },
                                  ".MuiSelect-select": {
                                    padding: "8px",
                                    paddingRight: "24px !important",
                                  },
                                  svg: {
                                    right: 0,
                                  },
                                }}
                                value={country.iso2}
                                onChange={(e) => setCountry(e.target.value)}
                                renderValue={(value) => (
                                  <FlagImage
                                    iso2={value}
                                    style={{ display: "flex" }}
                                  />
                                )}
                              >
                                {defaultCountries.map((c) => {
                                  const country = parseCountry(c);
                                  return (
                                    <MenuItem
                                      key={country.iso2}
                                      value={country.iso2}
                                    >
                                      <FlagImage
                                        iso2={country.iso2}
                                        style={{ marginRight: "8px" }}
                                      />
                                      <Typography marginRight="8px">
                                        {country.name}
                                      </Typography>
                                      <Typography color="gray">
                                        +{country.dialCode}
                                      </Typography>
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </InputAdornment>
                          ),
                          value: inputValue,
                          onChange: handlePhoneValueChange,
                          inputRef: inputRef,
                        }
                      : {}
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
                {!loading ? "Submit" : "Loading..."}
              </LoadingButton>

              <Copyright sx={{ mt: 3 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
