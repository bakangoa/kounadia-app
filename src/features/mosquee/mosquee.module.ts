import { container } from "@/src/di/container";
import { SearchMosqueeUseCase } from "./application/search-mosquee.usecase";
import { FakeMosqueeRepository } from "./infrastructure/fake-mosquee.repository";
import { MosqueeController } from "./presentation/redux/mosquee.controller";

export const TOKENS = {
    MosqueeRepository: Symbol('MosqueeRepository'),
    SearchMosquee: Symbol('SearchMosquee'),
}

export const MosqueeModule = {
    tokens: TOKENS,
    controller: new MosqueeController(),
    register: () => {
        container.register(TOKENS.MosqueeRepository, () => new FakeMosqueeRepository());
        container.register(TOKENS.SearchMosquee, () => new SearchMosqueeUseCase({
            mosqueeRepository: container.resolve(TOKENS.MosqueeRepository)
        }));
    }
}