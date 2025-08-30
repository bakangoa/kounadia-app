import { Executable } from "@/src/shared/core/executable";
import { BusinessRuleViolationError } from "@/src/shared/errors/business-rule-violation.error";
import { NotFoundError } from "@/src/shared/errors/not-found.error";
import { ValidationError } from "@/src/shared/errors/validation.error";
import { LoginRepository } from "../domain/auth.port";
import { CheckOtpRepository, SendOtpRepository } from "../domain/otp.port";
import { CheckUserExistsRepository } from "../domain/user.port";


export interface LoginInput {
    phone: string,
    otp?: string
}

export type LoginOutput = {
    token: string
} | null


export interface LoginUsecaseUtils {
    isPhoneValid(phone: string): boolean
}
export class LoginUsecase implements Executable<LoginInput, LoginOutput> {
    constructor(
        private readonly otpRepository: SendOtpRepository & CheckOtpRepository,
        private readonly checkUserExistsRepository: CheckUserExistsRepository,
        private readonly loginRepository: LoginRepository,
        private readonly utils: LoginUsecaseUtils
    ) { }
    async execute(params: LoginInput): Promise<LoginOutput> {
        const isPhoneValid = this.utils.isPhoneValid(params.phone);
        if (!isPhoneValid) {
            throw new ValidationError("auth.errors.loginPhoneInvalid");
        }

        const isUserExists = await this.checkUserExistsRepository.isExists(params.phone);
        if (!isUserExists) {
            throw new NotFoundError("auth.errors.userNotFound");
        }

        if (!params.otp) {
            await this.otpRepository.send(params.phone);
            return null
        }

        const isOtpValid = await this.otpRepository.check(params.phone, params.otp);
        if (!isOtpValid) {
            throw new BusinessRuleViolationError("auth.errors.otpInvalid");
        }

        const session = await this.loginRepository.login({
            phone: params.phone,
        });

        return {
            token: session.token
        }
    }
}