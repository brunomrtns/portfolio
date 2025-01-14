import { css } from "@emotion/react";
import { Theme } from "@mui/material/styles";

export const toolbarStyle = (theme: Theme) => css`
  display: flex;
  justify-content: space-between;
`;

export const menuButtonStyle = (theme: Theme) => css`
  margin-right: ${theme.spacing(2)};
`;

export const titleStyle = css`
  flex-grow: 1;
`;

export const navButtonsStyle = (theme: Theme) => css`
  display: flex;
  gap: ${theme.spacing(2)};
  @media (max-width: ${theme.breakpoints.values.md}px) {
    display: none;
  }
`;

export const languageMenuStyle = (theme: Theme) => css`
  display: flex;
  gap: ${theme.spacing(1)};
`;

export const customHandleStyle = (theme: Theme) => css`
  width: 10px;
  height: 10px;
  background: ${theme.palette.primary.main};
  position: absolute;
  right: 0;
  bottom: 0;
  cursor: se-resize;
`;

export const appBarStyle = (themeMode: string, theme: Theme) => css`
  background-color: ${themeMode === "light" ? "#ffffff" : "#121212"};
  color: ${themeMode === "light" ? "#000000" : theme.palette.text.primary};
  box-shadow: ${themeMode === "light"
    ? "0px 2px 4px rgba(0, 0, 0, 0.1)"
    : "0px 2px 4px rgba(0, 0, 0, 0.6)"};
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
`;
export const drawerStyle = (theme: Theme, mode: "light" | "dark") => css`
  background-color: ${mode === "light" ? "#f9f9f9" : "#1f2933"};
  color: ${mode === "light" ? "#333" : "#fff"};
  height: 100%;
  box-shadow: ${mode === "light"
    ? "0 4px 6px rgba(0, 0, 0, 0.1)"
    : "0 4px 6px rgba(0, 0, 0, 0.5)"};
`;

export const listItemStyle = css`
  padding: 12px 16px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;
