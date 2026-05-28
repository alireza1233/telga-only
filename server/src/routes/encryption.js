import crypto from 'crypto';
import { getPool } from '../database/init.js';
import { v4 as uuidv4 } from 'uuid';

export const encryptionRoutes = async (fastify) => {
  // Generate RSA Keys
  fastify.post('/generate-keys', async (request, reply) => {
    try {
      const { modulusLength = 4096 } = request.body;
      
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
      
      return {
        success: true,
        publicKey,
        privateKey,
        message: '✅ RSA keys generated (store privateKey securely!)',
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Key generation failed' });
    }
  });

  // Store Session Key
  fastify.post('/session-key/store', async (request, reply) => {
    try {
      const { userId, peerId, encryptedSessionKey, algorithm } = request.body;
      const pool = getPool();
      
      await pool.query(
        `INSERT INTO session_keys (id, user_id, peer_id, encrypted_session_key, algorithm)
         VALUES ($1, $2, $3, $4, $5)`,
        [uuidv4(), userId, peerId, encryptedSessionKey, algorithm]
      );
      
      return { success: true, message: '✅ Session key stored' };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Session key storage failed' });
    }
  });

  // Encrypt Data (AES-256-GCM)
  fastify.post('/encrypt', async (request, reply) => {
    try {
      const { plaintext } = request.body;
      const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'utf-8').slice(0, 32);
      const iv = crypto.randomBytes(16);
      
      const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);
      let encrypted = cipher.update(plaintext, 'utf-8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      return {
        success: true,
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Encryption failed' });
    }
  });

  // Decrypt Data
  fastify.post('/decrypt', async (request, reply) => {
    try {
      const { encrypted, iv, authTag } = request.body;
      const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'utf-8').slice(0, 32);
      
      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        encryptionKey,
        Buffer.from(iv, 'hex')
      );
      
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
      decrypted += decipher.final('utf-8');
      
      return { success: true, decrypted };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Decryption failed' });
    }
  });
};