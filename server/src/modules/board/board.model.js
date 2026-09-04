import mongoose from 'mongoose';

const { Schema } = mongoose;

const boardSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Board name is required'],
      trim: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
  },
  { timestamps: true },
);

boardSchema.index({ projectId: 1 });
boardSchema.index({ projectId: 1, name: 1 }, { unique: true });

const Board = mongoose.models.Board || mongoose.model('Board', boardSchema);

export default Board;
