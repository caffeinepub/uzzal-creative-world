import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface NotificationPreferences {
    notificationsEnabled: boolean;
    notificationSound: string;
}
export interface SearchPreferences {
    safeSearchEnabled: boolean;
    defaultSearchEngine: string;
}
export interface AppearanceSettings {
    theme: string;
    fontSize: bigint;
    colorScheme: string;
}
export interface BookmarkSettings {
    defaultBookmarkFolder: string;
    bookmarksBarVisible: boolean;
}
export interface Profile {
    notifications: NotificationPreferences;
    displayName: string;
    advanced: AdvancedSettings;
    appearance: AppearanceSettings;
    bookmarks: BookmarkSettings;
    search: SearchPreferences;
    privacy: PrivacySettings;
}
export interface AdvancedSettings {
    hardwareAcceleration: boolean;
    proxySettings: string;
}
export interface PrivacySettings {
    doNotTrack: boolean;
    cookiePreferences: string;
}
export interface backendInterface {
    getAllProfiles(): Promise<Array<Profile>>;
    getSettings(): Promise<Profile>;
    isRegistered(): Promise<boolean>;
    saveSettings(profile: Profile): Promise<void>;
}
