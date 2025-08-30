import { PostgrestError } from "@supabase/supabase-js";
import { Logger } from "../core/logger";
import { BusinessRuleViolationError } from "./business-rule-violation.error";
import { DomainError } from "./domain.error";
import { NotFoundError } from "./not-found.error";
import { ValidationError } from "./validation.error";


export class DomainErrorFilter {
    constructor(private readonly logger: Logger) { }
    private async log(params: {
        stackTrace?: string;
        hint?: string;
        details?: string;
        name?: string;
        message: string | object;
    }) {
        this.logger.error("Exception catched", {
            ...params
        });
    }
    catch(exception: unknown) {
        let message = "errors.internalServerError";
        if (exception instanceof DomainError) {
            let name = "errors.internalServerError";

            if (exception instanceof ValidationError) {
                name = "errors.validationError";
            } else if (exception instanceof NotFoundError) {
                name = "errors.notFoundError";
            } else if (exception instanceof BusinessRuleViolationError) {
                name = "errors.businessRuleViolationError";
            }

            this.log({
                stackTrace: exception.stack,
                name,
                message: exception.message,
            });
            message = exception.message;
        }

        // Autres erreurs (non prévues)
        if (exception instanceof PostgrestError) {
            this.log({
                stackTrace: exception.stack,
                details: exception?.details,
                message: exception?.message,
                hint: exception?.hint,
                name: exception?.name
            });
            message = exception.cause as string ?? exception.message;
        }

        console.error(exception); // Pour debugging
        return message;
    }
}
