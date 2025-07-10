import { Executable } from "@/src/shared/core/executable";
import { PaginatedResult, PaginationParams } from "@/src/shared/core/pagination";
import { Mosquee } from "../domain/mosquee";
import { MosqueeRepository } from "../domain/mosquee.repository";

interface SearchMosqueeInput extends PaginationParams {
    name?: string;
}

type SearchMosqueeOutput = PaginatedResult<Mosquee>;

export class SearchMosqueeUseCase implements Executable<SearchMosqueeInput, SearchMosqueeOutput> {
    constructor(private readonly config: {
        mosqueeRepository: MosqueeRepository;
    }) { }

    async execute(input: SearchMosqueeInput): Promise<SearchMosqueeOutput> {
        const result = await this.config.mosqueeRepository.search({
            name: input.name,
            page: input.page,
            pageSize: input.pageSize
        });

        return {
            items: result.items,
            totalCount: result.totalCount,
            page: input.page ?? 1,
            pageSize: input.pageSize ?? 10,
        };
    }
}