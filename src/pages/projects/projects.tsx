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
import { API_BASE_URL } from '../../config';

interface Project {
	id: number;
	title: string;
	summary: string;
	coverImage: string;
	language: string;
}

interface ProjectsProps {
	setCurrentPage: (page: string) => void;
	setSelectedProjectId: (projectId: string) => void;
}

const Projects: React.FC<ProjectsProps> = ({
	setCurrentPage,
	setSelectedProjectId,
}) => {
	const { t, i18n } = useTranslation();
	const [projects, setProjects] = useState<Project[]>([]);
	const { token } = useSelector((state: RootState) => state.auth);
	const { user } = useContext(AuthContext);

	const [openDialog, setOpenDialog] = useState(false);
	const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await axios.get(
					`${API_BASE_URL}/admin/articles`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				const projectsData = response.data;

				const filteredProjects = projectsData.filter((project: Project) => {
					const currentLanguage =
						i18n.language === "pt" ? "pt_BR" : i18n.language;
					return project.language === currentLanguage;
				});
				setProjects(filteredProjects);
			} catch (err) {
				console.error("Error fetching projects:", err);
			}
		};

		fetchProjects();
	}, [token, i18n.language]);

	const handleProjectClick = (projectId: string) => {
		setSelectedProjectId(projectId);
		setCurrentPage("project");
	};

	const handleEditClick = (projectId: string) => {
		setSelectedProjectId(projectId);
		setCurrentPage("edit-project");
	};

	const handleDeleteClick = (projectId: string) => {
		setProjectToDelete(projectId);
		setOpenDialog(true);
	};

	const handleConfirmDelete = () => {
		if (projectToDelete) {
			axios
				.post(
					`${API_BASE_URL}/articles/delete`,
					{ id: projectToDelete },
					{ headers: { Authorization: `Bearer ${token}` } }
				)
				.then(() => {
					setProjects(
						projects.filter(
							(project) => project.id.toString() !== projectToDelete
						)
					);
					setOpenDialog(false);
					setProjectToDelete(null);
				})
				.catch((err) => {
					console.error("Error deleting project:", err);
					setOpenDialog(false);
					setProjectToDelete(null);
				});
		}
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setProjectToDelete(null);
	};

	return (
		<Container id="projects">
			<Box mt={5} textAlign="center">
				<Typography variant="h3" color="text.primary" gutterBottom>
					{t("skill_set")}
				</Typography>
				<Grid container spacing={2} justifyContent="center">
					{projects.length === 0 ? (
						<Typography variant="h5" color="text.secondary">
							{t("no_projects_found")}
						</Typography>
					) : (
						projects.map((project) => (
							<Grid item key={project.id} xs={12} sm={6} md={4}>
								<Card
									sx={{ maxWidth: 345, cursor: "pointer" }}
									onClick={() => handleProjectClick(project.id.toString())} // Mova o onClick para o Card
								>
									<CardMedia
										component="img"
										height="140"
										image={project.coverImage}
										alt={project.title}
									/>
									<CardContent>
										<Typography
											gutterBottom
											variant="h5"
											component="div"
											color="text.primary">
											{project.title}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{project.summary}
										</Typography>
									</CardContent>
									{user?.type === "attendant" && (
										<Box display="flex" justifyContent="space-between" p={2}>
											<Button
												variant="outlined"
												color="primary"
												onClick={(e) => {
													e.stopPropagation(); // Prevenir que o clique no botão propague para o Card
													handleEditClick(project.id.toString());
												}}>
												{t("edit")}
											</Button>
											<Button
												variant="outlined"
												color="secondary"
												onClick={(e) => {
													e.stopPropagation(); // Prevenir que o clique no botão propague para o Card
													handleDeleteClick(project.id.toString());
												}}>
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
				aria-describedby="alert-dialog-description">
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

export default Projects;
