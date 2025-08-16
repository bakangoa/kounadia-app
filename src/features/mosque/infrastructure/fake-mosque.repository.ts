import { faker } from '@faker-js/faker';
import { MosqueDTO, MosqueRepository, SearchMosqueParams } from "../domain/mosque.repository";


export class FakeMosqueRepository implements MosqueRepository {
    async search(params: SearchMosqueParams): Promise<MosqueDTO[]> {
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
    async get(id: string): Promise<MosqueDTO | null> {
        return {
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
        };
    }
    async create(mosque: MosqueDTO): Promise<void> {
        return;
    }
    update(mosque: MosqueDTO): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}