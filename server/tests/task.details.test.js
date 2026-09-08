import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import Task from '../src/modules/task/task.model.js';
import WorkspaceMember from '../src/modules/workspaceMember/workspaceMember.model.js';
import { getTaskById } from '../src/modules/task/task.service.js';

describe('Task 3: Get Task Details Validation & Service', () => {
  describe('getTaskById input validation', () => {
    it('throws 400 when taskId is missing or empty', async () => {
      await assert.rejects(
        async () => {
          await getTaskById('', '507f1f77bcf86cd799439011');
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
          await getTaskById('not-a-valid-id', '507f1f77bcf86cd799439011');
        },
        (err) => {
          assert.equal(err.statusCode, 400);
          assert.match(err.message, /invalid task id/i);
          return true;
        }
      );
    });
  });

  describe('getTaskById authorization and retrieval', () => {
    it('throws 404 when task is missing or soft-deleted', async () => {
      mock.method(Task, 'findOne', () => ({
        populate: () => Promise.resolve(null),
      }));

      await assert.rejects(
        async () => {
          await getTaskById('507f1f77bcf86cd799439019', '507f1f77bcf86cd799439011');
        },
        (err) => {
          assert.equal(err.statusCode, 404);
          assert.match(err.message, /task not found/i);
          return true;
        }
      );

      mock.reset();
    });

    it('throws 403 when requester is not a workspace member', async () => {
      const mockTask = {
        _id: '507f1f77bcf86cd799439019',
        title: 'Secret Task',
        description: 'Classified',
        status: 'todo',
        assigneeId: '507f1f77bcf86cd799439020',
        tags: [],
        attachments: [],
        projectId: {
          _id: '507f1f77bcf86cd799439030',
          workspaceId: '507f1f77bcf86cd799439040',
        },
        boardId: '507f1f77bcf86cd799439050',
        ownerId: '507f1f77bcf86cd799439060',
      };

      mock.method(Task, 'findOne', () => ({
        populate: () => Promise.resolve(mockTask),
      }));

      mock.method(WorkspaceMember, 'findOne', () => Promise.resolve(null));

      await assert.rejects(
        async () => {
          await getTaskById('507f1f77bcf86cd799439019', '507f1f77bcf86cd799439099');
        },
        (err) => {
          assert.equal(err.statusCode, 403);
          assert.match(err.message, /not authorized/i);
          return true;
        }
      );

      mock.reset();
    });

    it('returns 200 OK details when task exists and user is a workspace member', async () => {
      const mockTask = {
        _id: '507f1f77bcf86cd799439019',
        title: 'Design Auth Flow',
        description: 'Figma and spec',
        status: 'in_progress',
        assigneeId: '507f1f77bcf86cd799439020',
        tags: ['design', 'auth'],
        attachments: ['https://example.com/file.png'],
        projectId: {
          _id: '507f1f77bcf86cd799439030',
          workspaceId: '507f1f77bcf86cd799439040',
        },
        boardId: '507f1f77bcf86cd799439050',
        ownerId: '507f1f77bcf86cd799439060',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mock.method(Task, 'findOne', () => ({
        populate: () => Promise.resolve(mockTask),
      }));

      mock.method(WorkspaceMember, 'findOne', () =>
        Promise.resolve({ role: 'MEMBER' })
      );

      const result = await getTaskById('507f1f77bcf86cd799439019', '507f1f77bcf86cd799439020');

      assert.equal(result.id, '507f1f77bcf86cd799439019');
      assert.equal(result.title, 'Design Auth Flow');
      assert.equal(result.status, 'in_progress');
      assert.equal(result.assigneeId, '507f1f77bcf86cd799439020');
      assert.deepEqual(result.tags, ['design', 'auth']);
      assert.deepEqual(result.attachments, ['https://example.com/file.png']);

      mock.reset();
    });
  });
});
