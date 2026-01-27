import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axiosClient from "../../../apis/Api";
import Copyright from "../../common/Copyright";
import { validateEmail } from "../../config/fieldConfig";
import { onForgotPwd } from "../../service/outerPagesService";
import { fields } from "./formFields";

export default function ForgotPwd() {
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();

  // Loading Button
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    register("userEmail", {
      validate: validateEmail,
    });
  }, [register]);

  let navigate = useNavigate();

  const onSubmit = (data) => {
    setLoading(true);

    const url = axiosClient.defaults.apiUrl_recoverPwd;

    onForgotPwd(data, url, navigate, setLoading);
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
            Forgot Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
            className="w-full" //If additional fields add to remove width
          >
            {fields.map((field) => (
              <TextField
                key={field.name}
                margin="normal"
                required={field.required}
                fullWidth
                label={field.label}
                name={field.name}
                type={field.type}
                autoFocus={field.autoFocus}
                size="small"
                {...register(field.name, {
                  required: field.required
                    ? `${field.label} is required`
                    : false,
                  validate: {
                    validateEmail: (value) =>
                      field.required ? validateEmail(value) : true,
                  },
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
                  Remember it? Sign in Here
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
