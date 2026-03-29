import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const dbDir = path.join(os.homedir(), '.autopull');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);

interface WebhookEntry {
    repo: string;
    token: string;
    service: string;
}

class DB {
    file: WebhookEntry[] = [];

    constructor() {
        this.repullDB();
    }

    repullDB() {
        const filePath = path.join(dbDir, 'webhooks.db');
        if (fs.existsSync(filePath)) this.file = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    save() {
        fs.writeFileSync(path.join(dbDir, 'webhooks.db'), JSON.stringify(this.file));
    }

    addWebhook(repo: string, service: string): string {
        db.repullDB();
        const token = crypto.randomUUID();
        this.file.push({ repo, token, service });
        this.save();
        return token;
    }

    removeWebhook(repo: string) {
        db.repullDB();
        this.file = this.file.filter(e => e.repo !== repo);
        this.save();
    }

    getService(repo: string, token: string): string | undefined {
        db.repullDB();
        const thing = this.file.find(e => e.repo === repo && e.token === token);
        return thing?.service;
    }
}

const db = new DB();
export default db;