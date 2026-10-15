import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';

function checkPort(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function waitForPort(port, maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    const isOpen = await checkPort(port);
    if (isOpen) return true;
    await new Promise((res) => setTimeout(res, 500));
  }
  return false;
}

async function main() {
  let dbProcess = null;
  const isDbRunning = await checkPort(5432);

  if (isDbRunning) {
    console.log('[Dev] Database is already running on port 5432.');
  } else {
    console.log('[Dev] Starting embedded PostgreSQL database...');
    dbProcess = spawn(process.execPath, [path.join(process.cwd(), 'scripts', 'dev-db.mjs')], {
      stdio: 'inherit',
    });

    const ready = await waitForPort(5432);
    if (!ready) {
      console.error('[Dev] Timed out waiting for database on port 5432.');
      process.exit(1);
    }
    console.log('[Dev] Database ready on port 5432.');
  }

  console.log('[Dev] Starting Next.js development server...');
  const nextBin = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');
  const nextProcess = spawn(
    process.execPath,
    [nextBin, 'dev'],
    { stdio: 'inherit' }
  );

  const cleanup = () => {
    if (dbProcess) {
      console.log('[Dev] Stopping embedded database...');
      try {
        dbProcess.kill();
      } catch {}
    }
    try {
      nextProcess.kill();
    } catch {}
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  nextProcess.on('exit', (code) => {
    if (dbProcess) {
      try {
        dbProcess.kill();
      } catch {}
    }
    process.exit(code || 0);
  });
}

main().catch((err) => {
  console.error('[Dev] Error:', err);
  process.exit(1);
});
