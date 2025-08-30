import { Executable } from "@/src/shared/core/executable";
import { Handler } from "@/src/shared/core/handler";
import { ActionHandler } from "@/src/shared/redux/actions-handler";
import { RootState } from "@/src/store";
import { GetMosqueInput, GetMosqueOutput } from "../../application/get-mosque.usecase";
import { SearchMosqueInput, SearchMosqueOutput } from "../../application/search-mosque.usecase";
import { getMosque, searchMosque, searchMosqueAction } from "./mosque.action";
import { mosqueActions } from "./mosque.slice";


export class MosqueHandler implements Handler<void> {
    constructor(
        private readonly handler: ActionHandler,
        private readonly searchUseCase: Executable<SearchMosqueInput, SearchMosqueOutput>,
        private readonly getUseCase: Executable<GetMosqueInput, GetMosqueOutput>
    ) {
        this.handler.register(searchMosqueAction, searchMosque);
        this.handler.register(getMosque.type, getMosque);
    }

    private handleSearch() {
        this.handler.on<SearchMosqueInput>(searchMosqueAction, async (payload, api) => {
            if (!payload) {
                return;
            }

            try {
                this.handler.startLoading(searchMosqueAction, api);
                if (this.handler.stillCached(searchMosqueAction, api)) {
                    this.handler.succeed(searchMosqueAction, api);
                    return;
                }
                const result = await this.searchUseCase.execute(payload);

                api.dispatch(mosqueActions.setFoundMosques(result));
                this.handler.succeed(searchMosqueAction, api, 50000);
            } catch (error) {
                this.handler.fail(searchMosqueAction, api, error);
            }
        });
    }
    private handleGet() {
        this.handler.on<GetMosqueInput>(getMosque.type, async (payload, api) => {
            if (!payload) {
                return;
            }
            try {
                this.handler.startLoading(getMosque.type, api);
                const lastId = (api.getState() as RootState).mosque.selectedMosqueId;
                if (payload.id === lastId && this.handler.stillCached(getMosque.type, api)) {
                    this.handler.succeed(getMosque.type, api);
                    return;
                }
                const result = await this.getUseCase.execute(payload);
                api.dispatch(mosqueActions.setSelectedMosqueId(payload.id));
                api.dispatch(mosqueActions.setSelectedMosque(result));
                this.handler.succeed(getMosque.type, api, 50000);
            } catch (error) {
                this.handler.fail(getMosque.type, api, error);
            }
        })
    }
    handle(data: void): void {
        this.handleSearch();
        this.handleGet();
    }
}