import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
} from "@mui/material";
import PropTypes from "prop-types";
import { FiberManualRecord, Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";
import { useProject } from "../context/ProjectContext";

const drawerWidth = 240;

const Layout = ({ children }) => {
  const { favoriteProjects } = useProject();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6">Favorite Projects</Typography>
      <List>
        {favoriteProjects?.map((project) => (
          <ListItem
            key={project.id}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <FiberManualRecord fontSize="4px" />
            <ListItemText
              primary={project.name}
              primaryTypographyProps={{
                noWrap: true,
                sx: { overflow: "hidden", textOverflow: "ellipsis" },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Project Management
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { sm: "block", md: "none" },
              "& .MuiDrawer-paper": { width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { sm: "none", md: "block" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                position: "relative",
                height: "100vh",
                borderRight: "1px solid rgba(0, 0, 0, 0.12)",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: "background.default",
          overflow: "auto",
          px: { xs: 2, sm: 3, md: 5 },
          py: 3,
          pt: { xs: 10, sm: 12, md: 5 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
