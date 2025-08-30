export interface LogEvent {
    timestamp: number;
    level: 'error' | 'warn' | 'info' | 'debug';
    message: string;
    context?: Record<string, any>;
    stackTrace?: string;
}
export interface Logger {
    log: (level: 'error' | 'warn' | 'info' | 'debug', message: string, context?: Record<string, any>) => void;
    error: (message: string, context?: Record<string, any>) => void;
    warn: (message: string, context?: Record<string, any>) => void;
    info: (message: string, context?: Record<string, any>) => void;
    debug: (message: string, context?: Record<string, any>) => void;
}
