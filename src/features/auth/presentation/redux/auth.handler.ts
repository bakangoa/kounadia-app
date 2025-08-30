import { routes } from "@/src/shared/constants/routes";
import { Executable } from "@/src/shared/core/executable";
import { Handler } from "@/src/shared/core/handler";
import { ActionHandler } from "@/src/shared/redux/actions-handler";
import { replace } from "@/src/shared/redux/navigation/navigation.action";
import { notifyInfoAction, notifySuccessAction } from "@/src/shared/redux/notifier/notifier.action";
import { LoginInput, LoginOutput } from "../../application/login.usecase";
import { RegisterInput, RegisterOutput } from "../../application/register.usecase";
import { loginAction, registerAction } from "./auth.action";
import { AuthActions } from "./auth.slice";


export class AuthHandler implements Handler<void> {
    constructor(
        private readonly handler: ActionHandler,
        private readonly loginUseCase: Executable<LoginInput, LoginOutput>,
        private readonly registerUseCase: Executable<RegisterInput, RegisterOutput>
    ) {
        this.handler.register(loginAction.type, loginAction);
        this.handler.register(registerAction.type, registerAction);
    }

    private handleLogin() {
        this.handler.on<LoginInput>(loginAction.type, async (payload, api, catcher) => {
            console.info("loginAction", payload);
            if (!payload) {
                return;
            }

            try {
                this.handler.startLoading(loginAction.type, api);
                const result = await this.loginUseCase.execute(payload);
                console.info("result", result);
                if (result === null) {
                    api.dispatch(AuthActions.setLoginPhone(payload.phone));
                    api.dispatch(notifyInfoAction("auth.info.otpSent"));
                    this.handler.succeed(loginAction.type, api);
                    return;
                }

                api.dispatch(AuthActions.setSession({
                    token: result.token
                }));
                console.info("Token set", result.token);
                api.dispatch(notifySuccessAction("auth.success.loginSuccess"));
                api.dispatch(replace({
                    routeName: routes.HOME
                }));
                this.handler.succeed(loginAction.type, api);
            } catch (error) {
                catcher(error);
                this.handler.fail(loginAction.type, api, error);
            }
        });
    }

    private handleRegister() {
        this.handler.on<RegisterInput>(registerAction.type, async (payload, api, catcher) => {
            if (!payload) {
                return;
            }

            try {
                this.handler.startLoading(registerAction.type, api);
                await this.registerUseCase.execute(payload);

                api.dispatch(notifySuccessAction("auth.success.registerSuccess"));
                api.dispatch(replace({
                    routeName: routes.LOGIN
                }));
                this.handler.succeed(registerAction.type, api);
            } catch (error) {
                catcher(error);
                this.handler.fail(registerAction.type, api, error);
            }
        });
    }
    handle(): void {
        this.handleLogin();
        this.handleRegister();
    }
}