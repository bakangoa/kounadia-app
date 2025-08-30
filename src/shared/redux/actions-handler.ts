
import { AppDispatch, RootState } from "@/src/store";
import { ListenerEffectAPI, ListenerMiddlewareInstance, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { DomainErrorFilter } from "../errors/domain-error.handler";
import { notifyErrorAction } from "./notifier/notifier.action";
import { OperationMeta, setStatus } from "./status-manager.slice";

type TypeAction = Parameters<AppDispatch>[0];

type ListenerAPI = ListenerEffectAPI<unknown, ThunkDispatch<unknown, unknown, UnknownAction>, unknown>
export interface ActionHandler {
    register(key: string, actionCreator: (data: any) => TypeAction): void;
    unregister(key: string): void;
    on<Payload>(key: string, callback: (payload: Payload, api: ListenerAPI, errorHandler: (error: any) => void) => void): void;
    startLoading(key: string, api: ListenerAPI): void;
    succeed(key: string, api: ListenerAPI, cacheDurationMs?: number): void;
    fail(key: string, api: ListenerAPI, error?: any): void;
    idle(key: string, api: ListenerAPI): void;
    stillCached(key: string, api: ListenerAPI): boolean;
}

export class ListenerActionHandler implements ActionHandler {
    private _registry = new Map<string, (data: any) => TypeAction>();
    constructor(
        private readonly listener: ListenerMiddlewareInstance<unknown, ThunkDispatch<unknown, unknown, UnknownAction>, unknown>,
        private readonly errorHandler: DomainErrorFilter
    ) { }

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
        console.info("Action started", key);
    }
    succeed(key: string, api: ListenerAPI, cacheDurationMs?: number) {
        api.dispatch(setStatus({ key, status: 'success', cacheDurationMs: cacheDurationMs }));
        console.info("Action succeeded", key);
    }
    fail(key: string, api: ListenerAPI, error?: any) {
        api.dispatch(setStatus({ key, status: 'error', error }));
        console.error("Action failed", key, error);
    }
    idle(key: string, api: ListenerAPI) {
        api.dispatch(setStatus({ key, status: 'idle' }));
        console.info("Action idle", key);
    }

    on<Payload>(
        key: string,
        callback: (payload: Payload, api: ListenerAPI, errorHandler: (error: any) => void) => void
    ) {
        const actionCreator = this._registry.get(key);
        if (!actionCreator) {
            throw new Error(`Action ${key} is not registered`);
        }

        this.listener.startListening({
            actionCreator: actionCreator as any,
            effect: async (action, api) => {
                console.info("ListenerActionHandler", action.type, action.payload);
                callback(action.payload as Payload, api, (error) => {
                    const message = this.errorHandler.catch(error);
                    if (message) {
                        api.dispatch(notifyErrorAction(message));
                    }
                });
            },
        });
    }
}