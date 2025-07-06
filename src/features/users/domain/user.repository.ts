import { User } from "./user";

export interface UserRepository {
    getUser(id: string): Promise<User>;
}