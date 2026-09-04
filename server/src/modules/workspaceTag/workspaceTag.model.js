import mongoose from 'mongoose';

const workspaceTagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      trim: true,
    },

    color: {
      type: String,
      required: [true, 'Tag color is required'],
      trim: true,
    },

    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: [true, 'Workspace is required'],
    },
  },
  { timestamps: true },
);

const WorkspaceTag =
  mongoose.models.WorkspaceTag ||
  mongoose.model('WorkspaceTag', workspaceTagSchema);

export default WorkspaceTag;