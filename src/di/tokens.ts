import { MosqueeModule } from "../features/mosquee/mosquee.module";

export const TOKENS = {
    UserRepository: Symbol('UserRepository'),
    GetUser: Symbol('GetUser'),
    ...MosqueeModule.tokens
};