import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  buildDefaultBoardColumns,
  DEFAULT_BOARD_COLUMNS,
} from '../src/modules/board/board.model.js';

describe('Board default columns', () => {
  it('exports the Jira-style default columns for a new board', () => {
    const columns = buildDefaultBoardColumns();

    assert.deepEqual(
      columns.map(({ title, status, order }) => ({ title, status, order })),
      DEFAULT_BOARD_COLUMNS,
    );
    assert.deepEqual(
      columns.map((column) => column.title),
      ['Todo', 'In Progress', 'Done'],
    );
  });
});
