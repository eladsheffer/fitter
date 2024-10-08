import React from "react";
import logo from "@/../../public/icons/fitter-logo.jpg";
import user from "@/../../public/icons/user.png";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from '../features/user';
import { postData } from "../features/apiService";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';

const pages = ['Groups', 'Events'];
//const settings = ['Profile', 'Logout'];

function FitterNavbar() {

  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const default_profile_picture = user;

  const dispatch = useDispatch();
  const activeUser = useSelector((state) => (state.user ? state.user.value : null));

  // const [searchKey, setSearchKey] = useState('');
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const logoutFunc = async () => {

    let data = await postData(serverUrl + 'users/logout/', null);
    dispatch(logout());
    localStorage.removeItem('authToken');
    handleCloseUserMenu();
    navigate('/');
  }

  const handleSearch = async () => {
    navigate(`/search`);
    // setSearchKey('');
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (event) => {
    setAnchorElNav(null);
    if (event.currentTarget.innerText !== '')
      navigate(`/${event.currentTarget.innerText}/`.toLocaleLowerCase());
  };

  const handleCloseUserMenu = (event) => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="sticky" style={{zIndex: "1"}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            //noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <img src={logo} alt="Fitter" width="60" height="40" />
            </Link>
          </Typography>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <img src={logo} alt="Fitter" width="100" height="50" />
            </Link>
          </Typography>
          {/* <Search>
            <StyledInputBase
              placeholder="Search groups/events..."
              inputProps={{ 'aria-label': 'search' }}
              onChange={(event) => setSearchKey(event.target.value)}
              value={searchKey}
              onKeyDown={(event) => { if (event.key === 'Enter') handleSearch() }}
            />
          </Search> */}
          <IconButton size="large" aria-label="search" color="inherit" onClick={()=>handleSearch()}><SearchIcon /></IconButton>


          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="" src={!activeUser ? null : activeUser.profile_picture ? activeUser.profile_picture : default_profile_picture} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >

              {activeUser && <Link to={`/users/${activeUser.id}/`} style={{ textDecoration: "none" }}><MenuItem key="profile" onClick={handleCloseUserMenu}>
                <Typography textAlign="center">View Profile</Typography>
              </MenuItem></Link>}

              {activeUser && <Link to="/edit-profile/" style={{ textDecoration: "none" }}><MenuItem key="profile" onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Settings</Typography>
              </MenuItem></Link>}

              {activeUser && <MenuItem key="logout" onClick={logoutFunc}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>}

              {!activeUser && <Link style={{ textDecoration: "none" }} to="/login"><MenuItem key="login" onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Login</Typography>
              </MenuItem></Link>}
              {!activeUser && <Link to="/signup" style={{ textDecoration: "none" }}> <MenuItem key="signup" onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Signup</Typography>

              </MenuItem></Link>}



            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default FitterNavbar;