import { useActionStatus } from "@/src/shared/hooks/use-action-status.hook";
import { useAppDispatch } from "@/src/store";
import { RegisterInput } from "../../application/register.usecase";
import { registerAction } from "../redux/auth.action";


export function useRegister() {
    const dispatch = useAppDispatch();
    const registerStatus = useActionStatus(registerAction.type);

    function register(params: RegisterInput) {
        dispatch(registerAction(params));
    }

    return {
        register,
        isLoading: registerStatus.isLoading,
    };
}