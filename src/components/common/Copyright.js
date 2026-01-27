import { Link, Typography } from "@mui/material";
import { WEB_URL } from "../config/fieldConfig";

export default function Copyright(props) {
  return (
    <>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        <Link color="inherit" href={WEB_URL} target="_blank">
        www.matheditor.co
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </>
  );
}
