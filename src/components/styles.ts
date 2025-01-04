import { css } from "@emotion/react";
import { Theme } from "@mui/material/styles";

export const appBarStyle = (theme: Theme) => css`
  background-color: #16213e;
`;

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
