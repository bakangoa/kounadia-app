import { Executable } from "@/src/shared/core/executable"
import { StringUtils } from "@/src/shared/utils/string.utils"
import { Mosquee, Shift } from "../domain/mosquee"
import { MosqueeRepository } from "../domain/mosquee.repository"


interface CreateMosqueeInput {
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

type CreateMosqueeOutput = Mosquee;

export class CreateMosqueeUseCase implements Executable<CreateMosqueeInput, CreateMosqueeOutput> {
    constructor(private readonly config: {
        mosqueeRepository: MosqueeRepository
        strUtils: StringUtils
    }) { }

    async execute(input: CreateMosqueeInput): Promise<CreateMosqueeOutput> {
        const mosquee: Mosquee = {
            id: this.config.strUtils.generateUniqueId(),
            name: input.name,
            location: input.location,
            phone: input.phone,
            email: input.email,
            website: input.website,
            description: input.description,
            photos: input.photos,
            openingHours: input.openingHours
        };

        await this.config.mosqueeRepository.create({
            id: mosquee.id,
            name: mosquee.name,
            location: mosquee.location,
            phone: mosquee.phone,
            email: mosquee.email,
            website: mosquee.website,
            description: mosquee.description,
            photos: mosquee.photos,
            openingHours: mosquee.openingHours
        });

        return mosquee;
    }
}