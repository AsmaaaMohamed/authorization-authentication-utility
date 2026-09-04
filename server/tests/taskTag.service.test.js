import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  addTagToTask,
  getTasksByTag,
  removeTagFromTask,
} from '../src/modules/taskTag/taskTag.service.js';

describe('Task tag services', () => {
  it('throws 400 when taskId is missing', async () => {
    await assert.rejects(
      () => addTagToTask('', '507f1f77bcf86cd799439011'),
      (error) => {
        assert.equal(error.statusCode, 400);
        assert.equal(error.message, 'Task ID is required');
        return true;
      },
    );
  });

  it('throws 400 when tagId is missing', async () => {
    await assert.rejects(
      () => addTagToTask('507f1f77bcf86cd799439011', ''),
      (error) => {
        assert.equal(error.statusCode, 400);
        assert.equal(error.message, 'Tag ID is required');
        return true;
      },
    );
  });

  it('throws 400 when detaching without taskId', async () => {
    await assert.rejects(
      () => removeTagFromTask('', '507f1f77bcf86cd799439011'),
      (error) => {
        assert.equal(error.statusCode, 400);
        assert.equal(error.message, 'Task ID is required');
        return true;
      },
    );
  });

  it('throws 400 when detaching without tagId', async () => {
    await assert.rejects(
      () => removeTagFromTask('507f1f77bcf86cd799439011', ''),
      (error) => {
        assert.equal(error.statusCode, 400);
        assert.equal(error.message, 'Tag ID is required');
        return true;
      },
    );
  });

  it('throws 400 when listing without workspaceId', async () => {
    await assert.rejects(
      () => getTasksByTag('', '507f1f77bcf86cd799439011'),
      (error) => {
        assert.equal(error.statusCode, 400);
        assert.equal(error.message, 'Workspace ID is required');
        return true;
      },
    );
  });

  it('throws 400 when listing without tagId', async () => {
    await assert.rejects(
      () => getTasksByTag('507f1f77bcf86cd799439011', ''),
      (error) => {
        assert.equal(error.statusCode, 400);
        assert.equal(error.message, 'Tag ID is required');
        return true;
      },
    );
  });
});
