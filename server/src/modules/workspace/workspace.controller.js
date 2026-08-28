import { createWorkspace } from './workspace.service.js';

export const createWorkspaceController = async (req, res, next) => {
  try {
    const { name, description, iconUrl } = req.body;

    const workspace = await createWorkspace({
      name,
      description,
      iconUrl,
      ownerId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: workspace._id,
        name: workspace.name,
        description: workspace.description,
        iconUrl: workspace.iconUrl,
        ownerId: workspace.ownerId,
      },
    });
  } catch (error) {
    next(error);
  }
};
