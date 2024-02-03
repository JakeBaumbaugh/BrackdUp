import Profile from "../model/Profile";
import { delet, get, post } from "./ServiceUtil";

export function getProfiles(): Promise<Profile[]> {
    return get("/admin/profiles")
        .then(res => res.json())
        .then(res => res.map(Profile.fromJson))
        .catch(() => {
            console.log("Failed to retrive all profiles.");
            return [];
        });
}

export function updateProfile(profile: Profile): Promise<Profile|null> {
    return post("/admin/updateProfile", profile)
        .then(res => res.json())
        .then(res => Profile.fromJson(res))
        .catch(() => {
            console.log(`Failed to update profile ${profile.id}.`);
            return null;
        });
}

export function deleteProfile(id: number): Promise<Response> {
    return delet(`/admin/deleteProfile?id=${id}`)
        .catch(res => {
            console.log(`Failed to delete profile ${id}.`);
            return res;
        });
}