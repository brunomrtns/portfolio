import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container id="home">
      <Box mt={5} textAlign="center">
        <Typography variant="h3" color="text.primary" gutterBottom>
          {t("hello")}
        </Typography>
        <Typography variant="h4" color="text.primary" gutterBottom>
          {t("developer")}
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          {t("description")}
        </Typography>
        {/* <Button variant="contained" color="secondary" size="large">
          {t('create_journey')}
        </Button> */}
      </Box>
    </Container>
  );
};

export default Home;
