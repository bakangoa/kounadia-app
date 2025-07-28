import { container } from "@/src/di/container";
import { AppDispatch, RootState } from "@/src/store";
import { listenerMiddleware } from "@/src/store/listener";
import { ListenerEffectAPI, ListenerMiddlewareInstance, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
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

    protected handleSync =
        <ActionPending, ActionSuccess extends TypeAction, ActionFailure extends TypeAction>(params: {
            key: string,
            keyFormat?: (key: string, args?: any) => string,
            successAction?: (data: any) => ActionSuccess,
            failureAction?: (error: any) => ActionFailure,
            handler: (action: any) => any
        }) =>
            ({
                actionCreator,
            }: {
                actionCreator: (args?: any) => ActionPending;
            }) =>
                listenerMiddleware.startListening({
                    actionCreator: actionCreator as any,
                    effect: async (action, api) => {
                        const { key, successAction, failureAction, handler } = params;

                        const keyToUse = params.keyFormat ? params.keyFormat(key, action) : key;
                        const meta = (api.getState() as RootState).status[keyToUse];
                        if (!this.shouldRefetch(meta)) {
                            // Skip this fetch — still cached
                            return;
                        }
                        api.dispatch(setStatus({ key: keyToUse, status: 'loading' }));
                        try {
                            const result = await handler(action);
                            if (successAction) {
                                api.dispatch(successAction(result));
                            }
                            api.dispatch(setStatus({ key: keyToUse, status: 'success' }));
                        } catch (err: any) {
                            if (failureAction) {
                                api.dispatch(failureAction(err));
                            }
                            api.dispatch(setStatus({ key: keyToUse, status: 'error' }));
                        }
                    },
                });
}

type ListenerAPI = ListenerEffectAPI<unknown, ThunkDispatch<unknown, unknown, UnknownAction>, unknown>
export interface ActionHandler {
    register(key: string, actionCreator: (data: any) => TypeAction): void;
    unregister(key: string): void;
    on<Payload>(key: string, callback: (payload: Payload, api: ListenerAPI) => void): void;
    startLoading(key: string, api: ListenerAPI): void;
    succeed(key: string, api: ListenerAPI, cacheDurationMs?: number): void;
    fail(key: string, api: ListenerAPI, error?: any): void;
    idle(key: string, api: ListenerAPI): void;
    stillCached(key: string, api: ListenerAPI): boolean;
}

export class ListenerActionHandler implements ActionHandler {
    private _registry = new Map<string, (data: any) => TypeAction>();
    constructor(private readonly listener: ListenerMiddlewareInstance<unknown, ThunkDispatch<unknown, unknown, UnknownAction>, unknown>) { }

    register(key: string, actionCreator: (data: any) => TypeAction) {
        this._registry.set(key, actionCreator);
    }

    unregister(key: string) {
        this._registry.delete(key);
    }

    private shouldRefetch(meta: OperationMeta | undefined): boolean {
        if (!meta?.cacheUntil) return true;
        return Date.now() > meta.cacheUntil;
    };

    stillCached(key: string, api: ListenerAPI): boolean {
        const keyToUse = key;
        const meta = (api.getState() as RootState).status[keyToUse];
        if (!this.shouldRefetch(meta)) {
            // Skip this fetch — still cached
            return true;
        }
        return false;
    }
    startLoading(key: string, api: ListenerAPI) {
        api.dispatch(setStatus({ key: key, status: 'loading' }));
    }
    succeed(key: string, api: ListenerAPI, cacheDurationMs?: number) {
        api.dispatch(setStatus({ key, status: 'success', cacheDurationMs: cacheDurationMs }));
    }
    fail(key: string, api: ListenerAPI, error?: any) {
        api.dispatch(setStatus({ key, status: 'error', error }));
    }
    idle(key: string, api: ListenerAPI) {
        api.dispatch(setStatus({ key, status: 'idle' }));
    }

    on<Payload>(
        key: string,
        callback: (payload: Payload, api: ListenerAPI) => void
    ) {
        const actionCreator = this._registry.get(key);
        if (!actionCreator) {
            throw new Error(`Action ${key} is not registered`);
        }

        this.listener.startListening({
            actionCreator: actionCreator as any,
            effect: async (action, api) => {
                callback(action.payload as Payload, api);
            },
        });
    }
}