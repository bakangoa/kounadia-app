import { DomainError } from "./domain.error";

export class NotFoundError extends DomainError {
    readonly code = 'NOT_FOUND';
    constructor(resource: string, customMessage?: string) {
        super(customMessage || `${resource} not found`);
    }
}