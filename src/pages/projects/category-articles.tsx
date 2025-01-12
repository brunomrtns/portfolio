import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { AuthContext } from "../../context/auth-context";
import { API_BASE_URL } from "../../config";

interface Article {
  id: number;
  title: string;
  summary: string;
  coverImage: string;
  language: string;
}

interface CategoryArticlesProps {
  categoryId: string;
  setCurrentPage: (page: string) => void;
  setSelectedProjectId: (projectId: string) => void;
}

const CategoryArticles: React.FC<CategoryArticlesProps> = ({
  categoryId,
  setCurrentPage,
  setSelectedProjectId,
}) => {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const { token } = useSelector((state: RootState) => state.auth);
  const { user } = useContext(AuthContext);

  const [openDialog, setOpenDialog] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  const getLanguage = () => (i18n.language === "pt" ? "pt_BR" : "en");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/categories/${categoryId}/articles/${getLanguage()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setArticles(response.data);
      } catch (err) {
        console.error("Error fetching articles:", err);
      }
    };

    fetchArticles();
  }, [categoryId, token, i18n.language]);

  const handleArticleClick = (articleId: string) => {
    setSelectedProjectId(articleId);
    setCurrentPage("project");
  };

  const handleEditClick = (articleId: string) => {
    setSelectedProjectId(articleId);
    setCurrentPage("edit-project");
  };

  const handleDeleteClick = (articleId: string) => {
    setArticleToDelete(articleId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (articleToDelete) {
      axios
        .post(
          `${API_BASE_URL}/articles/delete`,
          { id: articleToDelete },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          setArticles(
            articles.filter(
              (article) => article.id.toString() !== articleToDelete
            )
          );
          setOpenDialog(false);
          setArticleToDelete(null);
        })
        .catch((err) => {
          console.error("Error deleting article:", err);
          setOpenDialog(false);
          setArticleToDelete(null);
        });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setArticleToDelete(null);
  };

  return (
    <Container id="category-articles">
      <Box mt={5} textAlign="center">
        <Typography variant="h3" color="text.primary" gutterBottom>
          {t("category_articles")}
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {articles.length === 0 ? (
            <Typography variant="h5" color="text.secondary">
              {t("no_articles_found")}
            </Typography>
          ) : (
            articles.map((article) => (
              <Grid item key={article.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{ maxWidth: 345, cursor: "pointer" }}
                  onClick={() => handleArticleClick(article.id.toString())}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={article.coverImage}
                    alt={article.title}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      color="text.primary"
                    >
                      {article.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {article.summary}
                    </Typography>
                  </CardContent>
                  {user?.type === "attendant" && (
                    <Box display="flex" justifyContent="space-between" p={2}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(article.id.toString());
                        }}
                      >
                        {t("edit")}
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(article.id.toString());
                        }}
                      >
                        {t("delete")}
                      </Button>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t("confirm_delete")}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("confirm_delete_message")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            {t("cancel")}
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
            {t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CategoryArticles;
