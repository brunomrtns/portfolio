import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Project {
  title: string;
  description: string;
  image: string;
}

interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
}

const initialState: ProjectsState = {
  projects: [
    {
      title: "Workflow",
      description:
        "Venha conhecer um jogo com processo de desenvolvimento com ambiente automatizado...",
      image: "/springo-lingo-image.png",
    },
    {
      title: "Project 2",
      description: "Description for Project 2",
      image: "https://via.placeholder.com/150",
    },
    {
      title: "Project 3",
      description: "Description for Project 3",
      image: "https://via.placeholder.com/150",
    },
  ],
  selectedProject: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    selectProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
  },
});

export const { selectProject } = projectsSlice.actions;
export default projectsSlice.reducer;
