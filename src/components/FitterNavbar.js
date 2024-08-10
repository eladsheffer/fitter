import React, {useState} from "react";
import logo from "@/../../public/icons/fitter-logo.jpg";
import user from "@/../../public/icons/user.png";
import { useSelector } from "react-redux";
import { Link , useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from '../features/user';
import { getData,postData } from "../features/apiService";
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
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { TextField } from "@mui/material";

const pages = ['Groups', 'Events'];
const settings = ['Profile', 'Logout'];


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(${theme.spacing(1)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function FitterNavbar() {

  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const default_profile_picture = user;

  const dispatch = useDispatch();
  const activeUser = useSelector((state) => (state.user? state.user.value: null));

  const [searchKey , setSearchKey] = useState('');
  const [radioValue, setRadioValue] = useState('1');
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const logoutFunc = async () => {

    let data = await postData(serverUrl + 'users/logout/', null);
      dispatch(logout()); 
    handleCloseUserMenu();
  }

  const handleSearch = async () => {
    let groupsData = await getData(serverUrl + `groups/?search=${searchKey}`);
    let eventsData = await getData(serverUrl + `events/?search=${searchKey}`);

    let searchResults = {
      groupsData: groupsData.results,
      eventsData: eventsData.results
    }
    navigate(`/search?key=${searchKey}`, {state: searchResults});

    }
  

  const handleSearchToggle = async (e) => {
    setRadioValue(e.target.value);
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (event) => {
    setAnchorElNav(null);
    if (event.currentTarget.innerText !=='')
      navigate(`/${event.currentTarget.innerText}/`.toLocaleLowerCase());
  };

  const handleCloseUserMenu = (event) => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
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
            <img src={logo } alt="Fitter" height="50" />
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
          <Search>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </Search>
          <IconButton size="large" aria-label="search" color="inherit" onClick={handleSearch}><SearchIcon /></IconButton>

          
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
                {/* <img src={!activeUser ? "/icons/group.png" : activeUser.profile_picture ? activeUser.profile_picture : default_profile_picture} width="30" height="30" roundedCircle /> */}
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

              {activeUser && <MenuItem key="logout" onClick={logoutFunc}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>}
                
                {activeUser && <Link to="/edit-profile/" style={{textDecoration: "none"}}><MenuItem key="profile" onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Settings</Typography>
                  
                </MenuItem></Link>}

                {!activeUser &&  <Link style={{textDecoration: "none"}} to="/login"><MenuItem key="login" onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Login</Typography>
                </MenuItem></Link>}
                {!activeUser &&<Link to="/signup" style={{textDecoration: "none"}}> <MenuItem key="signup" onClick={handleCloseUserMenu}>
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

// import React, {useState} from "react";
// import logo from "@/../../public/icons/fitter-logo.jpg";
// import user from "@/../../public/icons/user.png";
// import { Navbar, Nav, Form, Row, Col, Button, Image } from "react-bootstrap";
// import { useSelector } from "react-redux";
// import { Link , useNavigate } from "react-router-dom";
// import { useDispatch } from 'react-redux';
// import { logout } from '../features/user';
// import { getData,postData } from "../features/apiService";

// const FitterNavbar = () => {
//   const serverUrl = process.env.REACT_APP_SERVER_URL;
//   const default_profile_picture = user;
//   const [searchKey , setSearchKey] = useState('');
//   const [radioValue, setRadioValue] = useState('1');
//   const navigate = useNavigate();

//   const dispatch = useDispatch();
//   const activeUser = useSelector((state) => state.user.value);
//   let signupLink = !activeUser ? <Nav.Link as={Link} to="/signup">Signup</Nav.Link> : null;
//   let loginLink = !activeUser ? <Nav.Link as={Link} to="/login">Login</Nav.Link> : null;
//   let logoutLink = activeUser ? <Nav.Link as={Link} to="/" onClick={() => logoutFunc()}>Logout</Nav.Link> : null;
//   let profile = activeUser ? <Nav.Link as={Link} to="/edit-profile"><Image src={activeUser.profile_picture ? activeUser.profile_picture : default_profile_picture} width="30" height="30" roundedCircle /></Nav.Link> : null;

//   const logoutFunc = async () => {

//     let data = await postData(serverUrl + 'users/logout/', null);
//     if (data != null)
//       dispatch(logout()); 
//   }

//   const handleSearch = async () => {
//     console.log('searchKey:', searchKey);
//     let groupsData = await getData(serverUrl + `groups/?search=${searchKey}`);
//     let eventsData = await getData(serverUrl + `events/?search=${searchKey}`);
//     console.log('groupsData:', groupsData.results);
//     console.log('eventsData:', eventsData.results);

//     let searchResults = {
//       groupsData: groupsData.results,
//       eventsData: eventsData.results
//     }
//     navigate(`/search?key=${searchKey}`, {state: searchResults});

//     }
  

//   const handleSearchToggle = async (e) => {
//     console.log('radioValue:', e.target.value);
//     setRadioValue(e.target.value);
//   }

//   return (
//     <Navbar
//       className="bg-body-tertiary justify-content-between"
//       bg="dark"
//       data-bs-theme="dark"
//     >
//       <Navbar.Brand as={Link} to="/">
//         <Image
//           src={logo}
//           width="100"
//           height="50"
//           className="d-inline-block align-top"
//           alt="Fitter"
//           rounded
//         />
//       </Navbar.Brand>
//       <Form>
//         <Row>
//           <Col xs="auto">
//             <Form.Control
//               type="text"
//               placeholder="Search"
//               className="mr-sm-2 rounded-pill"
//               onChange={(e) => setSearchKey(e.target.value)}
//             />
//           </Col>
//           <Col xs="auto">
//             {/* <Nav.Link to='/search'> */}
//               <Button onClick={handleSearch}>Search</Button>
//             {/* </Nav.Link> */}
            
//           </Col>
//         </Row>
//       </Form>
      
//       <Nav>
//         <Nav.Link as={Link} to="/groups">Groups</Nav.Link>
//         <Nav.Link as={Link} to="/events">Events</Nav.Link>
//       </Nav>
//       <Nav>
//         {signupLink}
//         {loginLink}
//         {logoutLink}
//         {profile}
//       </Nav>
//     </Navbar>
//   );
// };

// export default FitterNavbar;
