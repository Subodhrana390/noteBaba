import React from "react";
import { Typography, AppBar, Toolbar } from "@mui/material";

const Footer = () => {
  return (
    <div>
      <AppBar position="static" color="default" sx={{ top: "auto", bottom: 0 }}>
        <Toolbar>
          <Typography
            variant="body1"
            color="textSecondary"
            align="center"
            sx={{ flexGrow: 1 }}
          >
            © 2024 Note Page, All rights reserved.
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Footer;
