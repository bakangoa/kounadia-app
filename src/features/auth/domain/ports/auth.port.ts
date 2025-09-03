import { Session } from "../models/session.model"


export interface LoginRepository {
    login(params: {
        phone: string,
    }): Promise<Session>
}

export interface GetSessionRepository {
    getSession(): Promise<Session | null>
}

export interface AuthRepository extends LoginRepository, GetSessionRepository { }