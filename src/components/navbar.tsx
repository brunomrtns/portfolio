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
  ListItemIcon,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import BuildIcon from "@mui/icons-material/Build";
import WorkIcon from "@mui/icons-material/Work";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import CategoryIcon from "@mui/icons-material/Category";
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
import { appBarStyle } from "./styles";

interface NavbarProps {
  setCurrentPage: (page: string) => void;
  setSelectedCategory: (categoryId: string) => void;
}

interface Category {
  id: number;
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({
  setCurrentPage,
  setSelectedCategory,
}) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
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
      <AppBar
        position="static"
        css={appBarStyle(themeMode, theme)} // Chama a função appBarStyle com o tema atual
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label={t("navbar.menu")}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">{t("navbar.title")}</Typography>
          <Box ml="auto">
            <IconButton
              color="inherit"
              aria-label={t("navbar.language.en")}
              onClick={() => changeLanguage("en")}
            >
              <FaFlagUsa />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label={t("navbar.language.pt")}
              onClick={() => changeLanguage("pt")}
            >
              <GiBrazilFlag />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={toggleTheme}
              style={iconButtonStyle}
              aria-label={t("navbar.toggleTheme")}
            >
              {themeMode === "light" ? <MdLightMode /> : <MdDarkMode />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box role="presentation" sx={{ width: 250 }}>
          <List>
            <ListItem
              button
              onClick={() =>
                handleItemClick(false, () => setCurrentPage("home"))
              }
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={t("navbar.home")} />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                handleItemClick(false, () => setCurrentPage("services"))
              }
            >
              <ListItemIcon>
                <BuildIcon />
              </ListItemIcon>
              <ListItemText primary={t("navbar.services")} />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                handleItemClick(false, () => setCurrentPage("about"))
              }
            >
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary={t("navbar.about")} />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                handleItemClick(false, () => setCurrentPage("skills"))
              }
            >
              <ListItemIcon>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText primary={t("navbar.skills")} />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                handleItemClick(false, () => setCurrentPage("portfolio"))
              }
            >
              <ListItemIcon>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText primary={t("navbar.portfolio")} />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                handleItemClick(false, () => setCurrentPage("contact"))
              }
            >
              <ListItemIcon>
                <ContactMailIcon />
              </ListItemIcon>
              <ListItemText primary={t("navbar.contact")} />
            </ListItem>

            {/* Submenu de Categorias */}
            <ListItem
              button
              onClick={() => handleItemClick(true, toggleCategories)}
            >
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary={t("navbar.categories")} />
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
            {user?.type === "attendant" && (
              <Button
                color="inherit"
                onClick={() => setCurrentPage("add-project")}
              >
                {t("navbar.addProjects")}
              </Button>
            )}
            <ListItem
              button
              onClick={() =>
                handleItemClick(
                  false,
                  user ? handleLogout : () => setModalOpen(true)
                )
              }
            >
              <ListItemText
                primary={user ? t("navbar.logout") : t("navbar.login")}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <AuthModal open={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Navbar;
