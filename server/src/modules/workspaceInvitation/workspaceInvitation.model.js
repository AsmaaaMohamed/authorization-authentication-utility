import mongoose from 'mongoose';

const workspaceInvitationSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: [true, 'Workspace is required'],
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Invited by is required'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ['ADMIN', 'MEMBER'],
      required: [true, 'Role is required'],
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'EXPIRED'],
      default: 'PENDING',
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

workspaceInvitationSchema.index({
  workspaceId: 1,
  email: 1,
  status: 1,
});

const WorkspaceInvitation =
  mongoose.models.WorkspaceInvitation ||
  mongoose.model('WorkspaceInvitation', workspaceInvitationSchema);

export default WorkspaceInvitation;
