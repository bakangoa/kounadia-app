import { Executable } from "@/src/shared/core/executable"
import { StringUtils } from "@/src/shared/utils/string.utils"
import { Mosque, Shift } from "../domain/mosque"
import { MosqueRepository } from "../domain/mosque.repository"


interface CreateMosqueInput {
    name: string
    location: {
        latitude: number,
        longitude: number,
        altitude: number,
        address: string
    }
    phone: string
    email?: string
    website?: string
    description?: string
    photos?: string[]
    openingHours: Shift[]
}

type CreateMosqueOutput = Mosque;

export class CreateMosqueUseCase implements Executable<CreateMosqueInput, CreateMosqueOutput> {
    constructor(private readonly config: {
        mosqueRepository: MosqueRepository
        strUtils: StringUtils
    }) { }

    async execute(input: CreateMosqueInput): Promise<CreateMosqueOutput> {
        const mosqueObj = new Mosque({
            id: this.config.strUtils.generateUniqueId(),
            name: input.name,
            location: input.location,
            phone: input.phone,
            email: input.email,
            website: input.website,
            description: input.description,
            photos: input.photos,
            openingHours: input.openingHours
        });

        const mosque = mosqueObj.snapshot();

        await this.config.mosqueRepository.create({
            id: mosque.id,
            name: mosque.name,
            location: mosque.location,
            phone: mosque.phone,
            email: mosque.email,
            website: mosque.website,
            description: mosque.description,
            photos: mosque.photos,
            openingHours: mosque.openingHours
        });

        return mosqueObj;
    }
}