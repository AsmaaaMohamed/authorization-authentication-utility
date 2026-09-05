import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createTaskSchema } from '../src/validators/task.validator.js';
import { createTask } from '../src/modules/task/task.service.js';

describe('Task 1: Create Task Validation & Service', () => {
  describe('createTaskSchema', () => {
    it('passes with all valid required fields', () => {
      const payload = {
        title: 'Fix authentication bug',
        status: 'todo',
        projectId: '507f1f77bcf86cd799439011',
        boardId: '507f1f77bcf86cd799439012',
        assigneeId: '507f1f77bcf86cd799439013',
        description: 'Details about the bug',
      };

      const result = createTaskSchema.safeParse(payload);
      assert.equal(result.success, true);
      assert.equal(result.data.title, 'Fix authentication bug');
      assert.equal(result.data.status, 'todo');
    });

    it('accepts in_progress and done status values', () => {
      const base = {
        title: 'Task title',
        projectId: '507f1f77bcf86cd799439011',
        boardId: '507f1f77bcf86cd799439012',
        assigneeId: '507f1f77bcf86cd799439013',
      };

      const inProgressResult = createTaskSchema.safeParse({ ...base, status: 'in_progress' });
      assert.equal(inProgressResult.success, true);

      const doneResult = createTaskSchema.safeParse({ ...base, status: 'done' });
      assert.equal(doneResult.success, true);
    });

    it('fails when status is not todo, in_progress, or done', () => {
      const payload = {
        title: 'Task title',
        status: 'cancelled',
        projectId: '507f1f77bcf86cd799439011',
        boardId: '507f1f77bcf86cd799439012',
        assigneeId: '507f1f77bcf86cd799439013',
      };

      const result = createTaskSchema.safeParse(payload);
      assert.equal(result.success, false);
      const errors = result.error.flatten().fieldErrors;
      assert.ok(errors.status);
    });

    it('fails when title is missing or empty', () => {
      const payload = {
        title: '   ',
        status: 'todo',
        projectId: '507f1f77bcf86cd799439011',
        boardId: '507f1f77bcf86cd799439012',
        assigneeId: '507f1f77bcf86cd799439013',
      };

      const result = createTaskSchema.safeParse(payload);
      assert.equal(result.success, false);
      const errors = result.error.flatten().fieldErrors;
      assert.ok(errors.title);
    });

    it('fails when assigneeId is missing', () => {
      const payload = {
        title: 'Some task',
        status: 'todo',
        projectId: '507f1f77bcf86cd799439011',
        boardId: '507f1f77bcf86cd799439012',
      };

      const result = createTaskSchema.safeParse(payload);
      assert.equal(result.success, false);
      const errors = result.error.flatten().fieldErrors;
      assert.ok(errors.assigneeId);
    });
  });

  describe('createTask service input validation', () => {
    it('throws 400 when projectId is invalid ObjectId', async () => {
      await assert.rejects(
        async () => {
          await createTask({
            title: 'Test',
            status: 'todo',
            projectId: 'invalid-id',
            boardId: '507f1f77bcf86cd799439012',
            assigneeId: '507f1f77bcf86cd799439013',
            ownerId: '507f1f77bcf86cd799439014',
          });
        },
        (err) => {
          assert.equal(err.statusCode, 400);
          assert.match(err.message, /invalid project id/i);
          return true;
        }
      );
    });

    it('throws 400 when boardId is invalid ObjectId', async () => {
      await assert.rejects(
        async () => {
          await createTask({
            title: 'Test',
            status: 'todo',
            projectId: '507f1f77bcf86cd799439011',
            boardId: 'invalid-id',
            assigneeId: '507f1f77bcf86cd799439013',
            ownerId: '507f1f77bcf86cd799439014',
          });
        },
        (err) => {
          assert.equal(err.statusCode, 400);
          assert.match(err.message, /invalid board id/i);
          return true;
        }
      );
    });

    it('throws 400 when assigneeId is invalid ObjectId', async () => {
      await assert.rejects(
        async () => {
          await createTask({
            title: 'Test',
            status: 'todo',
            projectId: '507f1f77bcf86cd799439011',
            boardId: '507f1f77bcf86cd799439012',
            assigneeId: 'invalid-id',
            ownerId: '507f1f77bcf86cd799439014',
          });
        },
        (err) => {
          assert.equal(err.statusCode, 400);
          assert.match(err.message, /invalid assignee id/i);
          return true;
        }
      );
    });
  });
});
