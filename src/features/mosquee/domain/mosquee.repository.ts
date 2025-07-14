import { Convenience, Location, Shift } from "./mosquee";

export interface SearchMosqueeParams {
    name?: string;
}

export type MosqueeDTO = {
    id: string;
    name: string;
    location: Location;
    phone: string;
    email?: string;
    website?: string;
    description?: string;
    photos?: string[];
    conveniences?: Partial<Convenience>;
    openingHours: Shift[];
};
export interface MosqueeRepository {
    search(params: SearchMosqueeParams): Promise<MosqueeDTO[]>;
    get(id: string): Promise<MosqueeDTO | null>;
    create(mosquee: MosqueeDTO): Promise<void>;
    update(mosquee: MosqueeDTO): Promise<void>;
    delete(id: string): Promise<void>;
}