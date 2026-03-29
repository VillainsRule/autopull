import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import db from './db';

const systemFilesDir = path.join('/', 'etc', 'systemd', 'system');

Bun.serve({
    port: 4479,
    fetch(req) {
        const url = new URL(req.url);

        if (url.pathname === '/') return new Response('OK');
        if (url.pathname === '/robots.txt') return new Response('User-agent: *\nDisallow: /');

        if (url.pathname === '/v1/webhook') {
            const repo = url.searchParams.get('r');
            const token = url.searchParams.get('t');
            if (!repo || !token) return new Response('missing parameters', { status: 400 });

            const serviceName = db.getService(repo, token);
            if (!serviceName) return new Response('invalid token', { status: 403 });

            const servicePath = path.join(systemFilesDir, serviceName + '.service');
            if (!fs.existsSync(servicePath)) {
                console.error('[service not found]', serviceName);
                return new Response('service not found', { status: 404 });
            }

            const serviceContents = fs.readFileSync(servicePath, 'utf-8');
            const workingDirectory = serviceContents.split('\n').find(line => line.startsWith('WorkingDirectory='))?.split('=')[1].trim();
            if (!workingDirectory) {
                console.error('[working directory not found in service file]', serviceName);
                return new Response('working directory not found in service file', { status: 500 });
            }

            console.log(`[pulling changes] ${repo} --> ${serviceName}`);

            execSync('git pull', { cwd: workingDirectory, stdio: 'inherit' });
            execSync('systemctl restart ' + serviceName, { stdio: 'inherit' });

            return new Response('OK');
        }

        return new Response('404 Not Found', { status: 404 });
    }
});

console.log('server running --> http://localhost:4479');