import React, { useRef, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  CardContent,
  CircularProgress,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  IframeContainer,
  Iframe,
  FullscreenIcon,
} from "../../components/full-screen";
import { API_BASE_URL } from '../../config';

interface ProjectProps {
  projectId: string;
  onBack: () => void;
}

interface ProjectData {
  id: number;
  title: string;
  body: string;
  coverImage: string;
  language: string;
  relatedArticleId: number | null;
}

const Project: React.FC<ProjectProps> = ({ projectId, onBack }) => {
  const { t, i18n } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [relatedProjectIds, setRelatedProjectIds] = useState<{
    pt_BR: number | null;
    en: number | null;
  }>({ pt_BR: null, en: null });

  const fetchProject = async (id: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/articles/${id}`);
      setProject(response.data);
      setError(null); // Limpar erro ao carregar novo projeto
    } catch (error) {
      console.error("Error fetching project data:", error);
      setError(t("failed_to_load_project"));
    }
  };

  const fetchRelatedProjectIds = async (id: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/articles/${id}/related`,
      );
      const relatedArticleId = response.data.relatedArticleId;

      const relatedProjectResponse = await axios.get(
        `${API_BASE_URL}/articles/${relatedArticleId}`,
      );
      const relatedProjectData = relatedProjectResponse.data;

      setRelatedProjectIds({
        pt_BR:
          relatedProjectData.language === "pt_BR"
            ? relatedProjectData.id
            : null,
        en: relatedProjectData.language === "en" ? relatedProjectData.id : null,
      });
    } catch (error) {
      console.error("Error fetching related project IDs:", error);
    }
  };

  useEffect(() => {
    fetchProject(projectId);
  }, [projectId]);

  useEffect(() => {
    if (project) {
      fetchRelatedProjectIds(project.id.toString());
    }
  }, [project]);

  useEffect(() => {
    if (project && relatedProjectIds) {
      const currentLanguage = i18n.language === "pt" ? "pt_BR" : "en";
      if (project.language !== currentLanguage) {
        const relatedProjectId =
          currentLanguage === "pt_BR"
            ? relatedProjectIds.pt_BR
            : relatedProjectIds.en;
        if (relatedProjectId) {
          fetchProject(relatedProjectId.toString());
        } else {
          setError(t("project_not_available"));
        }
      } else {
        setError(null);
      }
    }
  }, [i18n.language, project, relatedProjectIds]);

  const handleFullScreen = () => {
    const iframe = iframeRef.current;
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if ((iframe as any).mozRequestFullScreen) {
        (iframe as any).mozRequestFullScreen();
      } else if ((iframe as any).webkitRequestFullscreen) {
        (iframe as any).webkitRequestFullscreen();
      } else if ((iframe as any).msRequestFullscreen) {
        (iframe as any).msRequestFullscreen();
      }
    }
  };

  if (error) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
        <Button onClick={onBack} variant="contained" color="primary">
          {t("back_to_projects")}
        </Button>
      </Container>
    );
  }

  if (!project) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container id="project">
      <Box mt={5} textAlign="center">
        <Typography variant="h3" color="text.primary" gutterBottom>
          {project.title}
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography
                variant="body1"
                color="text.secondary"
                component="div"
                dangerouslySetInnerHTML={{ __html: project.body }}
              />
              {(project.title === "Workflow" ||
                project.title === "Fluxo de trabalho") && (
                <IframeContainer>
                  <Iframe
                    ref={iframeRef}
                    src="/springo-lingo/index.html"
                    title="Springo Lingo Game"
                  />
                  <FullscreenIcon
                    className="fullscreen-icon"
                    onClick={handleFullScreen}
                  />
                </IframeContainer>
              )}
            </CardContent>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Button variant="contained" color="primary" onClick={onBack}>
            {t("back_to_projects")}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Project;
