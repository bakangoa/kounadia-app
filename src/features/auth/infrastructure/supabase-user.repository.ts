import { SupabaseClient } from "@supabase/supabase-js";
import * as Crypto from 'expo-crypto';
import { UserRepository } from "../domain/user.port";


export class SupabaseUserRepository implements UserRepository {
    constructor(private supabase: SupabaseClient) { }
    generateId(): string {
        return Crypto.randomUUID()
    }
    async create(params: { id: string; fullName: string; phone: string; }): Promise<void> {
        const { error } = await this.supabase
            .from("users")
            .insert({
                id: params.id,
                fullname: params.fullName,
                phone: params.phone
            })
        if (error) {
            throw error
        }
    }
    async isExists(phone: string): Promise<boolean> {
        const { data, error } = await this.supabase
            .from("users")
            .select("phone")
            .eq("phone", phone)
            .limit(1)
            
        if (error) {
            throw error
        }
        if (!data) {
            return false
        }
        return data.length > 0
    }
}