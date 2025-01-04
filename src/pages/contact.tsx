import React from "react";
import { Container, Typography, Box } from "@mui/material";

const Contact: React.FC = () => {
  return (
    <Container id="contact">
      <Box mt={5} textAlign="center">
        <Typography variant="h3" gutterBottom>
          Contact Me
        </Typography>
        <Typography variant="h5" gutterBottom>
          Feel free to reach out to me through any of the platforms below.
        </Typography>
        {/* Adicione aqui suas informações de contato */}
      </Box>
    </Container>
  );
};

export default Contact;
