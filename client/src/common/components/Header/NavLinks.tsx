import React from "react";
import { List, ListItem } from "@mui/material";
import { NavLink } from "react-router-dom";

const navLinks = [
  { title: "CREATE", path: "/create" },
  { title: "DELETE", path: "/delete" },
  { title: "MORE", path: "/more" },
];

const navStyles = {
  color: "inherit",
  textDecoration: "none",
  typography: "h6",
  "&:hover": { color: "grey.500" },
  "&.active": { color: "text.secondary" },
};

export default function NavLinks() {
  return (
    <List sx={{ display: "flex" }}>
      {navLinks.map(({ title, path }) => (
        <ListItem key={path} component={NavLink} to={path} sx={navStyles}>
          {title}
        </ListItem>
      ))}
    </List>
  );
}
