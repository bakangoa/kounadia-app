import { User } from "../domain/user";
import { UserRepository } from "../domain/user.repository";


export class FakeUserRepository implements UserRepository {
    async getUser(id: string): Promise<User> {
        return { id, name: 'John Doe', email: 'john@example.com' };
    }
}