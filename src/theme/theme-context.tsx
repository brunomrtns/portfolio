import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";

import {
	ThemeProvider as MuiThemeProvider,
	createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

interface ThemeContextProps {
	toggleTheme: () => void;
	themeMode: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useThemeContext = (): ThemeContextProps => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useThemeContext must be used within a ThemeProvider");
	}
	return context;
};

const lightTheme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#1976d2",
		},
		secondary: {
			main: "#dc004e",
		},
		background: {
			default: "#f4f4f4", // Fundo claro
			paper: "#ffffff", // Papel branco
		},
		text: {
			primary: "#000000", // Texto preto
			secondary: "#555555", // Texto cinza escuro
		},
	},
	typography: {
		h3: {
			fontFamily: "Roboto",
			fontWeight: "bold",
			color: "#000000", // Texto preto
		},
		h5: {
			fontFamily: "Roboto",
			color: "#000000", // Texto preto
		},
	},
});

const darkTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#1976d2",
		},
		secondary: {
			main: "#dc004e",
		},
		background: {
			default: "#1A1A2E",
			paper: "#16213E",
		},
		text: {
			primary: "#E94560",
			secondary: "#FFF",
		},
	},
	typography: {
		h3: {
			fontFamily: "Roboto",
			fontWeight: "bold",
		},
		h5: {
			fontFamily: "Roboto",
		},
	},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		setThemeMode(mediaQuery.matches ? "dark" : "light");
		const handleChange = (event: MediaQueryListEvent) => {
			setThemeMode(event.matches ? "dark" : "light");
		};
		mediaQuery.addEventListener("change", handleChange);
		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, []);

	const toggleTheme = () => {
		setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
	};

	const theme = themeMode === "light" ? lightTheme : darkTheme;

	return (
		<ThemeContext.Provider value={{ toggleTheme, themeMode }}>
			<MuiThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</MuiThemeProvider>
		</ThemeContext.Provider>
	);
};
