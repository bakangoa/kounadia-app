

export class StringUtils {
    generateUniqueId(): string {
        return crypto.randomUUID();
    }

    isPhoneValid(phone: string): boolean {
        const regex = /^[0-9]{10}$/;
        return regex.test(phone);
    }
}