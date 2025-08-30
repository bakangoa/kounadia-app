import { container } from "../di/container";
import { listenerMiddleware } from "../store/listener";
import { Module } from "./core/module";
import { DomainErrorFilter } from "./errors/domain-error.handler";
import { ListenerActionHandler } from "./redux/actions-handler";
import { NavigationHandler } from "./redux/navigation/navigation.handler";
import { NotifierHandler } from "./redux/notifier/notifier.handler";
import { RemoteLogger } from "./services/logger.service";
import { StringUtils } from "./utils/string.utils";

const TOKENs = {
    ListenerMiddleware: Symbol('ListenerMiddleware'),
    ActionHandler: Symbol('ActionHandler'),
    Navigation: Symbol('Navigation'),
    Notifier: Symbol('Notifier'),
    StringUtils: Symbol('StringUtils'),
    Logger: Symbol('Logger')
}

export const SharedModule: Module = {
    tokens: TOKENs,
    register: () => {
        container.register(TOKENs.Logger, () => new RemoteLogger());
        const errorHandler = new DomainErrorFilter(container.resolve(TOKENs.Logger));
        container.register(TOKENs.ListenerMiddleware, () => listenerMiddleware);
        container.register(TOKENs.ActionHandler, () => new ListenerActionHandler(container.resolve(TOKENs.ListenerMiddleware), errorHandler));
        container.register(TOKENs.Navigation, () => new NavigationHandler(container.resolve(TOKENs.ActionHandler)));
        container.register(TOKENs.Notifier, () => new NotifierHandler(container.resolve(TOKENs.ActionHandler)));
        container.register(TOKENs.StringUtils, () => new StringUtils());
    },
    initialize: () => {
        (container.resolve(TOKENs.Navigation) as NavigationHandler).handle();
        (container.resolve(TOKENs.Notifier) as NotifierHandler).handle();
    }
}