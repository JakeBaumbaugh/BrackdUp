import Profile from "../model/Profile";
import { delet, get, post } from "./ServiceUtil";

export function getProfiles(): Promise<Profile[]> {
    return get("/admin/profiles")
        .then(res => res.json())
        .then(res => res.map(Profile.fromJson))
        .catch(() => {
            console.error("Failed to retrive all profiles.");
            return [];
        });
}

export function updateProfile(profile: Profile): Promise<Profile|null> {
    return post("/admin/updateProfile", profile)
        .then(res => res.json())
        .then(res => Profile.fromJson(res))
        .catch(() => {
            console.error(`Failed to update profile ${profile.id}.`);
            return null;
        });
}

export function deleteProfile(id: number): Promise<Response> {
    return delet(`/admin/deleteProfile?id=${id}`)
        .catch(res => {
            console.error(`Failed to delete profile ${id}.`);
            return res;
        });
}

export function uploadImage(image: File): Promise<Response> {
    const backgroundImagePromise = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(image);
    });
    return backgroundImagePromise
        .then(data => post("/admin/uploadImage", {data}));
}