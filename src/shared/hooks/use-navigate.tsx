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

    function navigateBack() {
        dispatch(back());
    }

    return {
        navigateBack,
        navigateToHome,
        navigateToAdd,
        navigateToAddForm
    }
}