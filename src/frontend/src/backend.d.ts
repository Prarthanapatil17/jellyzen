import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfileView {
    xp: number;
    streak: number;
    lastSession: Time;
    unlockedCollectibles: Uint32Array;
}
export interface Collectible {
    id: number;
    name: string;
    description: string;
}
export type Time = bigint;
export interface MeditationSessionDTO {
    id: number;
    title: string;
    duration: number;
    difficulty: string;
    description: string;
    category: string;
}
export interface backendInterface {
    getAllMeditationSessions(): Promise<Array<MeditationSessionDTO>>;
    getCollectibles(): Promise<Array<Collectible>>;
    getProfile(): Promise<UserProfileView>;
}
