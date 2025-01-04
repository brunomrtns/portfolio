/** @jsxImportSource @emotion/react */
import React, { useState, useContext, useEffect } from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	IconButton,
	Menu,
	MenuItem,
	Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import {
	appBarStyle,
	toolbarStyle,
	menuButtonStyle,
	titleStyle,
	navButtonsStyle,
	languageMenuStyle,
} from "./styles";
import { FaFlagUsa } from "react-icons/fa";
import { GiBrazilFlag } from "react-icons/gi";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useThemeContext } from "../theme/theme-context";
import { AuthContext } from "../context/auth-context";
import AuthModal from "./auth-modal";
import axios from "axios";
import { API_BASE_URL } from '../config';

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
	const { i18n } = useTranslation();
	const { toggleTheme, themeMode } = useThemeContext();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const { user, setUser, setToken, setChatId } = useContext(AuthContext);
	const [isModalOpen, setModalOpen] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);

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

	const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const changeLanguage = (language: string) => {
		i18n.changeLanguage(language);
		handleMenuClose();
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

	return (
		<>
			<AppBar position="static" css={appBarStyle(theme)}>
				<Toolbar css={toolbarStyle(theme)}>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="menu"
						onClick={handleMenuOpen}
						css={menuButtonStyle(theme)}>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" css={titleStyle}>
						Bruno Martins
					</Typography>
					<Box css={navButtonsStyle(theme)}>
						<Button color="inherit" onClick={() => setCurrentPage("home")}>
							Home
						</Button>
						<Button color="inherit" onClick={() => setCurrentPage("services")}>
							Services
						</Button>
						<Button color="inherit" onClick={() => setCurrentPage("about")}>
							About
						</Button>
						<Button color="inherit" onClick={() => setCurrentPage("skills")}>
							Skills
						</Button>
						<Button color="inherit" onClick={() => setCurrentPage("portfolio")}>
							Portfolio
						</Button>
						<Button color="inherit" onClick={() => setCurrentPage("contact")}>
							Contact
						</Button>
						<Button
							color="inherit"
							aria-controls="categories-menu"
							aria-haspopup="true"
							onClick={handleMenuOpen}>
							Categories
						</Button>
						<Menu
							id="categories-menu"
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}>
							{categories.map((category) => (
								<MenuItem
									key={category.id}
									onClick={() => {
										setSelectedCategory(category.id.toString());
										setCurrentPage("category-articles");
										handleMenuClose();
									}}>
									{category.title}
								</MenuItem>
							))}
						</Menu>
						{user?.type === "attendant" && (
							<>
								<Button
									color="inherit"
									onClick={() => setCurrentPage("attendant-chats")}>
									Chats
								</Button>
								<Button
									color="inherit"
									onClick={() => setCurrentPage("add-project")}>
									Acrescentar Projeto
								</Button>
							</>
						)}
						<Box css={languageMenuStyle(theme)}>
							<IconButton color="inherit" onClick={() => changeLanguage("en")}>
								<FaFlagUsa />
							</IconButton>
							<IconButton color="inherit" onClick={() => changeLanguage("pt")}>
								<GiBrazilFlag />
							</IconButton>
						</Box>
						<IconButton
							color="inherit"
							onClick={toggleTheme}
							style={iconButtonStyle}>
							{themeMode === "light" ? <MdLightMode /> : <MdDarkMode />}
						</IconButton>
						{user ? (
							<Button color="inherit" onClick={handleLogout}>
								Logout
							</Button>
						) : (
							<Button color="inherit" onClick={() => setModalOpen(true)}>
								Login
							</Button>
						)}
					</Box>
				</Toolbar>
			</AppBar>
			<AuthModal open={isModalOpen} onClose={() => setModalOpen(false)} />
		</>
	);
};

export default Navbar;
