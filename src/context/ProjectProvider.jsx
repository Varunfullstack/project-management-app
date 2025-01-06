import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ProjectContext } from "./ProjectContext";

const API_URL = "http://localhost:3001";

const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [favoriteProjects, setFavoriteProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/projects`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorites
  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${API_URL}/favorites`);
      const data = await response.json();
      setFavoriteProjects(data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchFavorites();
  }, []);

  const addProject = async (newProject) => {
    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newProject,
          id: String(projects.length + 1).padStart(2, "0"),
        }),
      });
      const data = await response.json();
      setProjects([...projects, data]);
      return data;
    } catch (error) {
      console.error("Error adding project:", error);
      throw error;
    }
  };

  const updateProject = async (projectId, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      setProjects((prev) =>
        prev.map((project) => (project.id === projectId ? data : project))
      );

      // Update favorite if exists
      const favorite = favoriteProjects.find((f) => f.id === projectId);
      if (favorite) {
        const updatedFavorite = {
          ...favorite,
          name: updatedData.name,
        };
        const favoriteResponse = await fetch(
          `${API_URL}/favorites/${projectId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedFavorite),
          }
        );
        const favoriteData = await favoriteResponse.json();
        setFavoriteProjects((prev) =>
          prev.map((fav) => (fav.id === projectId ? favoriteData : fav))
        );
      }

      return data;
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await fetch(`${API_URL}/projects/${projectId}`, {
        method: "DELETE",
      });
      setProjects((prev) => prev.filter((project) => project.id !== projectId));

      // Also remove from favorites if exists
      const favorite = favoriteProjects.find((f) => f.id === projectId);
      if (favorite) {
        await fetch(`${API_URL}/favorites/${projectId}`, {
          method: "DELETE",
        });
        setFavoriteProjects((prev) => prev.filter((p) => p.id !== projectId));
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  };

  const toggleFavorite = async (projectId) => {
    try {
      const project = projects.find((p) => p.id === projectId);
      if (!project) return;

      const isFavorite = favoriteProjects.some((p) => p.id === projectId);

      if (isFavorite) {
        await fetch(`${API_URL}/favorites/${projectId}`, {
          method: "DELETE",
        });
        setFavoriteProjects((prev) => prev.filter((p) => p.id !== projectId));
      } else {
        const response = await fetch(`${API_URL}/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: project.id,
            name: project.name,
          }),
        });
        const data = await response.json();
        setFavoriteProjects((prev) => [...prev, data]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        favoriteProjects,
        loading,
        addProject,
        updateProject,
        deleteProject,
        toggleFavorite,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

ProjectProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProjectProvider;
