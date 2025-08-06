import React from 'react';
import { AppBar, Toolbar, InputBase, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const DashboardAppBar = ({ user, anchorEl, onMenuOpen, onMenuClose, onProfile, onLogout }) => (
  <AppBar position="static" color="default" elevation={1}>
    <Toolbar className="flex justify-between">
      <div className="flex items-center">
        <SearchIcon />
        <InputBase placeholder="Buscar..." className="ml-2" />
      </div>
      <div>
        <IconButton onClick={onMenuOpen}>
          <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onMenuClose}>
          <MenuItem onClick={() => {
  onMenuClose();
  onProfile();
}}>
  Editar Perfil
</MenuItem>
          <MenuItem onClick={onLogout}>Salir</MenuItem>
        </Menu>
      </div>
    </Toolbar>
  </AppBar>
);

export default DashboardAppBar;