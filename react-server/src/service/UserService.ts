import { post } from "./ServiceUtil";

export function login(jwt: string): Promise<any> {
    return post("/login", jwt);
}