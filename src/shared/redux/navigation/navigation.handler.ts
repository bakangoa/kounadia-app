import { Href, router } from "expo-router";
import { Handler } from "../../core/handler";
import { ActionHandler } from "../actions-handler";
import { back, BackAction, forward, ForwardAction, NavigateForwardPayload, NavigateReplacePayload, replace, ReplaceAction } from "./navigation.action";


export class NavigationHandler implements Handler<void> {
    constructor(private readonly handler: ActionHandler) {
        this.handler.register(ReplaceAction, replace);
        this.handler.register(BackAction, back);
        this.handler.register(ForwardAction, forward);
    }
    private buildRoute(
        routeTemplate: string | Href,
        params: Record<string, string | number | undefined>
    ): Href | null {
        const dynamicSegmentRegex = /\[(\w+)\]/g;

        let hasMissing = false;

        const route = (routeTemplate as string).replace(dynamicSegmentRegex, (_, key) => {
            const value = params?.[key];
            if (value === undefined || value === null) {
                console.error(`❌ Missing route param: [${key}]`);
                hasMissing = true;
                return `[${key}]`; // keep it as-is
            }
            return encodeURIComponent(String(value));
        });

        return hasMissing ? null : (route as Href);
    }
    handle(): void {
        this.handler.on<NavigateReplacePayload>(ReplaceAction, (payload) => {
            if (!payload) {
                return;
            }
            const { routeName, params } = payload;
            router.replace(routeName, params);
        });

        this.handler.on<NavigateForwardPayload>(ForwardAction, (payload) => {
            if (!payload) {
                return;
            }
            const { routeName, params } = payload;
            console.info("Navigating forward to", {
                routeName,
                params
            })

            let route = this.buildRoute(routeName, params ?? {});
            if (!route) {
                // Handle gracefully: show toast, fallback route, etc.
                console.warn("Navigation cancelled due to missing parameters.");
                return;
            }

            router.push(route);
        });

        this.handler.on(BackAction, () => {
            router.back();
        });
    }
}