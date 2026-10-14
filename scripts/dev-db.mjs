import { createServer } from 'node:net';
import { fromNodeSocket } from 'pg-gateway/node';
import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.resolve(process.cwd(), 'storage/pgdata');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log('[Dev DB] Initializing PGlite at:', dataDir);
const db = new PGlite(dataDir);
await db.waitReady;
console.log('[Dev DB] PGlite engine ready.');

const PORT = 5432;

// Mutex to serialize PGlite execution across concurrent Prisma connections
let executionQueue = Promise.resolve();
function executeSequentially(data) {
  const resultPromise = executionQueue.then(() => db.execProtocolRaw(data));
  executionQueue = resultPromise.then(() => {}, () => {});
  return resultPromise;
}

const server = createServer(async (socket) => {
  socket.on('error', () => {});
  try {
    await fromNodeSocket(socket, {
      serverVersion: '16.3 (PGlite)',
      auth: { method: 'trust' },
      async onMessage(data) {
        try {
          const resp = await executeSequentially(data);
          return resp || undefined;
        } catch (err) {
          console.error('[Dev DB] execProtocolRaw error:', err);
          return undefined;
        }
      },
    });
  } catch (err) {
    // client disconnect
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Dev DB] Embedded PostgreSQL listening on 0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
  console.error('[Dev DB] Server error:', err);
});
