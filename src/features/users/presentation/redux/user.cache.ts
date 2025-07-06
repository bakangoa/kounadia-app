import { registerCache } from "@/src/shared/redux/cache-registry";
import { breakKey } from "@/src/shared/utils/build-key.utils";
import { userActions } from "./user.slice";

export const FETCH_USER_CACHE_DURATION_MS = 30000;

registerCache(
    key => key.startsWith('users:'),
    (key, store) => {
        const id = breakKey(key).params;
        store.dispatch(userActions.removeUser({ id }));
    },
    FETCH_USER_CACHE_DURATION_MS
);