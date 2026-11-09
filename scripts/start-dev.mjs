import { spawn, execSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';

const VITE_PORT = 5173;
const NGROK_STATIC_URL = 'https://diaper-collar-babied.ngrok-free.dev';

console.log('='.repeat(70));
console.log('🏛️  Town of Maplewood Municipal Portal — Dev Server & Static Tunnel');
console.log('='.repeat(70));
console.log(`📡 Local Port:         http://localhost:${VITE_PORT}`);
console.log(`🌐 Static Ngrok URL:   ${NGROK_STATIC_URL}`);
console.log('='.repeat(70));

const isWindows = process.platform === 'win32';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';

// Find direct ngrok executable if available
function getNgrokCommand() {
  if (isWindows) {
    const directPath = 'C:\\Users\\hp\\AppData\\Local\\npm-cache\\_npx\\094a17e86d981b10\\node_modules\\ngrok\\bin\\ngrok.exe';
    if (fs.existsSync(directPath)) {
      return `"${directPath}"`;
    }
  }
  return `${npxCmd} --yes ngrok`;
}

// 1. Terminate any previous lingering processes holding port 5173 or ngrok
if (isWindows) {
  try {
    execSync('taskkill /F /IM ngrok.exe', { stdio: 'ignore' });
  } catch (e) {}
  try {
    execSync(
      `powershell -Command "Get-NetTCPConnection -LocalPort ${VITE_PORT} -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"`,
      { stdio: 'ignore' }
    );
  } catch (e) {}
}

// 2. Launch Vite Dev Server
const vite = spawn(`${npxCmd} vite --port ${VITE_PORT} --strictPort`, {
  stdio: 'inherit',
  shell: true,
});

let ngrok = null;
let tunnelStarted = false;

// Function to check if Vite has started listening
const waitForVite = (callback, retries = 40) => {
  if (tunnelStarted) return;
  const req = http.get(`http://127.0.0.1:${VITE_PORT}`, (res) => {
    res.resume();
    if (!tunnelStarted) {
      tunnelStarted = true;
      callback();
    }
  });

  req.on('error', () => {
    if (tunnelStarted) return;
    if (retries > 0) {
      setTimeout(() => waitForVite(callback, retries - 1), 250);
    } else {
      if (!tunnelStarted) {
        tunnelStarted = true;
        callback();
      }
    }
  });

  req.setTimeout(1000, () => {
    req.destroy();
  });
};

// 3. Launch Ngrok Tunnel once Vite is ready
const startTunnel = () => {
  console.log(`\n🔗 Connecting static ngrok tunnel to ${NGROK_STATIC_URL} ...`);
  const ngrokBin = getNgrokCommand();
  const cmd = `${ngrokBin} http ${VITE_PORT} --url ${NGROK_STATIC_URL} --log=stdout`;

  ngrok = spawn(cmd, {
    stdio: 'inherit',
    shell: true,
  });

  ngrok.on('error', (err) => {
    console.error('Failed to start ngrok tunnel:', err);
  });
};

// Wait for Vite to respond, then launch tunnel
waitForVite(startTunnel);

// Clean up processes on shutdown
const killProcessTree = (proc) => {
  if (!proc || !proc.pid) return;
  try {
    if (isWindows) {
      execSync(`taskkill /pid ${proc.pid} /T /F`, { stdio: 'ignore' });
    } else {
      proc.kill('SIGTERM');
    }
  } catch (e) {}
};

const shutdown = () => {
  console.log('\n🛑 Shutting down dev server and ngrok tunnel...');
  killProcessTree(ngrok);
  killProcessTree(vite);
  if (isWindows) {
    try { execSync('taskkill /F /IM ngrok.exe', { stdio: 'ignore' }); } catch (e) {}
  }
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', shutdown);
