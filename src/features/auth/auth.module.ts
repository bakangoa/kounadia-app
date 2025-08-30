import { container } from "@/src/di/container";
import { Module } from "@/src/shared/core/module";
import { supabase } from "@/src/shared/services/supabase.service";
import { SharedModule } from "@/src/shared/shared.module";
import { StringUtils } from "@/src/shared/utils/string.utils";
import { LoginUsecase } from "./application/login.usecase";
import { RegisterUsecase } from "./application/register.usecase";
import { FakeOtpRepository } from "./infrastructure/fake-otp.repository";
import { SupabaseAuthRepository } from "./infrastructure/supabase-auth.repository";
import { SupabaseUserRepository } from "./infrastructure/supabase-user.repository";
import { AuthHandler } from "./presentation/redux/auth.handler";

export const TOKENS = {
    SearchAuth: Symbol('SearchAuth'),
    Auth: Symbol('Auth')
}

export const AuthModule: Module = {
    tokens: TOKENS,
    register: () => {
        const otpRepo = new FakeOtpRepository();
        const userRepo = new SupabaseUserRepository(supabase);
        const authRepo = new SupabaseAuthRepository(supabase);

        const utils = container.resolve(SharedModule.tokens!.StringUtils) as StringUtils;

        const loginUsecase = new LoginUsecase(
            otpRepo,
            userRepo,
            authRepo,
            {
                isPhoneValid: utils.isPhoneValid
            }
        );

        const registerUsecase = new RegisterUsecase(
            userRepo,
            {
                isPhoneValid: utils.isPhoneValid
            }
        );

        container.register(TOKENS.Auth, () => new AuthHandler(
            container.resolve(SharedModule.tokens!.ActionHandler),
            loginUsecase,
            registerUsecase
        ));
    },
    initialize: () => {
        (container.resolve(TOKENS.Auth) as AuthHandler).handle();
    }
}