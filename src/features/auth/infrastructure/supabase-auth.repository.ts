import { SupabaseClient } from "@supabase/supabase-js";
import { AuthRepository } from "../domain/auth.port";


export class SupabaseAuthRepository implements AuthRepository {
    constructor(private readonly supabase: SupabaseClient) { }
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