import { handleAsync } from "@/src/shared/redux/actions-handler";
import { TOKENS } from "../../mosquee.module";
import { searchMosquee, searchMosqueeAction } from "./mosquee.action";
import { mosqueeActions } from "./mosquee.slice";


handleAsync({
    key: searchMosqueeAction,
    useCaseToken: TOKENS.SearchMosquee,
    successAction: mosqueeActions.setFoundMosquees,
    handler: (useCase, action) => {
        console.info("SearchMosqueeHandler", action);
        return useCase.execute(action.payload);
    },
})({ actionCreator: searchMosquee });