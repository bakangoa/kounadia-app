import { GetSnapshot } from "@/src/shared/core/entity";
import { Executable } from "@/src/shared/core/executable";
import { LocationRepository } from "../domain/location.repository";
import { Mosque } from "../domain/mosque";
import { MosqueRepository } from "../domain/mosque.repository";

export interface GetMosqueInput {
    id: string
};

export type GetMosqueOutput = GetSnapshot<Mosque> & {
    isOpen: boolean;
    openCloseHour: string;
    distance: number
} | null;

export class GetMosqueUsecase implements Executable<GetMosqueInput, GetMosqueOutput> {
    constructor(
        private mosqueRepository: MosqueRepository,
        private locationRepository: LocationRepository
    ) { }

    async execute(input: GetMosqueInput): Promise<GetMosqueOutput> {
        const mosqueDTO = await this.mosqueRepository.get(input.id);
        if (!mosqueDTO) {
            return null;
        }

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
        const now = new Date();
        const openCloseHour = mosque.isOpen(now) ? mosque.nextCloseDateTime() : mosque.nextOpenDateTime();
        if (!openCloseHour) {
            return null;
        }

        const location = await this.locationRepository.getCurrentLocation();
        const distance = mosque.distanceFrom({
            latitude: location.latitude || 0,
            longitude: location.longitude || 0
        });

        return {
            id: mosqueDTO.id,
            name: mosqueDTO.name,
            location: mosqueDTO.location,
            phone: mosqueDTO.phone,
            email: mosqueDTO.email,
            website: mosqueDTO.website,
            description: mosqueDTO.description,
            photos: mosqueDTO.photos,
            conveniences: mosqueDTO.conveniences,
            openingHours: mosqueDTO.openingHours,
            isOpen: mosque.isOpen(now),
            openCloseHour: `${openCloseHour!.getHours().toString().padStart(2, '0')}:${openCloseHour!.getMinutes().toString().padStart(2, '0')}`,
            distance
        };
    }
}