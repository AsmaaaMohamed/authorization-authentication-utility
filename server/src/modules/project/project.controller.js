import {
  getProjectsByWorkspace,
} from "./project.service.js";

const getWorkspaceProjects = async (req, res, next) => {
  try {
    const { id } = req.params;

    const projects = await getProjectsByWorkspace(id);

    return res.status(200).json({
      status: "success",
      data: projects,
    });

  } catch (error) {
    next(error);
  }
};

export {
  getWorkspaceProjects,
};