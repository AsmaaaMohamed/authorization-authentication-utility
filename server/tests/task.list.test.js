import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { listBoardTasksSchema } from '../src/validators/task.validator.js';
import { getBoardTasks } from '../src/modules/task/task.service.js';

describe('Task 2: List Board Tasks Validation & Service', () => {
  describe('listBoardTasksSchema', () => {
    it('applies default pagination values (page: 1, limit: 20)', () => {
      const result = listBoardTasksSchema.safeParse({});
      assert.equal(result.success, true);
      assert.equal(result.data.page, 1);
      assert.equal(result.data.limit, 20);
    });

    it('coerces string query parameters into numbers', () => {
      const result = listBoardTasksSchema.safeParse({
        page: '2',
        limit: '10',
      });
      assert.equal(result.success, true);
      assert.equal(result.data.page, 2);
      assert.equal(result.data.limit, 10);
    });

    it('accepts valid status filters (todo, in_progress, done)', () => {
      for (const status of ['todo', 'in_progress', 'done']) {
        const result = listBoardTasksSchema.safeParse({ status });
        assert.equal(result.success, true);
        assert.equal(result.data.status, status);
      }
    });

    it('rejects invalid status filters', () => {
      const result = listBoardTasksSchema.safeParse({ status: 'archived' });
      assert.equal(result.success, false);
      assert.ok(result.error.flatten().fieldErrors.status);
    });

    it('accepts optional assigneeId filter', () => {
      const result = listBoardTasksSchema.safeParse({
        assigneeId: '507f1f77bcf86cd799439011',
      });
      assert.equal(result.success, true);
      assert.equal(result.data.assigneeId, '507f1f77bcf86cd799439011');
    });
  });

  describe('getBoardTasks service input validation', () => {
    it('throws 400 when boardId is missing or empty', async () => {
      await assert.rejects(
        async () => {
          await getBoardTasks({ boardId: '' });
        },
        (err) => {
          assert.equal(err.statusCode, 400);
          assert.match(err.message, /invalid board id/i);
          return true;
        }
      );
    });

    it('throws 400 when boardId is not a valid ObjectId', async () => {
      await assert.rejects(
        async () => {
          await getBoardTasks({ boardId: 'invalid-id' });
        },
        (err) => {
          assert.equal(err.statusCode, 400);
          assert.match(err.message, /invalid board id/i);
          return true;
        }
      );
    });

    it('throws 400 when assigneeId is not a valid ObjectId', async () => {
      await assert.rejects(
        async () => {
          await getBoardTasks({
            boardId: '507f1f77bcf86cd799439011',
            assigneeId: 'invalid-assignee-id',
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
