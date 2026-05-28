import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import dotenv from 'dotenv';
import { initializeDatabase } from './database/init.js';
import { authRoutes } from './routes/auth.js';
import { chatRoutes } from './routes/chat.js';
import { encryptionRoutes } from './routes/encryption.js';

dotenv.config();

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// Register WebSocket
await fastify.register(fastifyWebsocket);

// Initialize Database
console.log('🔄 Initializing database...');
await initializeDatabase();
console.log('✅ Database ready!');

// Routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(chatRoutes, { prefix: '/api/chat' });
fastify.register(encryptionRoutes, { prefix: '/api/encryption' });

// WebSocket Handler
fastify.get('/ws', { websocket: true }, (socket, req) => {
  console.log('👤 Client connected to WebSocket');
  
  socket.on('message', (message) => {
    console.log('📨 Message received:', message);
    // Handle incoming messages
  });

  socket.on('close', () => {
    console.log('👤 Client disconnected');
  });
});

// Health Check
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Start Server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    console.log(`\n🚀 Nakheir Server running on port ${process.env.PORT || 3000}`);
    console.log('📡 WebSocket: ws://localhost:3000/ws\n');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();