import { useActionStatus } from "@/src/shared/hooks/use-action-status.hook";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { getMosque } from "../redux/mosque.action";

export function useGetMosque() {
    const dispatch = useAppDispatch();

    const { selectedMosque: mosque } = useAppSelector(state => state.mosque);
    const status = useActionStatus(getMosque.type);

    function get(id: string) {
        dispatch(getMosque({ id }));
    }

    return {
        mosque,
        get,
        ...status
    }
}