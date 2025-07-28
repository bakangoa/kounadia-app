import { container } from "@/src/di/container";
import { Module } from "@/src/shared/core/module";
import { SharedModule } from "@/src/shared/shared.module";
import { SearchMosqueeUseCase } from "./application/search-mosquee.usecase";
import { FakeMosqueeRepository } from "./infrastructure/fake-mosquee.repository";
import { MosqueeHandler } from "./presentation/redux/mosquee.handler";

export const TOKENS = {
    MosqueeRepository: Symbol('MosqueeRepository'),
    SearchMosquee: Symbol('SearchMosquee'),
    Mosquee: Symbol('Mosquee')
}

export const MosqueeModule: Module = {
    tokens: TOKENS,
    register: () => {
        container.register(TOKENS.MosqueeRepository, () => new FakeMosqueeRepository());
        container.register(TOKENS.SearchMosquee, () => new SearchMosqueeUseCase({
            mosqueeRepository: container.resolve(TOKENS.MosqueeRepository)
        }));
        container.register(TOKENS.Mosquee, () => new MosqueeHandler(container.resolve(SharedModule.tokens!.ActionHandler), container.resolve(TOKENS.SearchMosquee)));
    },
    initialize: () => {
        (container.resolve(TOKENS.Mosquee) as MosqueeHandler).handle();
    }
}