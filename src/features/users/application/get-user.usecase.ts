import { User } from "../domain/user";
import { UserRepository } from "../domain/user.repository";

export class GetUser {
    constructor(private userRepository: UserRepository) { }

    async execute(id: string): Promise<User> {
        return this.userRepository.getUser(id);
    }
}
