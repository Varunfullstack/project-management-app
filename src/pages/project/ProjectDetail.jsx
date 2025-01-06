import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  Snackbar,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useProject } from "../../context/ProjectContext";

const INITIAL_FORM_STATE = {
  id: "",
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  projectManager: "",
};

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { projects, updateProject, addProject } = useProject();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isNewProject = id === undefined;

  useEffect(() => {
    if (!isNewProject) {
      const project = projects.find((p) => p.id === id);
      if (project) {
        setFormData(project);
      }
    }
  }, [id, projects, isNewProject]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNewProject) {
        await addProject(formData);
      } else {
        await updateProject(id, formData);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 500);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError(
        `Failed to ${
          isNewProject ? "create" : "update"
        } project. Please try again.`
      );
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "1200px", mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {isNewProject ? "Add New Project" : "Edit Project"}
      </Typography>
      <Paper sx={{ p: { xs: 2, sm: 4 }, mx: "auto" }}>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          {!isNewProject && (
            <TextField
              fullWidth
              label="Project ID"
              value={formData.id}
              disabled
            />
          )}
          <TextField
            fullWidth
            label="Project Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
          />
          <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
            <TextField
              fullWidth
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              sx={{ minWidth: isMobile ? "100%" : "200px" }}
            />
            <TextField
              fullWidth
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              sx={{ minWidth: isMobile ? "100%" : "200px" }}
            />
          </Stack>
          <TextField
            fullWidth
            label="Project Manager"
            name="projectManager"
            value={formData.projectManager}
            onChange={handleChange}
            required
          />
          <Stack direction={"row"} justifyContent="space-between" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              fullWidth={isMobile}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth={isMobile}
            >
              {isNewProject ? "Create" : "Update"}
            </Button>
          </Stack>
        </Stack>
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
        >
          <Alert severity="success">
            Project {isNewProject ? "created" : "updated"} successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default ProjectDetail;
