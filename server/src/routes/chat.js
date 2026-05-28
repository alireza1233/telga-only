import { getPool } from '../database/init.js';
import { v4 as uuidv4 } from 'uuid';

export const chatRoutes = async (fastify) => {
  // Create Chat
  fastify.post('/create', async (request, reply) => {
    try {
      const { name, type, memberIds } = request.body;
      const chatId = uuidv4();
      const pool = getPool();
      
      await pool.query(
        `INSERT INTO chats (id, name, type) VALUES ($1, $2, $3)`,
        [chatId, name, type || 'private']
      );
      
      // Add members
      for (const memberId of memberIds) {
        await pool.query(
          `INSERT INTO chat_members (chat_id, user_id) VALUES ($1, $2)`,
          [chatId, memberId]
        );
      }
      
      return {
        success: true,
        message: '✅ Chat created',
        chatId,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Chat creation failed' });
    }
  });

  // Get Chat List
  fastify.get('/list/:userId', async (request, reply) => {
    try {
      const { userId } = request.params;
      const pool = getPool();
      
      const result = await pool.query(
        `SELECT DISTINCT c.* FROM chats c
         INNER JOIN chat_members cm ON c.id = cm.chat_id
         WHERE cm.user_id = $1
         ORDER BY c.created_at DESC`,
        [userId]
      );
      
      return { success: true, chats: result.rows };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch chats' });
    }
  });

  // Get Messages
  fastify.get('/messages/:chatId', async (request, reply) => {
    try {
      const { chatId } = request.params;
      const { limit = 50, offset = 0 } = request.query;
      const pool = getPool();
      
      const result = await pool.query(
        `SELECT m.*, u.username FROM messages m
         LEFT JOIN users u ON m.sender_id = u.id
         WHERE m.chat_id = $1
         ORDER BY m.created_at DESC
         LIMIT $2 OFFSET $3`,
        [chatId, limit, offset]
      );
      
      return { success: true, messages: result.rows };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch messages' });
    }
  });

  // Send Message
  fastify.post('/message/send', async (request, reply) => {
    try {
      const { chatId, senderId, encryptedContent, iv, mac } = request.body;
      const messageId = uuidv4();
      const pool = getPool();
      
      await pool.query(
        `INSERT INTO messages (id, chat_id, sender_id, encrypted_content, iv, mac)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [messageId, chatId, senderId, encryptedContent, iv, mac]
      );
      
      return {
        success: true,
        message: '✅ Message sent',
        messageId,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Message send failed' });
    }
  });
};