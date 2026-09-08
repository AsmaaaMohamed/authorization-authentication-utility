import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import Task from '../src/modules/task/task.model.js';
import WorkspaceMember from '../src/modules/workspaceMember/workspaceMember.model.js';
import { updateTaskSchema } from '../src/validators/task.validator.js';
import { updateTask } from '../src/modules/task/task.service.js';

describe('Task 4: Update Task Validation & Service', () => {
  describe('updateTaskSchema', () => {
    it('allows partial updates with valid fields', () => {
      const result = updateTaskSchema.safeParse({
        title: 'Updated title',
        status: 'in_progress',
      });
      assert.equal(result.success, true);
      assert.equal(result.data.title, 'Updated title');
      assert.equal(result.data.status, 'in_progress');
    });

    it('accepts valid status values (todo, in_progress, done)', () => {
      for (const status of ['todo', 'in_progress', 'done']) {
        const result = updateTaskSchema.safeParse({ status });
        assert.equal(result.success, true);
        assert.equal(result.data.status, status);
      }
    });

    it('rejects invalid status values', () => {
      const result = updateTaskSchema.safeParse({ status: 'blocked' });
      assert.equal(result.success, false);
      assert.ok(result.error.flatten().fieldErrors.status);
    });

    it('rejects empty title string', () => {
      const result = updateTaskSchema.safeParse({ title: '   ' });
      assert.equal(result.success, false);
      assert.ok(result.error.flatten().fieldErrors.title);
    });
  });

  describe('updateTask service authorization & execution', () => {
    it('throws 400 when taskId is invalid ObjectId', async () => {
      await assert.rejects(
        async () => {
          await updateTask('invalid-id', '507f1f77bcf86cd799439011', { title: 'New' });
        },
        (err) => {
          assert.equal(err.statusCode, 400);
          assert.match(err.message, /invalid task id/i);
          return true;
        }
      );
    });

    it('throws 400 when assigneeId is invalid ObjectId', async () => {
      await assert.rejects(
        async () => {
          await updateTask('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012', {
            assigneeId: 'not-valid',
          });
        },
        (err) => {
          assert.equal(err.statusCode, 400);
          assert.match(err.message, /invalid assignee id/i);
          return true;
        }
      );
    });

    it('throws 403 when user is neither owner, assignee, nor admin', async () => {
      const mockTask = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Original Title',
        ownerId: '507f1f77bcf86cd799439020',
        assigneeId: '507f1f77bcf86cd799439021',
        projectId: {
          _id: '507f1f77bcf86cd799439030',
          workspaceId: '507f1f77bcf86cd799439040',
        },
      };

      mock.method(Task, 'findOne', () => ({
        populate: () => Promise.resolve(mockTask),
      }));

      // Non-admin workspace member
      mock.method(WorkspaceMember, 'findOne', () =>
        Promise.resolve({ role: 'MEMBER' })
      );

      await assert.rejects(
        async () => {
          await updateTask('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439099', {
            title: 'Hacked Title',
          });
        },
        (err) => {
          assert.equal(err.statusCode, 403);
          assert.match(err.message, /not authorized/i);
          return true;
        }
      );

      mock.reset();
    });

    it('allows task owner to update title and status', async () => {
      const mockTask = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Old Title',
        status: 'todo',
        ownerId: '507f1f77bcf86cd799439020',
        assigneeId: '507f1f77bcf86cd799439021',
        projectId: {
          _id: '507f1f77bcf86cd799439030',
          workspaceId: '507f1f77bcf86cd799439040',
        },
        save: async function () {
          return this;
        },
      };

      mock.method(Task, 'findOne', () => ({
        populate: () => Promise.resolve(mockTask),
      }));

      const result = await updateTask('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439020', {
        title: 'New Title',
        status: 'done',
      });

      assert.equal(result.title, 'New Title');
      assert.equal(result.status, 'done');

      mock.reset();
    });

    it('allows workspace admin to update task', async () => {
      const mockTask = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Old Title',
        status: 'todo',
        ownerId: '507f1f77bcf86cd799439020',
        assigneeId: '507f1f77bcf86cd799439021',
        projectId: {
          _id: '507f1f77bcf86cd799439030',
          workspaceId: '507f1f77bcf86cd799439040',
        },
        save: async function () {
          return this;
        },
      };

      mock.method(Task, 'findOne', () => ({
        populate: () => Promise.resolve(mockTask),
      }));

      mock.method(WorkspaceMember, 'findOne', () =>
        Promise.resolve({ role: 'ADMIN' })
      );

      const result = await updateTask('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439099', {
        status: 'in_progress',
      });

      assert.equal(result.status, 'in_progress');

      mock.reset();
    });
  });
});
