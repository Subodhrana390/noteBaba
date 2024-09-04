import React from "react";
import { Typography, AppBar, Toolbar } from "@mui/material";

const Footer = () => {
  return (
    <div>
      <Typography
        variant="body1"
        color="textSecondary"
        align="center"
        sx={{ flexGrow: 1 }}
      >
        © 2024 Note Page, All rights reserved.
      </Typography>
    </div>
  );
};

export default Footer;
