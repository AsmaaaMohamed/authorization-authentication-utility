import mongoose from 'mongoose';

export const DEFAULT_BOARD_COLUMNS = [
  { title: 'Todo', status: 'todo', order: 0 },
  { title: 'In Progress', status: 'in_progress', order: 1 },
  { title: 'Done', status: 'done', order: 2 },
];

export const buildDefaultBoardColumns = () =>
  DEFAULT_BOARD_COLUMNS.map((column) => ({
    ...column,
    _id: new mongoose.Types.ObjectId(),
  }));

const boardColumnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Column title is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'done'],
      required: [true, 'Column status is required'],
    },
    order: {
      type: Number,
      required: [true, 'Column order is required'],
      default: 0,
    },
  },
  { _id: true, timestamps: true },
);

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Board name is required'],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
      index: true,
    },
    columns: {
      type: [boardColumnSchema],
      default: buildDefaultBoardColumns,
    },
  },
  { timestamps: true },
);

boardSchema.index({ projectId: 1, name: 1 }, { unique: true });

const Board = mongoose.models.Board || mongoose.model('Board', boardSchema);

export default Board;
