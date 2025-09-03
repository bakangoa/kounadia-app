

export interface CheckUserExistsRepository {
    isExists(phone: string): Promise<boolean>
}

export interface CreateUserRepository {
    generateId(): string
    create(params: {
        id: string;
        fullName: string;
        phone: string;
    }): Promise<void>
}

export interface UserRepository extends CheckUserExistsRepository, CreateUserRepository { }