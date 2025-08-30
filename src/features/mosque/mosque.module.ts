import { container } from "@/src/di/container";
import { Module } from "@/src/shared/core/module";
import { SharedModule } from "@/src/shared/shared.module";
import { GetMosqueUsecase } from "./application/get-mosque.usecase";
import { SearchMosqueUseCase } from "./application/search-mosque.usecase";
import { FakeMosqueRepository } from "./infrastructure/fake-mosque.repository";
import { GeoLocationRepository } from "./infrastructure/geo-location.repository";
import { MosqueHandler } from "./presentation/redux/mosque.handler";

export const TOKENS = {
    SearchMosque: Symbol('SearchMosque'),
    Mosque: Symbol('Mosque')
}

export const MosqueModule: Module = {
    tokens: TOKENS,
    register: () => {
        const mosqueRepo = new FakeMosqueRepository();
        const locationRepo = new GeoLocationRepository();

        const searchUsecase = new SearchMosqueUseCase({
            mosqueRepository: mosqueRepo
        });
        const getUsecase = new GetMosqueUsecase(
            mosqueRepo,
            locationRepo
        );
        
        container.register(TOKENS.Mosque, () => new MosqueHandler(
            container.resolve(SharedModule.tokens!.ActionHandler),
            searchUsecase,
            getUsecase
        ));
    },
    initialize: () => {
        (container.resolve(TOKENS.Mosque) as MosqueHandler).handle();
    }
}