

export class StringUtils {
    generateUniqueId(): string {
        return crypto.randomUUID();
    }
}