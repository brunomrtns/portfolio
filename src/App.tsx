import React, { useState, useContext, useEffect } from "react";
import Navbar from "./components/navbar";
import Chat from "./components/chat";
import AttendantChats from "./components/attendant-chats";
import Notification from "./components/notification";
import Home from "./pages/home";
import Projects from "./pages/projects/projects";
import Project from "./pages/projects/project";
import AddProject from "./pages/projects/add-project";
import EditProject from "./pages/projects/edit-project";
import CategoryArticles from "./pages/projects/category-articles";
import GlobalStyles from "./global-styles";
import "react-quill/dist/quill.snow.css";
import { AuthProvider, AuthContext } from "./context/auth-context";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux";
import { setToken, setUser } from "./redux/slices/auth-slice";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      dispatch(setToken(token));
      dispatch(setUser(JSON.parse(user)));
    }
  }, [dispatch]);

  return (
    <AuthProvider>
      <GlobalStyles>
        <Navbar
          setCurrentPage={setCurrentPage}
          setSelectedCategory={setSelectedCategoryId}
        />
        {currentPage === "home" && (
          <HomeWithProjects
            setCurrentPage={setCurrentPage}
            setSelectedProjectId={setSelectedProjectId}
          />
        )}
        {currentPage === "attendant-chats" && <AttendantChats />}
        {currentPage === "project" && selectedProjectId && (
          <Project
            projectId={selectedProjectId}
            onBack={() => setCurrentPage("home")}
          />
        )}
        {currentPage === "edit-project" &&
          selectedProjectId &&
          user?.type === "attendant" && (
            <EditProject
              projectId={selectedProjectId}
              onBack={() => setCurrentPage("home")}
            />
          )}
        {currentPage === "add-project" && <AddProject />}
        {currentPage === "category-articles" && selectedCategoryId && (
          <CategoryArticles
            categoryId={selectedCategoryId}
            setCurrentPage={setCurrentPage}
            setSelectedProjectId={setSelectedProjectId}
          />
        )}
        <ConditionalChat />
        <Notification />
      </GlobalStyles>
    </AuthProvider>
  );
};

const HomeWithProjects: React.FC<{
  setCurrentPage: (page: string) => void;
  setSelectedProjectId: (projectId: string) => void;
}> = ({ setCurrentPage, setSelectedProjectId }) => (
  <>
    <Home />
    <Projects
      setCurrentPage={setCurrentPage}
      setSelectedProjectId={setSelectedProjectId}
    />
  </>
);

const ConditionalChat: React.FC = () => {
  const { user } = useContext(AuthContext);

  if (user?.type === "attendant") {
    return null;
  }

  return <Chat />;
};

export default App;
