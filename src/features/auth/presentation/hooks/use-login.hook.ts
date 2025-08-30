
import { useActionStatus } from "@/src/shared/hooks/use-action-status.hook";
import { notifyErrorAction } from "@/src/shared/redux/notifier/notifier.action";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { loginAction } from "../redux/auth.action";


export function useLogin() {
    const loginPhone = useAppSelector(state => state.auth.loginPhone);
    const status = useActionStatus(loginAction.type);
    const dispatch = useAppDispatch();

    function tryLogin(phone: string) {
        dispatch(loginAction({
            phone
        }));
    }

    function login(otp: string) {
        if (!loginPhone) {
            dispatch(notifyErrorAction("auth.errors.loginPhoneRequired"))
            return;
        }
        dispatch(loginAction({
            phone: loginPhone,
            otp
        }));
    }

    return {
        tryLogin,
        login,
        isLoading: status.isLoading,
        isSuccess: status.isSuccess
    }
}