import React, { ReactNode } from "react";
import { ThemeProvider } from "./theme/theme-context";

interface GlobalStylesProps {
  children: ReactNode;
}

const GlobalStyles: React.FC<GlobalStylesProps> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

export default GlobalStyles;
