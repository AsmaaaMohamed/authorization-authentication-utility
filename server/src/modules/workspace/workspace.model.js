import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
      trim: true,
    },

    description: {
      type: String,
      default: '',
      trim: true,
    },

    iconUrl: {
      type: String,
      default: '',
      trim: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Workspace owner is required'],
    },
  },
  { timestamps: true },
);

workspaceSchema.index({ ownerId: 1, name: 1 }, { unique: true });

const Workspace =
  mongoose.models.Workspace || mongoose.model('Workspace', workspaceSchema);

export default Workspace;
