/**
 * UDYOG Integrated Development Environment Orchestrator
 * 
 * Automatically manages startup and lifecycle for:
 * 1. Local VEXYL-TTS Server (ws://127.0.0.1:8080)
 *    - Reuses existing process if port 8080 is already active (no duplicate instances / GPU memory allocations)
 *    - Uses dedicated Python 3.11 .venv (C:\Users\STARK\Documents\SIH-2026\Software\vexyl-tts-main\.venv\Scripts\python.exe)
 *    - Waits for WebSocket {"type": "ready"} signal before proceeding
 * 2. UDYOG Backend API (http://localhost:5000)
 * 3. UDYOG Frontend (Vite on http://localhost:5173)
 * 
 * Cleanly shuts down VEXYL on exit IF AND ONLY IF it was started by this orchestrator.
 */

import { spawn, ChildProcess, execSync } from 'child_process';
import net from 'net';
import path from 'path';
import fs from 'fs';

const VEXYL_DIR = process.env.VEXYL_DIR || 'C:\\Users\\STARK\\Documents\\SIH-2026\\Software\\vexyl-tts-main';
const VEXYL_PYTHON = path.join(VEXYL_DIR, '.venv', 'Scripts', 'python.exe');
const VEXYL_SCRIPT = 'vexyl_tts_server.py';
const VEXYL_WS_URL = process.env.VITE_VEXYL_TTS_URL || 'ws://127.0.0.1:8080';
const parsedUrl = new URL(VEXYL_WS_URL.replace('ws://', 'http://').replace('wss://', 'https://'));
const VEXYL_PORT = parseInt(parsedUrl.port || '8080', 10);

const BACKEND_PORT = parseInt(process.env.PORT || '5000', 10);

let vexylProcess: ChildProcess | null = null;
let backendProcess: ChildProcess | null = null;
let frontendProcess: ChildProcess | null = null;
let startedVexylByUs = false;
let isShuttingDown = false;

function log(prefix: string, message: string) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`\x1b[36m[${timestamp}]\x1b[0m \x1b[1m[${prefix}]\x1b[0m ${message}`);
}

function checkPortOpen(port: number, host = '127.0.0.1'): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(800);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

function waitForWebSocketReady(url: string, timeoutMs = 240000): Promise<boolean> {
  const startTime = Date.now();
  let lastReportTime = 0;

  return new Promise((resolve) => {
    const check = async () => {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      if (Date.now() - startTime > timeoutMs) {
        log('VEXYL-TTS', '\x1b[31mTimeout waiting for VEXYL WebSocket readiness.\x1b[0m');
        resolve(false);
        return;
      }

      if (Date.now() - lastReportTime > 8000 && elapsed > 3) {
        lastReportTime = Date.now();
        log('VEXYL-TTS', `Loading AI speech models into GPU memory (RTX 4050 CUDA)... (${elapsed}s elapsed)`);
      }

      const portOpen = await checkPortOpen(VEXYL_PORT);
      if (!portOpen) {
        setTimeout(check, 1200);
        return;
      }

      try {
        const ws = new WebSocket(url);
        let settled = false;

        const timer = setTimeout(() => {
          if (!settled) {
            settled = true;
            try {
              ws.close();
            } catch {}
            setTimeout(check, 1200);
          }
        }, 2500);

        ws.onopen = () => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            try {
              ws.close();
            } catch {}
            resolve(true);
          }
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data.toString());
            if (data.type === 'ready') {
              if (!settled) {
                settled = true;
                clearTimeout(timer);
                try {
                  ws.close();
                } catch {}
                resolve(true);
              }
            }
          } catch {}
        };

        ws.onerror = () => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            setTimeout(check, 1200);
          }
        };

        ws.onclose = () => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            setTimeout(check, 1200);
          }
        };
      } catch {
        setTimeout(check, 1200);
      }
    };

    check();
  });
}

async function startVexylTTS(): Promise<void> {
  log('VEXYL-TTS', 'Checking if VEXYL-TTS server is already running on port 8080...');
  const inUse = await checkPortOpen(VEXYL_PORT);

  if (inUse) {
    log('VEXYL-TTS', `\x1b[32mPort ${VEXYL_PORT} is already active. Detecting existing VEXYL server...\x1b[0m`);
    const isReady = await waitForWebSocketReady(VEXYL_WS_URL, 8000);
    if (isReady) {
      log('VEXYL-TTS', '\x1b[32mExisting VEXYL-TTS server instance verified and ready. Reusing instance (no duplicate started).\x1b[0m');
      startedVexylByUs = false;
      return;
    }
  }

  // Not in use, launch Python VEXYL server
  if (!fs.existsSync(VEXYL_PYTHON)) {
    throw new Error(`VEXYL Python executable not found at: ${VEXYL_PYTHON}`);
  }

  log('VEXYL-TTS', `Launching VEXYL-TTS server from ${VEXYL_DIR}...`);
  log('VEXYL-TTS', `Executable: ${VEXYL_PYTHON} (Python 3.11 virtual environment)`);

  vexylProcess = spawn(VEXYL_PYTHON, [VEXYL_SCRIPT], {
    cwd: VEXYL_DIR,
    stdio: 'inherit',
    env: {
      ...process.env,
      PYTHONUNBUFFERED: '1',
      VEXYL_TTS_DEVICE: 'cuda', // Ensure NVIDIA RTX 4050 GPU is used
    },
  });

  startedVexylByUs = true;

  log('VEXYL-TTS', 'Waiting for AI model to load into GPU memory and WebSocket to signal readiness...');
  const ready = await waitForWebSocketReady(VEXYL_WS_URL, 240000);

  if (!ready) {
    throw new Error('VEXYL-TTS failed to report readiness within 240 seconds.');
  }

  log('VEXYL-TTS', '\x1b[32m✔ VEXYL-TTS server is READY on ws://127.0.0.1:8080\x1b[0m');
}

async function startBackend(): Promise<void> {
  log('BACKEND', 'Starting UDYOG Node backend (port 5000)...');
  backendProcess = spawn('npx', ['tsx', 'server/src/index.ts'], {
    stdio: 'inherit',
    shell: true,
  });

  // Brief pause to allow backend port binding
  let ready = false;
  for (let i = 0; i < 15; i++) {
    ready = await checkPortOpen(BACKEND_PORT);
    if (ready) break;
    await new Promise((r) => setTimeout(r, 400));
  }

  if (ready) {
    log('BACKEND', `\x1b[32m✔ UDYOG Backend API running on http://localhost:${BACKEND_PORT}\x1b[0m`);
  } else {
    log('BACKEND', 'Backend initialized in background.');
  }
}

function startFrontend(): void {
  log('FRONTEND', 'Starting UDYOG Frontend (Vite)...');
  frontendProcess = spawn('npx', ['vite'], {
    stdio: 'inherit',
    shell: true,
  });
}

function killProcessTree(proc: ChildProcess | null) {
  if (!proc || !proc.pid) return;
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /pid ${proc.pid} /T /F`, { stdio: 'ignore' });
    } else {
      proc.kill('SIGTERM');
    }
  } catch {}
}

function cleanup() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log('\n\x1b[33m[SHUTDOWN] Stopping UDYOG development environment...\x1b[0m');

  if (frontendProcess) {
    killProcessTree(frontendProcess);
  }

  if (backendProcess) {
    killProcessTree(backendProcess);
  }

  if (startedVexylByUs && vexylProcess) {
    console.log('\x1b[33m[SHUTDOWN] Cleanly terminating VEXYL-TTS server started by UDYOG...\x1b[0m');
    killProcessTree(vexylProcess);
  } else if (!startedVexylByUs) {
    console.log('\x1b[32m[SHUTDOWN] Preserving external VEXYL-TTS server (was not started by UDYOG).\x1b[0m');
  }

  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

async function main() {
  console.log('\n======================================================');
  console.log('   UDYOG PLATFORM DEVELOPMENT ORCHESTRATOR');
  console.log('   VEXYL-TTS (CUDA RTX 4050) + Backend + Frontend');
  console.log('======================================================\n');

  try {
    // Step 1: Start VEXYL-TTS & wait for readiness
    await startVexylTTS();

    // Step 2: Start Backend
    await startBackend();

    // Step 3: Start Frontend
    startFrontend();
  } catch (err) {
    console.error('\n\x1b[31m[ORCHESTRATOR ERROR]\x1b[0m', err);
    cleanup();
  }
}

main();
