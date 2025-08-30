import i18n from "@/src/locales/i18n";
import { Handler } from "../../core/handler";
import { notifyError, notifyInfo, notifySuccess } from "../../services/notifier.service";
import { ActionHandler } from "../actions-handler";
import { notifyErrorAction, notifyInfoAction, notifySuccessAction } from "./notifier.action";


export class NotifierHandler implements Handler<void> {
    constructor(private readonly handler: ActionHandler) {
        this.handler.register(notifyErrorAction.type, notifyErrorAction);
        this.handler.register(notifyInfoAction.type, notifyInfoAction);
        this.handler.register(notifySuccessAction.type, notifySuccessAction);
    }
    handle(): void {
        this.handler.on<string>(notifyErrorAction.type, (payload) => {
            if (!payload) {
                return;
            }
            const translated = i18n.t(payload, { ns: "notification" });
            notifyError(translated);
        });

        this.handler.on<string>(notifyInfoAction.type, (payload) => {
            if (!payload) {
                return;
            }
            const translated = i18n.t(payload, { ns: "notification" });
            notifyInfo(translated);
        });

        this.handler.on<string>(notifySuccessAction.type, (payload) => {
            if (!payload) {
                return;
            }
            const translated = i18n.t(payload, { ns: "notification" });
            notifySuccess(translated);
        });
    }
}