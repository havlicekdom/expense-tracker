import { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { AuthContext } from "../auth/AuthContext";
import { UserMenu } from "./UserMenu";

export function Header() {
  const { user } = useContext(AuthContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Expense Tracker
        </Typography>
        {user && <UserMenu />}
      </Toolbar>
    </AppBar>
  );
}
