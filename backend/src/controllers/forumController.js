import { query } from '../db.js';

export const listThreads = async (req, res) => {
  try {
    const result = await query('SELECT * FROM forum_threads ORDER BY created_at DESC LIMIT 100');
    res.json({ threads: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load forum threads' });
  }
};

export const createThread = async (req, res) => {
  const { title, content, category } = req.body;
  try {
    const result = await query(
      `INSERT INTO forum_threads (author_id, title, content, category)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.id, title, content, category]
    );
    res.status(201).json({ thread: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create thread' });
  }
};

export const addComment = async (req, res) => {
  const { threadId } = req.params;
  const { content } = req.body;
  try {
    const result = await query(
      `INSERT INTO forum_comments (thread_id, author_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [threadId, req.user.id, content]
    );
    res.status(201).json({ comment: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not post comment' });
  }
};

export const reportThread = async (req, res) => {
  const { threadId } = req.params;
  try {
    const result = await query('UPDATE forum_threads SET is_reported = TRUE, updated_at = NOW() WHERE id = $1 RETURNING *', [threadId]);
    if (!result.rowCount) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    res.json({ thread: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to report thread' });
  }
};

export const reportComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const result = await query('UPDATE forum_comments SET is_reported = TRUE, updated_at = NOW() WHERE id = $1 RETURNING *', [commentId]);
    if (!result.rowCount) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json({ comment: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to report comment' });
  }
};
