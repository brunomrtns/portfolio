/** @jsxImportSource @emotion/react */
import React, { useState, useContext, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FaFlagUsa } from "react-icons/fa";
import { GiBrazilFlag } from "react-icons/gi";
import { useThemeContext } from "../theme/theme-context";
import { AuthContext } from "../context/auth-context";
import AuthModal from "./auth-modal";
import axios from "axios";
import { API_BASE_URL } from "../config";

interface NavbarProps {
  setCurrentPage: (page: string) => void;
  setSelectedCategory: (categoryId: string) => void;
}

interface Category {
  id: number;
  title: string;
}

interface MenuItemProps {
  text: string;
  onClick?: () => void;
  keepOpen?: boolean; // Indica se o menu principal deve permanecer aberto
  submenu?: React.ReactNode; // Para submenus, passamos os filhos
}

const Navbar: React.FC<NavbarProps> = ({
  setCurrentPage,
  setSelectedCategory,
}) => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const { toggleTheme, themeMode } = useThemeContext();
  const { user, setUser, setToken, setChatId } = useContext(AuthContext);
  const [isModalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/admin/categories`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const toggleCategories = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setChatId(null);
  };

  const iconButtonStyle = {
    transition: "transform 0.3s ease-in-out",
    transform: themeMode === "light" ? "rotate(0deg)" : "rotate(180deg)",
  };

  const handleItemClick = (keepOpen?: boolean, onClick?: () => void) => {
    if (!keepOpen) {
      setDrawerOpen(false); // Fecha o menu principal se keepOpen for false ou não definido
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Bruno Martins</Typography>
          <Box ml="auto">
            <IconButton color="inherit" onClick={() => changeLanguage("en")}>
              <FaFlagUsa />
            </IconButton>
            <IconButton color="inherit" onClick={() => changeLanguage("pt")}>
              <GiBrazilFlag />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={toggleTheme}
              style={iconButtonStyle}
            >
              {themeMode === "light" ? <MdLightMode /> : <MdDarkMode />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box role="presentation" sx={{ width: 250 }}>
          <List>
            {/* Itens de Menu */}
            <ListItem
              button
              onClick={() =>
                handleItemClick(false, () => setCurrentPage("home"))
              }
            >
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                handleItemClick(false, () => setCurrentPage("services"))
              }
            >
              <ListItemText primary="Services" />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                handleItemClick(false, () => setCurrentPage("about"))
              }
            >
              <ListItemText primary="About" />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                handleItemClick(false, () => setCurrentPage("skills"))
              }
            >
              <ListItemText primary="Skills" />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                handleItemClick(false, () => setCurrentPage("portfolio"))
              }
            >
              <ListItemText primary="Portfolio" />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                handleItemClick(false, () => setCurrentPage("contact"))
              }
            >
              <ListItemText primary="Contact" />
            </ListItem>

            {/* Submenu de Categorias */}
            <ListItem
              button
              onClick={() => handleItemClick(true, toggleCategories)}
            >
              <ListItemText primary="Categories" />
              {categoriesOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={categoriesOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {categories.map((category) => (
                  <ListItem
                    button
                    key={category.id}
                    onClick={() =>
                      handleItemClick(false, () => {
                        setSelectedCategory(category.id.toString());
                        setCurrentPage("category-articles");
                      })
                    }
                    sx={{ pl: 4 }}
                  >
                    <ListItemText primary={category.title} />
                  </ListItem>
                ))}
              </List>
            </Collapse>

            {/* Itens para atendentes */}
            {user?.type === "attendant" && (
              <>
                <ListItem
                  button
                  onClick={() =>
                    handleItemClick(false, () =>
                      setCurrentPage("attendant-chats")
                    )
                  }
                >
                  <ListItemText primary="Chats" />
                </ListItem>
                <ListItem
                  button
                  onClick={() =>
                    handleItemClick(false, () => setCurrentPage("add-project"))
                  }
                >
                  <ListItemText primary="Acrescentar Projeto" />
                </ListItem>
              </>
            )}

            {/* Login/Logout */}
            <ListItem
              button
              onClick={() =>
                handleItemClick(
                  false,
                  user ? handleLogout : () => setModalOpen(true)
                )
              }
            >
              <ListItemText primary={user ? "Logout" : "Login"} />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <AuthModal open={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Navbar;
