import { MosqueeModule } from "./features/mosquee/mosquee.module";
import { Module } from "./shared/core/module";
import { SharedModule } from "./shared/shared.module";

export const AppModule: Module = {
    register: () => {
        if (SharedModule.register) SharedModule.register();
        if (MosqueeModule.register) MosqueeModule.register();
    },
    initialize: () => {
        if (SharedModule.initialize) SharedModule.initialize();
        if (MosqueeModule.initialize) MosqueeModule.initialize();
    }
};