

export interface LoginRepository {
    login(params: {
        phone: string,
    }): Promise<{
        token: string
    }>
}

export interface AuthRepository extends LoginRepository { }