
// Type to extract TSnapshot from an instance of Entity
export type GetSnapshot<T extends Entity<any, any>> = T extends Entity<
    any,
    infer TSnapshot
>
    ? TSnapshot
    : never;

export abstract class Entity<TState, TSnapshot> {
    protected _state!: TState;
    abstract snapshot(): TSnapshot;
}