import { LogEvent, Logger } from "../core/logger";


export class RemoteLogger implements Logger {
    private logLevel: 'error' | 'warn' | 'info' | 'debug' = 'info';

    constructor(private endpoint?: string) { }

    setLogLevel(level: 'error' | 'warn' | 'info' | 'debug') {
        this.logLevel = level;
    }

    private shouldLog(level: string): boolean {
        const levels = ['error', 'warn', 'info', 'debug'];
        // return levels.indexOf(level) <= levels.indexOf(this.logLevel);
        return levels.includes(level);
    }

    private shouldSendToServer(level: string): boolean {
        const levels = ['error'];
        return levels.includes(level);
    }

    private async sendToServer(event: LogEvent) {
        if (!this.endpoint) {
            console.warn('No endpoint configured. Logging to console instead.');
            console.log(event);
            return;
        }

        try {
            console.info('Sending log to server:', event);
            await fetch(this.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...event,
                    source: "zoan",
                }),
            });
        } catch (error) {
            console.error('Failed to send log to server:', error);
        }
    }

    log(level: 'error' | 'warn' | 'info' | 'debug', message: string, context?: Record<string, unknown>) {
        if (!this.shouldLog(level)) return;

        const event: LogEvent = {
            timestamp: Date.now(),
            level,
            message,
            context,
        };

        if (level === 'error' && context?.error instanceof Error) {
            event.stackTrace = context.error.stack;
        }

        if (this.shouldSendToServer(level)) {
            // Send to server or fallback to console
            this.sendToServer(event);
        } else {
            console.log(event);
        }
    }

    error(message: string, context?: Record<string, unknown>) {
        this.log('error', message, context);
    }

    warn(message: string, context?: Record<string, unknown>) {
        this.log('warn', message, context);
    }

    info(message: string, context?: Record<string, unknown>) {
        this.log('info', message, context);
    }

    debug(message: string, context?: Record<string, unknown>) {
        this.log('debug', message, context);
    }
}