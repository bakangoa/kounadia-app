import { container } from "@/src/di/container";
import { AppDispatch, RootState } from "@/src/store";
import { listenerMiddleware } from "@/src/store/listener";
import { Executable } from "../core/executable";
import { OperationMeta, setStatus } from "./status-manager.slice";

const shouldRefetch = (meta: OperationMeta | undefined): boolean => {
    if (!meta?.cacheUntil) return true;
    return Date.now() > meta.cacheUntil;
};

type TypeAction = Parameters<AppDispatch>[0];
export const handleAsync =
    <ActionPending, ActionSuccess extends TypeAction, ActionFailure extends TypeAction, UseCase extends Executable<unknown, unknown>>(params: {
        key: string,
        cacheDurationMs?: number,
        keyFormat?: (key: string, args?: any) => string,
        useCaseToken: symbol,
        successAction: (data: any) => ActionSuccess,
        failureAction?: (error: any) => ActionFailure,
        handler: (useCase: UseCase, action: any) => Promise<any>
    }) =>
        ({
            actionCreator,
        }: {
            actionCreator: (args?: any) => ActionPending;
        }) =>
            listenerMiddleware.startListening({
                actionCreator: actionCreator as any,
                effect: async (action, api) => {
                    const { key, useCaseToken, successAction, failureAction, handler } = params;

                    const keyToUse = params.keyFormat ? params.keyFormat(key, action) : key;
                    const meta = (api.getState() as RootState).status[keyToUse];
                    console.info("handleAsync effect", keyToUse, action, meta);
                    if (!shouldRefetch(meta)) {
                        // Skip this fetch — still cached
                        return;
                    }
                    api.dispatch(setStatus({ key: keyToUse, status: 'loading' }));
                    try {
                        const useCase = container.resolve<UseCase>(useCaseToken);
                        const result = await handler(useCase, action);
                        api.dispatch(successAction(result));
                        api.dispatch(setStatus({ key: keyToUse, status: 'success', cacheDurationMs: params.cacheDurationMs }));
                    } catch (err: any) {
                        if (failureAction) {
                            api.dispatch(failureAction(err));
                        }
                        api.dispatch(setStatus({ key: keyToUse, status: 'error' }));
                    }
                },
            });


export class Controller {

    private shouldRefetch(meta: OperationMeta | undefined): boolean {
        if (!meta?.cacheUntil) return true;
        return Date.now() > meta.cacheUntil;
    };

    protected handleAsync =
        <ActionPending, ActionSuccess extends TypeAction, ActionFailure extends TypeAction, UseCase extends Executable<unknown, unknown>>(params: {
            key: string,
            cacheDurationMs?: number,
            keyFormat?: (key: string, args?: any) => string,
            useCaseToken: symbol,
            successAction: (data: any) => ActionSuccess,
            failureAction?: (error: any) => ActionFailure,
            handler: (useCase: UseCase, action: any) => Promise<any>
        }) =>
            ({
                actionCreator,
            }: {
                actionCreator: (args?: any) => ActionPending;
            }) =>
                listenerMiddleware.startListening({
                    actionCreator: actionCreator as any,
                    effect: async (action, api) => {
                        const { key, useCaseToken, successAction, failureAction, handler } = params;

                        const keyToUse = params.keyFormat ? params.keyFormat(key, action) : key;
                        const meta = (api.getState() as RootState).status[keyToUse];
                        console.info("handleAsync effect", keyToUse, action, meta);
                        if (!this.shouldRefetch(meta)) {
                            // Skip this fetch — still cached
                            return;
                        }
                        api.dispatch(setStatus({ key: keyToUse, status: 'loading' }));
                        try {
                            const useCase = container.resolve<UseCase>(useCaseToken);
                            const result = await handler(useCase, action);
                            api.dispatch(successAction(result));
                            api.dispatch(setStatus({ key: keyToUse, status: 'success', cacheDurationMs: params.cacheDurationMs }));
                        } catch (err: any) {
                            if (failureAction) {
                                api.dispatch(failureAction(err));
                            }
                            api.dispatch(setStatus({ key: keyToUse, status: 'error' }));
                        }
                    },
                });
}