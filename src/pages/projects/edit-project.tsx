import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { useTranslation } from "react-i18next";
import FroalaEditorComponent from "../../components/froala-editor-content";
import { API_BASE_URL } from "../../config";

interface Category {
  id: number;
  title: string;
}

const EditProject: React.FC<{ projectId: string; onBack: () => void }> = ({
  projectId,
  onBack,
}) => {
  const { t } = useTranslation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [coverImage, setCoverImage] = useState<string | File | null>(null);
  const [body, setBody] = useState<string>("");

  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.error("Token is null");
        return;
      }

      try {
        const categoriesResponse = await axios.get(
          `${API_BASE_URL}/admin/categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategories(categoriesResponse.data);

        const articleResponse = await axios.get(
          `${API_BASE_URL}/articles/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { title, body, summary, categories, coverImage } =
          articleResponse.data;
        setTitle(title);
        setBody(body);
        setSummary(summary);
        setSelectedCategories(categories.map((cat: Category) => cat.id));
        setCoverImage(coverImage);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [token, projectId]);

  const handleCategoryChange = (event: SelectChangeEvent<number[]>) => {
    setSelectedCategories(event.target.value as number[]);
  };

  const handleNewCategoryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewCategory(event.target.value);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSummaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSummary(event.target.value);
  };

  const handleCoverImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setCoverImage(event.target.files[0]);
    }
  };

  const handleEditorChange = (content: string) => {
    setBody(content);
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() === "") return;
    try {
      const categoryResponse = await axios.post(
        `${API_BASE_URL}/categories/save`,
        { title: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newCategoryData = categoryResponse.data;
      setCategories([...categories, newCategoryData]);
      setSelectedCategories([...selectedCategories, newCategoryData.id]);
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id", projectId);
      formData.append("title", title);
      formData.append("body", body);
      formData.append("summary", summary);
      selectedCategories.forEach((categoryId) => {
        formData.append("categories", categoryId.toString());
      });
      if (coverImage instanceof File) {
        formData.append("coverImage", coverImage);
      } else {
        formData.append("coverImage", coverImage as string);
      }

      await axios.post(`${API_BASE_URL}/articles/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onBack();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };
  console.log("renderizando pagina de edicao");
  return (
    <Container>
      <Box mt={5} textAlign="center">
        <Typography variant="h3" color="text.primary" gutterBottom>
          {t("edit_project")}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={3}>
            <FormControl fullWidth>
              <InputLabel id="category-label">{t("category")}</InputLabel>
              <Select
                labelId="category-label"
                multiple
                value={selectedCategories}
                onChange={handleCategoryChange}
                renderValue={(selected) =>
                  (selected as number[])
                    .map((id) => categories.find((cat) => cat.id === id)?.title)
                    .join(", ")
                }
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box mb={3} display="flex" alignItems="center">
            <TextField
              fullWidth
              label={t("new_category")}
              value={newCategory}
              onChange={handleNewCategoryChange}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCategory}
              style={{ marginLeft: "8px" }}
            >
              {t("add_category")}
            </Button>
          </Box>
          <Box mb={3}>
            <TextField
              fullWidth
              label={t("article_title")}
              value={title}
              onChange={handleTitleChange}
            />
          </Box>
          <Box mb={3}>
            <TextField
              fullWidth
              label={t("summary")}
              value={summary}
              onChange={handleSummaryChange}
            />
          </Box>
          <Box mb={3}>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
            />
          </Box>
          <Box mb={3}>
            {typeof coverImage === "string" && (
              <img src={coverImage} alt="Cover" style={{ maxWidth: "100%" }} />
            )}
          </Box>
          <Box mb={3}>
            <FroalaEditorComponent
              model={body}
              onModelChange={handleEditorChange}
            />
          </Box>
          <Button type="submit" variant="contained" color="primary">
            {t("save_project")}
          </Button>
        </form>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onBack}
          sx={{ mt: 2 }}
        >
          {t("back")}
        </Button>
      </Box>
    </Container>
  );
};

export default EditProject;
