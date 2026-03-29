import { execSync } from 'node:child_process';

import Enquirer from 'enquirer';
import db from './db';

const red = (text: string) => `\x1b[31m${text}\x1b[0m`;
const green = (text: string) => `\x1b[32m${text}\x1b[0m`;

const exec = (command: string) => execSync(command + ' || true', { encoding: 'utf-8', shell: '/bin/bash', stdio: 'pipe' });

const enquirer = new Enquirer();

(async () => {
    const { action } = await enquirer.prompt({
        name: 'action',
        type: 'select',
        message: 'what do you want to do?',
        choices: [
            { name: 'link', message: 'link a repository' },
            { name: 'unlink', message: 'unlink a repository' }
        ]
    }) as { action: 'link' | 'unlink' };

    if (action === 'link') {
        const { repo, service } = await enquirer.prompt([
            { name: 'repo', type: 'input', message: 'enter the repository you want to link (owner/repo)' },
            { name: 'service', type: 'input', message: 'enter the systemd service name' }
        ]) as { repo: string, service: string };

        const data = exec(`gh api repos/${repo}`);
        const json = JSON.parse(data);
        if ('message' in json) console.error(red('repository not found'));
        else {
            const token = db.addWebhook(repo, service);
            exec(`gh api repos/${repo}/hooks -F 'config[url]=${process.env.HOST}/v1/webhook?r=${repo}&t=${token}' -F 'config[content_type]=json' -F 'events[]=push'`);
            console.log(green('repository successfully linked!'));
        }
    } else if (action === 'unlink') {
        db.repullDB();

        const { repo } = await enquirer.prompt({
            name: 'repo',
            type: 'select',
            message: 'select the repository you want to unlink',
            choices: db.file.map(e => ({ name: e.repo, message: e.repo }))
        }) as { repo: string };

        const entry = db.file.find(e => e.repo === repo);
        if (!entry) console.error(red('repository not linked'));
        else {
            db.removeWebhook(repo);
            console.log(green('removed from DB'));

            const hooks = JSON.parse(exec(`gh api repos/${repo}/hooks`));
            const hook = hooks.find((h: any) => h.config.url === `${process.env.HOST}/v1/webhook?r=${repo}&t=${entry.token}`);
            if (hook) {
                exec(`gh api repos/${repo}/hooks/${hook.id} -X DELETE`);
                console.log(green('webhook removed'));
            } else console.error(red('webhook not found, it may have been removed manually'));
        }
    }
})();