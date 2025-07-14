import { Executable } from "@/src/shared/core/executable";
import { PaginatedResult, PaginationParams } from "@/src/shared/core/pagination";
import { Mosquee } from "../domain/mosquee";
import { MosqueeRepository } from "../domain/mosquee.repository";

export interface SearchMosqueeInput extends PaginationParams {
    location?: {
        latitude: number;
        longitude: number;
    };
    name?: string;
}

export interface SearchMosqueeItem {
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

export type SearchMosqueeOutput = PaginatedResult<SearchMosqueeItem>;

export class SearchMosqueeUseCase implements Executable<SearchMosqueeInput, SearchMosqueeOutput> {
    constructor(private readonly config: {
        mosqueeRepository: MosqueeRepository;
    }) { }

    async execute(input: SearchMosqueeInput): Promise<SearchMosqueeOutput> {
        console.log("Executing SearchMosqueeUseCase with input:", input);
        const dtos = await this.config.mosqueeRepository.search({
            name: input.name,
        });

        let mosquees: Mosquee[] = dtos.map(mosqueeDTO => {
            const mosquee = new Mosquee({
                id: mosqueeDTO.id,
                name: mosqueeDTO.name,
                location: mosqueeDTO.location,
                phone: mosqueeDTO.phone,
                email: mosqueeDTO.email,
                website: mosqueeDTO.website,
                description: mosqueeDTO.description,
                photos: mosqueeDTO.photos || [],
                conveniences: mosqueeDTO.conveniences || {},
                openingHours: mosqueeDTO.openingHours || []
            });
            return mosquee;
        });

        if (input.location) {
            mosquees = mosquees.sort((a, b) => b.distanceFrom({
                latitude: input.location?.latitude || 0,
                longitude: input.location?.longitude || 0
            }) - a.distanceFrom({
                latitude: input.location?.latitude || 0,
                longitude: input.location?.longitude || 0
            }));
        }

        const now = new Date();

        const results = mosquees.map(mosquee => {
            const snapshot = mosquee.snapshot();
            const distance = mosquee.distanceFrom({
                latitude: input.location?.latitude || 0,
                longitude: input.location?.longitude || 0
            });
            const openCloseHour = mosquee.isOpen(now) ? mosquee.nextCloseDateTime() : mosquee.nextOpenDateTime();
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
                isOpen: mosquee.isOpen(new Date()),
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
            items: paginatedItems,
            totalCount: results.length,
            page: input.page ?? 1,
            pageSize: input.pageSize ?? 10,
        };
    }
}