import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ProjectContext } from "./ProjectContext";

const API_URL = "http://localhost:3001";

const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [favoriteProjects, setFavoriteProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalProject, setTotalProject] = useState(0);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;

      const allProjects = await fetch(`${API_URL}/projects`).then((res) =>
        res.json()
      );
      setTotalProject(allProjects);

      const paginatedProjects = allProjects.slice(start, end);
      setProjects(paginatedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePagination = (newPage, newItemsPerPage) => {
    setPage(newPage);
    setItemsPerPage(newItemsPerPage);
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
  }, [page, itemsPerPage]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const generateRandomId = (existingIds) => {
    let randomId;
    do {
      randomId = Math.floor(Math.random() * 1000000);
    } while (existingIds.includes(randomId));
    return randomId;
  };

  const addProject = async (newProject) => {
    try {
      const existingIds = projects.map((project) => project.id);
      const randomId = generateRandomId(existingIds);
      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newProject,
          id: `${randomId}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add project");
      }

      const data = await response.json();

      // Update local state immediately
      setProjects((prev) => [...prev, data]);
      setTotalProject((prev) => prev + 1);

      // Refetch projects to ensure pagination is correct
      fetchProjects();
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

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      const data = await response.json();

      // Update local state
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

      // Refetch projects to ensure pagination is correct
      fetchProjects();

      return data;
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      // Update local state immediately
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
      setTotalProject((prev) => prev - 1);

      // Also remove from favorites if exists
      const favorite = favoriteProjects.find((f) => f.id === projectId);
      if (favorite) {
        await fetch(`${API_URL}/favorites/${projectId}`, {
          method: "DELETE",
        });
        setFavoriteProjects((prev) => prev.filter((p) => p.id !== projectId));
      }

      // Refetch projects to ensure pagination is correct
      fetchProjects();
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
        updatePagination,
        page,
        itemsPerPage,
        totalProject,
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
