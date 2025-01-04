import { css } from "@emotion/react";
import { Theme } from "@mui/material/styles";

export const containerBoxStyle = (theme: Theme) => css`
  margin-top: ${theme.spacing(5)};
  text-align: center;
`;

export const cardContentStyle = css`
  img {
    max-width: 100%;
    height: auto;
  }
`;

export const backButtonStyle = (theme: Theme) => css`
  margin-top: ${theme.spacing(3)};
`;

export const iframeContainerStyle = css`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  iframe {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;

export const fullscreenIconStyle = css`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;
