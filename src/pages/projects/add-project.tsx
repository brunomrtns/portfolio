import React, { useState, useEffect, useContext } from "react";
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
	Stepper,
	Step,
	StepLabel,
	SelectChangeEvent,
} from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";
import FroalaEditorComponent from "../../components/froala-editor-content";
import { AuthContext } from "../../context/auth-context";
import { API_BASE_URL } from '../../config';

interface Category {
	id: number;
	title: string;
}

const AddProject: React.FC = () => {
	const { t, i18n } = useTranslation();
	const { token } = useContext(AuthContext);

	const [categories, setCategories] = useState<Category[]>([]);
	const [newCategory, setNewCategory] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
	const [title, setTitle] = useState("");
	const [summary, setSummary] = useState("");
	const [coverImage, setCoverImage] = useState<File | null>(null);
	const [body, setBody] = useState("");
	const [activeStep, setActiveStep] = useState(0);
	const [relatedArticleId, setRelatedArticleId] = useState<number | null>(null);

	const steps = [t("current_language"), t("next_language")];

	useEffect(() => {
		console.log("Token being used in GET request:", token);
		axios
			.get(`${API_BASE_URL}/admin/categories`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((response) => {
				setCategories(response.data);
			})
			.catch((err) => {
				console.error("Error fetching categories:", err);
			});
	}, [token]);

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

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
			formData.append("title", title);
			formData.append("body", body);
			formData.append("summary", summary);
			formData.append("categories", selectedCategories.join(","));
			formData.append(
				"language",
				activeStep === 0 ? getLanguage() : getNextLanguage()
			);

			if (relatedArticleId && relatedArticleId.toString() !== "") {
				formData.append("relatedArticleId", relatedArticleId.toString());
			}

			if (coverImage) {
				formData.append("coverImage", coverImage);
			}

			const response = await axios.post(
				`${API_BASE_URL}/articles/save`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			const newArticleId = response.data.id;
			if (activeStep === 0) {
				setRelatedArticleId(newArticleId);
				handleNext();
			} else {
				console.log("success");
			}
		} catch (error) {
			console.error("Error saving project:", error);
		}
	};

	const getLanguage = () => (i18n.language === "pt" ? "pt_BR" : "en");

	const getNextLanguage = () => (i18n.language === "pt" ? "en" : "pt_BR");

	return (
		<Container>
			<Box mt={5} textAlign="center">
				<Typography variant="h3" color="text.primary" gutterBottom>
					{t("add_project")}
				</Typography>
				<Stepper activeStep={activeStep}>
					{steps.map((label, index) => (
						<Step key={index}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
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
								}>
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
							style={{ marginLeft: "8px" }}>
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
						<FroalaEditorComponent
							model={body}
							onModelChange={handleEditorChange}
						/>
					</Box>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={activeStep === 1 && !relatedArticleId}>
						{activeStep === 0 ? t("next") : t("save_project")}
					</Button>
					{activeStep === 1 && (
						<Button variant="contained" color="secondary" onClick={handleBack}>
							{t("back")}
						</Button>
					)}
				</form>
			</Box>
		</Container>
	);
};

export default AddProject;
