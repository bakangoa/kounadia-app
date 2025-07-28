import { container } from "../di/container";
import { listenerMiddleware } from "../store/listener";
import { Module } from "./core/module";
import { ListenerActionHandler } from "./redux/actions-handler";
import { NavigationHandler } from "./redux/navigation/navigation.handler";

const TOKENs = {
    ListenerMiddleware: Symbol('ListenerMiddleware'),
    ActionHandler: Symbol('ActionHandler'),
    Navigation: Symbol('Navigation')
}

export const SharedModule: Module = {
    tokens: TOKENs,
    register: () => {
        container.register(TOKENs.ListenerMiddleware, () => listenerMiddleware);
        container.register(TOKENs.ActionHandler, () => new ListenerActionHandler(container.resolve(TOKENs.ListenerMiddleware)));
        container.register(TOKENs.Navigation, () => new NavigationHandler(container.resolve(TOKENs.ActionHandler)));
    },
    initialize: () => {
        (container.resolve(TOKENs.Navigation) as NavigationHandler).handle();
    }
}