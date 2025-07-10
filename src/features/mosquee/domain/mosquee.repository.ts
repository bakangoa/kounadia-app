import { PaginatedResult, PaginationParams } from "@/src/shared/core/pagination";
import { Mosquee } from "./mosquee";

export interface SearchMosqueeParams extends PaginationParams {
    name?: string;
}

export type MosqueeDTO = Mosquee;
export interface MosqueeRepository {
    search(params: SearchMosqueeParams): Promise<PaginatedResult<MosqueeDTO>>;
    get(id: string): Promise<MosqueeDTO | null>;
    create(mosquee: MosqueeDTO): Promise<void>;
    update(mosquee: MosqueeDTO): Promise<void>;
    delete(id: string): Promise<void>;
}