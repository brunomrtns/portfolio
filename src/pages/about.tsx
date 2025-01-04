import React from "react";
import { Container, Typography, Box } from "@mui/material";

const About: React.FC = () => {
  return (
    <Container id="about">
      <Box mt={5} textAlign="center">
        <Typography variant="h3" gutterBottom>
          About Me
        </Typography>
        <Typography variant="h5" gutterBottom>
          I'm a passionate web developer with experience in creating responsive
          and visually appealing websites.
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
