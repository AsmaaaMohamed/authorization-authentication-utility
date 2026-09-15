import Project from './project.model.js';
import WorkspaceMember from '../workspaceMember/workspaceMember.model.js';
import Board from '../board/board.model.js';
import AppError from '../../utilities/AppError.js';

const assertWorkspaceAccess = async (
  workspaceId,
  userId,
  writeAccess = false,
) => {
  const member = await WorkspaceMember.findOne({ workspaceId, userId });

  if (!member) {
    throw new AppError('You are not a member of this workspace.', 403);
  }

  if (writeAccess && !['OWNER', 'ADMIN'].includes(member.role)) {
    throw new AppError(
      'Only workspace owners and admins can change projects.',
      403,
    );
  }
};

// helper functions
const sanitizeProject = (project) => ({
  id: project._id,
  name: project.name,
  description: project.description,
  workspaceId: project.workspaceId,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});

export const createProject = async (projectData, workspaceId, userId) => {
  await assertWorkspaceAccess(workspaceId, userId, true);

  const project = await Project.create({
    name: projectData.name,
    description: projectData.description || '',
    workspaceId: workspaceId,
  });

  const board = await Board.create({
    name: `${project.name} Board`,
    projectId: project._id,
    createdBy: userId,
    columns: [
      { title: 'Todo', status: 'todo', order: 0 },
      { title: 'In Progress', status: 'in_progress', order: 1 },
      { title: 'Done', status: 'done', order: 2 },
    ],
  });

  return {
    ...sanitizeProject(project),
    board: {
      id: board._id,
      name: board.name,
      columns: board.columns.map((column) => ({
        id: column._id,
        title: column.title,
        status: column.status,
        order: column.order,
      })),
    },
  };
};

export const deleteProject = async (projectId, userId) => {
  if (!projectId) {
    throw new AppError('Project ID is required', 400);
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  await assertWorkspaceAccess(project.workspaceId, userId, true);
  await Project.findByIdAndDelete(projectId);

  return {
    projectId,
    deletedAt: new Date().toISOString(),
  };
};

export const getProjectsByWorkspace = async (workspaceId, userId) => {
  await assertWorkspaceAccess(workspaceId, userId);

  const projects = await Project.find({
    workspaceId,
  });

  return projects.map(sanitizeProject);
};

export const updateProject = async (projectId, userId, data) => {
  const existingProject = await Project.findById(projectId);

  if (!existingProject) {
    throw new AppError('Project not found', 404);
  }

  await assertWorkspaceAccess(existingProject.workspaceId, userId, true);

  const project = await Project.findOneAndUpdate(
    {
      _id: projectId,
    },
    {
      $set: data,
    },
    { new: true, runValidators: true },
  );
  return sanitizeProject(project);
};
