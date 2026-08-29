import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    workspaceId: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true },
);

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;
