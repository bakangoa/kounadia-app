import { AuthModule } from "./features/auth/auth.module";
import { MosqueModule } from "./features/mosque/mosque.module";
import { Module } from "./shared/core/module";
import { SharedModule } from "./shared/shared.module";

export const AppModule: Module = {
    register: () => {
        if (SharedModule.register) SharedModule.register();
        if (MosqueModule.register) MosqueModule.register();
        if (AuthModule.register) AuthModule.register();
    },
    initialize: () => {
        if (SharedModule.initialize) SharedModule.initialize();
        if (MosqueModule.initialize) MosqueModule.initialize();
        if (AuthModule.initialize) AuthModule.initialize();
    }
};