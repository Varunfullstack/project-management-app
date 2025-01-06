import { useNavigate } from "react-router-dom";
import { Button, Typography, Box, Stack, IconButton } from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Star,
  StarBorder,
} from "@mui/icons-material";
import DataTable from "../../components/Table";
import { useProject } from "../../context/ProjectContext";

const ProjectList = () => {
  const navigate = useNavigate();
  const {
    projects,
    deleteProject,
    favoriteProjects,
    toggleFavorite,
    page,
    itemsPerPage,
    totalProject,
  } = useProject();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(id);
    }
  };

  const columns = [
    {
      id: "id",
      label: "Sr.No.",
      render: (row, index) => (page - 1) * itemsPerPage + index + 1,
    },
    { id: "name", label: "Name" },
    { id: "startDate", label: "Start Date" },
    { id: "endDate", label: "End Date" },
    { id: "projectManager", label: "Project Manager" },
    {
      id: "favorite",
      label: "Favorite",
      align: "center",
      render: (row) => (
        <IconButton onClick={() => toggleFavorite(row.id)}>
          {favoriteProjects.some((p) => p.id === row.id) ? (
            <Star color="primary" />
          ) : (
            <StarBorder />
          )}
        </IconButton>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      align: "center",
      render: (row) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`/project/${row.id}`)}
          >
            Edit
          </Button>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleDelete(row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5">Project List</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/project/add")}
        >
          Add Project
        </Button>
      </Stack>

      <DataTable
        columns={columns}
        data={projects}
        page={page}
        itemsPerPage={itemsPerPage}
        totalCount={totalProject?.length}
      />
    </Box>
  );
};

export default ProjectList;
