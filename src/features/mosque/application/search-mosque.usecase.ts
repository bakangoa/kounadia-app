import { Executable } from "@/src/shared/core/executable";
import { PaginatedResult, PaginationParams } from "@/src/shared/core/pagination";
import { Mosque } from "../domain/mosque";
import { MosqueRepository } from "../domain/mosque.repository";

export interface SearchMosqueInput extends PaginationParams {
    location?: {
        latitude: number;
        longitude: number;
    };
    name?: string;
}

export interface SearchMosqueItem {
    id: string;
    photos: string[];
    name: string;
    locations: {
        latitude: number;
        longitude: number;
        altitude: number;
    }
    distance: number; // Distance in meters
    isOpen: boolean;
    openCloseHour: string;
}

export type SearchMosqueOutput = PaginatedResult<SearchMosqueItem>;

export class SearchMosqueUseCase implements Executable<SearchMosqueInput, SearchMosqueOutput> {
    constructor(private readonly config: {
        mosqueRepository: MosqueRepository;
    }) { }

    async execute(input: SearchMosqueInput): Promise<SearchMosqueOutput> {
        const dtos = await this.config.mosqueRepository.search({
            name: input.name,
        });

        let mosques: Mosque[] = dtos.map(mosqueDTO => {
            const mosque = new Mosque({
                id: mosqueDTO.id,
                name: mosqueDTO.name,
                location: mosqueDTO.location,
                phone: mosqueDTO.phone,
                email: mosqueDTO.email,
                website: mosqueDTO.website,
                description: mosqueDTO.description,
                photos: mosqueDTO.photos || [],
                conveniences: mosqueDTO.conveniences || {},
                openingHours: mosqueDTO.openingHours || []
            });
            return mosque;
        });

        if (input.location) {
            mosques = mosques.sort((a, b) => b.distanceFrom({
                latitude: input.location?.latitude || 0,
                longitude: input.location?.longitude || 0
            }) - a.distanceFrom({
                latitude: input.location?.latitude || 0,
                longitude: input.location?.longitude || 0
            }));
        }

        const now = new Date();

        const results = mosques.map(mosque => {
            const snapshot = mosque.snapshot();
            const distance = mosque.distanceFrom({
                latitude: input.location?.latitude || 0,
                longitude: input.location?.longitude || 0
            });
            const openCloseHour = mosque.isOpen(now) ? mosque.nextCloseDateTime() : mosque.nextOpenDateTime();
            if (!openCloseHour) {
                return null;
            }
            return {
                id: snapshot.id,
                photos: snapshot.photos || [],
                name: snapshot.name,
                locations: {
                    latitude: snapshot.location.latitude,
                    longitude: snapshot.location.longitude,
                    altitude: snapshot.location.altitude,
                },
                distance,
                isOpen: mosque.isOpen(new Date()),
                openCloseHour: `${openCloseHour!.getHours().toString().padStart(2, '0')}:${openCloseHour!.getMinutes().toString().padStart(2, '0')}`,
            };
        });

        // Paginate the results
        let start = (input.page ?? 1 - 1) * (input.pageSize ?? 10);
        let end = start + (input.pageSize ?? 10);
        if (end > results.length) {
            end = results.length;
        }

        const paginatedItems = results.slice(start, end);

        return {
            items: paginatedItems.filter((item) => item !== null) as SearchMosqueItem[],
            totalCount: results.length,
            page: input.page ?? 1,
            pageSize: input.pageSize ?? 10,
        };
    }
}