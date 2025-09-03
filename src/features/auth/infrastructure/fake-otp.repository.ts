import { OtpRepository } from "../domain/ports/otp.port";


export class FakeOtpRepository implements OtpRepository {
    async send(phone: string): Promise<void> {
        return;
    }
    async check(phone: string, otp: string): Promise<boolean> {
        return true;
    }
}