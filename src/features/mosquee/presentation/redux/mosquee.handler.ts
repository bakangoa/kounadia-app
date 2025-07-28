import { Executable } from "@/src/shared/core/executable";
import { Handler } from "@/src/shared/core/handler";
import { ActionHandler } from "@/src/shared/redux/actions-handler";
import { SearchMosqueeInput, SearchMosqueeOutput } from "../../application/search-mosquee.usecase";
import { searchMosquee, searchMosqueeAction } from "./mosquee.action";
import { mosqueeActions } from "./mosquee.slice";


export class MosqueeHandler implements Handler<void> {
    constructor(
        private readonly handler: ActionHandler,
        private readonly searchUseCase: Executable<SearchMosqueeInput, SearchMosqueeOutput>
    ) {
        this.handler.register(searchMosqueeAction, searchMosquee);
    }
    handle(data: void): void {
        this.handler.on<SearchMosqueeInput>(searchMosqueeAction, async (payload, api) => {
            if (!payload) {
                return;
            }

            try {
                this.handler.startLoading(searchMosqueeAction, api);
                if (this.handler.stillCached(searchMosqueeAction, api)) {
                    this.handler.succeed(searchMosqueeAction, api);
                    return;
                }
                console.info("SearchMosqueeHandler", payload);
                const result = await this.searchUseCase.execute(payload);

                api.dispatch(mosqueeActions.setFoundMosquees(result));
                this.handler.succeed(searchMosqueeAction, api, 50000);
            } catch (error) {
                this.handler.fail(searchMosqueeAction, api, error);
            }
        });
    }
}