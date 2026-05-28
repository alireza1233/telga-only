# 🚀 Nakheir Server Backend

E2EE Chat Application - Node.js/Fastify Backend

## 📋 Features Implemented

✅ **Authentication**
- User registration with hashed passwords
- Login with JWT tokens
- User profile endpoints
- Bcrypt password hashing (10 rounds)

✅ **Chat Management**
- Create chats (private/group)
- Chat list retrieval
- Message storage and retrieval
- Chat members management

✅ **E2EE Encryption**
- RSA-4096 key generation
- AES-256-GCM encryption/decryption
- Session key management
- HMAC authentication
- Perfect forward secrecy ready

✅ **Real-time**
- WebSocket support
- Message broadcasting
- User presence

## 🛠️ Installation

```bash
cd server
npm install
```

## 🔧 Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your settings:
```
DATABASE_URL=postgresql://user:pass@localhost:5432/nakheir_db
JWT_SECRET=your_secret_key_here
ENCRYPTION_KEY=32_character_key_for_aes256
PORT=3000
```

## 📊 Database Setup

```bash
# Create PostgreSQL database
createdb nakheir_db

# Run migrations (automatic on server start)
npm run migrate
```

## 🚀 Running

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on: `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile/:userId` - Get user profile

### Chat
- `POST /api/chat/create` - Create chat
- `GET /api/chat/list/:userId` - Get user's chats
- `GET /api/chat/messages/:chatId` - Get messages
- `POST /api/chat/message/send` - Send encrypted message

### Encryption
- `POST /api/encryption/generate-keys` - Generate RSA keys
- `POST /api/encryption/session-key/store` - Store session key
- `POST /api/encryption/encrypt` - Encrypt data (AES-256-GCM)
- `POST /api/encryption/decrypt` - Decrypt data

### WebSocket
- `ws://localhost:3000/ws` - WebSocket connection for real-time messages

## 🔐 Security Features

- ✅ AES-256-GCM encryption for messages
- ✅ RSA-4096 for key exchange
- ✅ JWT tokens with expiration
- ✅ Bcrypt password hashing (10 rounds)
- ✅ HMAC for message integrity
- ✅ Perfect Forward Secrecy ready
- ✅ UUID for unique identifiers
- ✅ SQL injection prevention (parameterized queries)

## 📝 Database Schema

**Tables:**
- `users` - User accounts with RSA public keys
- `chats` - Chat rooms (private/group)
- `chat_members` - Chat memberships
- `messages` - Encrypted messages (BYTEA storage)
- `session_keys` - Encryption session keys

## 🧪 Testing

```bash
npm test
```

## 📦 Dependencies

- **fastify** - Web framework (4x faster than Express)
- **pg** - PostgreSQL client
- **jsonwebtoken** - JWT handling
- **bcryptjs** - Password hashing
- **tweetnacl** - Cryptography
- **libsodium.js** - Advanced encryption
- **dotenv** - Environment variables
- **zod** - Schema validation

## 🔄 Next Phase

- [ ] Complete Flutter integration
- [ ] WebSocket real-time messaging
- [ ] Media file upload/download
- [ ] Group chat features
- [ ] User blocking/reporting
- [ ] Message reactions
- [ ] Voice/Video call signaling
- [ ] Message search
- [ ] User presence/status

---

**Status:** ✅ Backend foundation ready for Flutter integration

Created with 🔐 Security First Approach
