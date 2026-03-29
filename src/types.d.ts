declare module 'bun' {
    interface Env {
        HOST: string;
        WEBHOOK: string | undefined;
    }
}