import { SupabaseClient } from "@supabase/supabase-js";
import { Session } from "../domain/models/session.model";
import { AuthRepository } from "../domain/ports/auth.port";


export class SupabaseAuthRepository implements AuthRepository {
    constructor(private readonly supabase: SupabaseClient) { }
    async getSession(): Promise<Session | null> {
        const { data, error } = await this.supabase.auth.getSession();
        if (error) {
            throw error
        }
        if (!data.session) {
            return null;
        }
        return {
            token: data.session?.access_token
        }
    }
    async login(params: { phone: string; }): Promise<{ token: string; }> {
        const { data, error } = await this.supabase.auth.signInAnonymously({
            options: {
                data: {
                    phone: params.phone
                }
            }
        });
        if (error) {
            throw error
        }
        if (!data.session) {
            throw new Error("Session not found")
        }
        return {
            token: data.session?.access_token
        }
    }
}