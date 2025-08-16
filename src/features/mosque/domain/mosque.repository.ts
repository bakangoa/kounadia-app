import { Convenience, Location, Shift } from "./mosque";


export interface SearchMosqueParams {
    name?: string;
}

export type MosqueDTO = {
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
export interface MosqueRepository {
    search(params: SearchMosqueParams): Promise<MosqueDTO[]>;
    get(id: string): Promise<MosqueDTO | null>;
    create(mosque: MosqueDTO): Promise<void>;
    update(mosque: MosqueDTO): Promise<void>;
    delete(id: string): Promise<void>;
}