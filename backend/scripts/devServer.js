const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const watchDirectories = [
  'config',
  'controllers',
  'middlewares',
  'models',
  'repositories',
  'routes',
  'services',
  'utils'
].map((relativePath) => path.join(rootDir, relativePath));

const rootFiles = ['server.js', 'app.js', 'package.json', '.env'].map((file) => path.join(rootDir, file));
const watchedFiles = new Map();
const relevantExtensions = new Set(['.js', '.json']);

let serverProcess = null;
let restartTimer = null;
let shuttingDown = false;

function shouldWatchFile(filePath) {
  const basename = path.basename(filePath);
  const extension = path.extname(filePath);

  return basename === '.env' || relevantExtensions.has(extension);
}

function collectFiles(targetPath, discoveredFiles = []) {
  if (!fs.existsSync(targetPath)) return discoveredFiles;

  const stats = fs.statSync(targetPath);
  if (stats.isFile()) {
    if (shouldWatchFile(targetPath)) discoveredFiles.push(targetPath);
    return discoveredFiles;
  }

  const entries = fs.readdirSync(targetPath, { withFileTypes: true });
  for (const entry of entries) {
    const nextPath = path.join(targetPath, entry.name);
    if (entry.isDirectory()) {
      collectFiles(nextPath, discoveredFiles);
    } else if (entry.isFile() && shouldWatchFile(nextPath)) {
      discoveredFiles.push(nextPath);
    }
  }

  return discoveredFiles;
}

function startServer() {
  const currentProcess = spawn(process.execPath, ['server.js'], {
    cwd: rootDir,
    env: process.env,
    stdio: 'inherit'
  });

  serverProcess = currentProcess;

  currentProcess.on('exit', (code, signal) => {
    if (serverProcess === currentProcess) {
      serverProcess = null;
    }

    if (shuttingDown) return;
    if (signal === 'SIGTERM' || signal === 'SIGINT') return;

    const reason = signal || code || 0;
    console.log(`[dev] server exited (${reason}). Waiting for file changes...`);
  });
}

function stopServer(onStopped) {
  const currentProcess = serverProcess;

  if (!currentProcess) {
    onStopped?.();
    return;
  }

  currentProcess.once('exit', () => {
    if (serverProcess === currentProcess) {
      serverProcess = null;
    }
    onStopped?.();
  });

  currentProcess.kill('SIGTERM');

  setTimeout(() => {
    if (currentProcess.exitCode === null && currentProcess.signalCode === null) {
      currentProcess.kill('SIGKILL');
    }
  }, 1500).unref();
}

function scheduleRestart(changeSummary) {
  if (shuttingDown) return;

  clearTimeout(restartTimer);
  restartTimer = setTimeout(() => {
    restartTimer = null;
    console.log(`[dev] ${changeSummary}. Restarting backend...`);
    stopServer(startServer);
  }, 120);
}

function syncWatchedFiles() {
  const nextFiles = new Set();

  for (const filePath of rootFiles) {
    if (fs.existsSync(filePath) && shouldWatchFile(filePath)) {
      nextFiles.add(filePath);
    }
  }

  for (const directoryPath of watchDirectories) {
    collectFiles(directoryPath).forEach((filePath) => nextFiles.add(filePath));
  }

  for (const filePath of nextFiles) {
    if (watchedFiles.has(filePath)) continue;

    const listener = (currentStats, previousStats) => {
      const changed = currentStats.mtimeMs !== previousStats.mtimeMs || currentStats.size !== previousStats.size;
      if (!changed) return;

      scheduleRestart(`${path.relative(rootDir, filePath)} changed`);
    };

    fs.watchFile(filePath, { interval: 350 }, listener);
    watchedFiles.set(filePath, listener);
  }

  for (const [filePath, listener] of watchedFiles.entries()) {
    if (nextFiles.has(filePath)) continue;
    fs.unwatchFile(filePath, listener);
    watchedFiles.delete(filePath);
  }
}

function stopWatchingFiles() {
  for (const [filePath, listener] of watchedFiles.entries()) {
    fs.unwatchFile(filePath, listener);
  }
  watchedFiles.clear();
}

function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  clearTimeout(restartTimer);
  clearInterval(syncTimer);
  stopWatchingFiles();

  stopServer(() => {
    process.exit(signal === 'SIGINT' ? 130 : 0);
  });
}

syncWatchedFiles();
const syncTimer = setInterval(syncWatchedFiles, 2000);
syncTimer.unref();

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();
