import { CssBaseline } from "@mui/material";
import Layout from "./components/Layout";
// import Router from "./routes";
import { Route, Routes } from "react-router-dom";
import ProjectList from "./pages/project/ProjectList";
import ProjectDetail from "./pages/project/ProjectDetail";
import ProjectProvider from "./context/ProjectProvider";

function App() {
  return (
    <>
      <ProjectProvider>
        <CssBaseline />
        <Layout>
          <Routes>
            <Route path="/" element={<ProjectList />} />
            <Route path="/project/add" element={<ProjectDetail />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
          </Routes>
        </Layout>
      </ProjectProvider>
    </>
  );
}

export default App;
