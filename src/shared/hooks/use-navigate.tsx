import { useDispatch } from "react-redux";
import { routes } from "../constants/routes";
import { back, forward, replace } from "../redux/navigation/navigation.action";


export function useNavigate() {
    const dispatch = useDispatch();

    function navigateToHome() {
        dispatch(replace({
            routeName: routes.HOME
        }));
    }

    function navigateToAdd() {
        dispatch(replace({
            routeName: routes.ADD
        }));
    }

    function navigateToAddForm() {
        dispatch(forward({
            routeName: routes.ADD_FORM
        }));
    }

    function navigateToMosqueDetails(id: string) {
        dispatch(forward({
            routeName: routes.MOSQUE_DETAILS,
            params: {
                id
            }
        }));
    }

    function navigateBack() {
        dispatch(back());
    }

    function navigateToLogin() {
        dispatch(forward({
            routeName: routes.LOGIN
        }));
    }

    function navigateToRegister() {
        dispatch(forward({
            routeName: routes.REGISTER
        }));
    }

    return {
        navigateBack,
        navigateToHome,
        navigateToAdd,
        navigateToAddForm,
        navigateToMosqueDetails,
        navigateToLogin,
        navigateToRegister
    }
}