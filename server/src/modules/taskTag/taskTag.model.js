import mongoose from 'mongoose';

const taskTagSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Task ID is required'],
    },

    tagId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkspaceTag',
      required: [true, 'Tag ID is required'],
    },
  },
  { timestamps: true },
);

taskTagSchema.index({ taskId: 1, tagId: 1 }, { unique: true });

const TaskTag =
  mongoose.models.TaskTag ||
  mongoose.model('TaskTag', taskTagSchema);

export default TaskTag;