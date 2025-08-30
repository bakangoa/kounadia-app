import { Executable } from "@/src/shared/core/executable";
import { CheckUserExistsRepository, CreateUserRepository } from "../domain/user.port";


export interface RegisterInput {
    fullname: string;
    phone: string;
}

export type RegisterOutput = void;

export interface RegisterUsecaseUtils {
    isPhoneValid(phone: string): boolean
}
export class RegisterUsecase implements Executable<RegisterInput, RegisterOutput> {
    constructor(
        private readonly checkUserExistsRepository: CheckUserExistsRepository & CreateUserRepository,
        private readonly utils: RegisterUsecaseUtils
    ) { }
    async execute(params: RegisterInput): Promise<RegisterOutput> {
        const isPhoneValid = this.utils.isPhoneValid(params.phone);
        if (!isPhoneValid) {
            throw new Error("auth.errors.registerPhoneInvalid");
        }

        const isUserExists = await this.checkUserExistsRepository.isExists(params.phone);
        if (isUserExists) {
            throw new Error("auth.errors.userExists");
        }

        const id = this.checkUserExistsRepository.generateId();
        await this.checkUserExistsRepository.create({
            id,
            fullName: params.fullname,
            phone: params.phone
        });
    }
}