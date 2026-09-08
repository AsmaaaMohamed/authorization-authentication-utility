import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import Task from '../src/modules/task/task.model.js';
import { deleteTask } from '../src/modules/task/task.service.js';

describe('Task 5: Delete Task Validation & Service', () => {
  describe('deleteTask input validation', () => {
    it('throws 400 when taskId is missing or empty', async () => {
      await assert.rejects(
        async () => {
          await deleteTask('', '507f1f77bcf86cd799439011');
        },
        (err) => {
          assert.equal(err.statusCode, 400);
          assert.match(err.message, /invalid task id/i);
          return true;
        }
      );
    });

    it('throws 400 when taskId is not a valid ObjectId', async () => {
      await assert.rejects(
        async () => {
          await deleteTask('invalid-id', '507f1f77bcf86cd799439011');
        },
        (err) => {
          assert.equal(err.statusCode, 400);
          assert.match(err.message, /invalid task id/i);
          return true;
        }
      );
    });
  });

  describe('deleteTask soft-deletion execution', () => {
    it('throws 404 when task does not exist', async () => {
      mock.method(Task, 'findOne', () => Promise.resolve(null));

      await assert.rejects(
        async () => {
          await deleteTask('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012');
        },
        (err) => {
          assert.equal(err.statusCode, 404);
          assert.match(err.message, /task not found/i);
          return true;
        }
      );

      mock.reset();
    });

    it('soft-deletes task by setting isDeleted: true and deletedAt timestamp', async () => {
      let saved = false;
      const mockTask = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Task to be deleted',
        isDeleted: false,
        deletedAt: null,
        save: async function () {
          saved = true;
          return this;
        },
      };

      mock.method(Task, 'findOne', () => Promise.resolve(mockTask));

      await deleteTask('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012');

      assert.equal(saved, true);
      assert.equal(mockTask.isDeleted, true);
      assert.ok(mockTask.deletedAt instanceof Date);

      mock.reset();
    });
  });
});
