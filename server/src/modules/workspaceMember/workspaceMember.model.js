import mongoose from 'mongoose';

const workspaceMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },

    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: [true, 'Workspace is required'],
    },

    role: {
      type: String,
      enum: ['OWNER', 'ADMIN', 'MEMBER'],
      default: 'MEMBER',
      required: true,
    },
  },
  { timestamps: true },
);

workspaceMemberSchema.index({ userId: 1, workspaceId: 1 }, { unique: true });

const WorkspaceMember =
  mongoose.models.WorkspaceMember ||
  mongoose.model('WorkspaceMember', workspaceMemberSchema);

export default WorkspaceMember;
