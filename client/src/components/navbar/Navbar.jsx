import React, {useState} from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import '../../styles/Navbar.css';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const handleSubmenuClick = (event) => {
      setSubmenuAnchorEl(event.currentTarget);
    };
  
    const handleSubmenuClose = () => {
      setSubmenuAnchorEl(null);
    };
    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };
  return (
    <>
        <div className='navbar'>
            <div className="w-2/3 lg:w-1/4 navImageBar">
                <img src="https://scontent.fdac1-1.fna.fbcdn.net/v/t39.30808-6/244505981_4561260667245848_4745833153649242370_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=a2f6c7&_nc_eui2=AeE2A-FwjZISQjN_5ls4q2g4meWa1fk0Ux6Z5ZrV-TRTHjLK4vufB-yO457qvFKBoLzUTVnwzRCXDK53hexr3tIj&_nc_ohc=bO-QzNevw9QAX8Rsm9b&_nc_zt=23&_nc_ht=scontent.fdac1-1.fna&cb_e2o_trans=q&oh=00_AfDkqtlV2uEK6him1d_-j95NogY0Yp4BhHkHdIIFkZoccw&oe=6510EEE3" alt='logo' />
            </div>
            <div className="w-1/3 lg:w-3/4">
                <AppBar position="static" className="navMenuBar" elevation={0}>
                    <Toolbar className='bg-white text-black my-auto navMenuSubBar' >
                        <div className='desktopMenu'>
                          <Button color="inherit" onClick={handleClick}>
                              Home
                          </Button>
                          <Button color="inherit" onClick={handleSubmenuClick}>
                              Services
                          </Button>
                          <Menu
                              anchorEl={submenuAnchorEl}
                              open={Boolean(submenuAnchorEl)}
                              onClose={handleSubmenuClose}
                          >
                              <MenuItem onClick={handleSubmenuClose}>Service 1</MenuItem>
                              <MenuItem onClick={handleSubmenuClose}>Service 2</MenuItem>
                          </Menu>
                          <Button color="inherit" onClick={handleClick}>
                              About
                          </Button>
                          <Button color="inherit" onClick={handleClick}>
                              Contact
                          </Button>
                        </div>
                        <IconButton
                          color="inherit"
                          aria-label="menu"
                          onClick={handleMenuToggle}
                          edge="start"
                          className='navLeftBarButton'
                        >
                          <MenuIcon />
                        </IconButton>
                    </Toolbar>
                    
                </AppBar>     
                <Drawer
                  anchor="left"
                  open={isMenuOpen}
                  onClose={handleMenuToggle}
                >
                  <div style={{ width: 200 }}>
                    <MenuItem onClick={handleMenuToggle}>Home</MenuItem>
                    <MenuItem onClick={handleMenuToggle}>Services</MenuItem>
                    <MenuItem onClick={handleMenuToggle}>About</MenuItem>
                    <MenuItem onClick={handleMenuToggle}>Contact</MenuItem>
                  </div>
                </Drawer>
            </div>
        </div>  
    </>
  )
}

export default Navbar