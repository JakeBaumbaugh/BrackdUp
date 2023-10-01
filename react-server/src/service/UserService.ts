import Profile from "../model/Profile";
import { post } from "./ServiceUtil";

export function login(jwt: string): Promise<Profile> {
    return post("/login", jwt)
        .then(res => res.json())
        .then(res => Profile.fromJson(res));
}