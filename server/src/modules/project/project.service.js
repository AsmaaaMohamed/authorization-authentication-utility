import Project from "./project.model";


const getProjectsByWorkspace = async (workspaceId) => {
  const projects = await Project.find({
    workspaceId,
  });

  return projects;
};

export {
  getProjectsByWorkspace,
};