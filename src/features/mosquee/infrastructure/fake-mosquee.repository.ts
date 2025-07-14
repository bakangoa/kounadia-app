import { faker } from '@faker-js/faker';
import { MosqueeDTO, MosqueeRepository, SearchMosqueeParams } from "../domain/mosquee.repository";


export class FakeMosqueeRepository implements MosqueeRepository {
    async search(params: SearchMosqueeParams): Promise<MosqueeDTO[]> {
        return Array.from({ length: 200 }, (_, i) => ({
            id: faker.string.uuid(),
            name: faker.company.name(),
            phone: faker.phone.number(),
            description: faker.lorem.sentence(),
            location: {
                latitude: faker.location.latitude(),
                longitude: faker.location.longitude(),
                altitude: faker.location.latitude(),
                address: faker.location.streetAddress()
            },
            photos: Array.from({ length: 5 }, () => faker.image.url()),
            email: faker.internet.email(),
            website: faker.internet.url(),
            openingHours: [0, 1, 2, 3, 4, 5, 6].map((value) => ({
                dayOfWeek: value,
                openTime: `${faker.date.recent().getHours()}:${faker.date.recent().getMinutes()}`,
                closeTime: `${faker.date.future().getHours()}:${faker.date.future().getMinutes()}`
            })),
        }));
    }
    get(id: string): Promise<MosqueeDTO | null> {
        throw new Error("Method not implemented.");
    }
    async create(mosquee: MosqueeDTO): Promise<void> {
        return;
    }
    update(mosquee: MosqueeDTO): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}