
// Register handlers

import { TOKENS } from "@/src/di/tokens";
import { handleAsync } from "@/src/shared/redux/actions-handler";
import { buildKey } from "@/src/shared/utils/build-key.utils";
import { fetchUser } from "./user.action";
import { FETCH_USER_CACHE_DURATION_MS } from "./user.cache";
import { userActions } from "./user.slice";

handleAsync({
    key: 'users',
    cacheDurationMs: FETCH_USER_CACHE_DURATION_MS,
    keyFormat: (key, action) => buildKey(key, action.payload.id),
    useCaseToken: TOKENS.GetUser,
    successAction: userActions.storeUser,
    handler: (useCase, action) => useCase.execute(action.payload.id),
})({ actionCreator: fetchUser });