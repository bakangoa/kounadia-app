import { useActionStatus } from "@/src/shared/hooks/use-action-status.hook";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { getSessionAction } from "../redux/auth.action";


export function useAuth() {
    const session = useAppSelector((state) => state.auth.session);
    const checkStatus = useActionStatus(getSessionAction.type);
    const dispatch = useAppDispatch();

    function checkIfAuthenticated() {
        dispatch(getSessionAction());
    }

    return {
        isAuthenticated: !!session,
        checkIfAuthenticated,
        isChecked: checkStatus.isSuccess || checkStatus.isError,
        isLoading: checkStatus.isLoading
    };
}