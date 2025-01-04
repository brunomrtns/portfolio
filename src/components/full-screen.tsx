import React from "react";

import { MdFullscreen } from "react-icons/md";

import { Box } from "@mui/material";

import styled from "@emotion/styled";

export const IframeContainer = styled(Box)`
  position: relative;
  width: 100%;
  height: 600px;
  &:hover .fullscreen-icon {
    opacity: 1;
  }
`;

export const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

export const FullscreenIcon = styled(MdFullscreen)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s;
`;
