export interface SendOtpRepository {
    send(phone: string): Promise<void>
}

export interface CheckOtpRepository {
    check(phone: string, otp: string): Promise<boolean>
}

export interface OtpRepository extends SendOtpRepository, CheckOtpRepository { }