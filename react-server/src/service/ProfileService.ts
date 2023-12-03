import Profile from "../model/Profile";
import { post } from "./ServiceUtil";

export function login(code: string): Promise<Profile> {
    return post(`/login?code=${code}`)
        .then(res => res.json())
        .then(res => Profile.fromJson(res));
}

export function logout(): Promise<Response> {
    return post("/logout")
}

export function checkCookies(): Promise<Profile> {
    return post("/login")
        .then(res => res.json())
        .then(res => Profile.fromJson(res));
}