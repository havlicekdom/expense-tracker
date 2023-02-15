import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { AuthContext } from '../../context/AuthContext';
import UserMenu from './UserMenu';

function Header() {
  const { user } = useContext(AuthContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AMPx
        </Typography>
        {user && <UserMenu />}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
