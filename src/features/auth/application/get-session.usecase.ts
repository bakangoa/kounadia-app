import { Executable } from "@/src/shared/core/executable";
import { Session } from "../domain/models/session.model";
import { GetSessionRepository } from "../domain/ports/auth.port";


export type GetSessionInput = void;
export type GetSessionOutput = Session | null;


export class GetSessionUsecase implements Executable<GetSessionInput, GetSessionOutput> {
    constructor(private readonly repository: GetSessionRepository) { }
    async execute(): Promise<GetSessionOutput> {
        return await this.repository.getSession();
    }
}