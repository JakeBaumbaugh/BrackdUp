import { Tournament } from "./Tournament";

type ProfileRole = "USER" | "ADMIN";

export default class Profile {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    pictureLink?: string;
    role: ProfileRole;

    constructor(id: number, email: string, role: ProfileRole, firstName?: string, lastName?: string, pictureLink?: string) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
        this.pictureLink = pictureLink;
    }

    static fromJson(data: any): Profile {
        return new Profile(data.id, data.email, data.role, data.firstName, data.lastName, data.pictureLink);
    }

    getName(): string {
        if(!this.lastName) {
            return this.firstName!;
        }
        if(!this.firstName) {
            return this.lastName;
        }
        return `${this.firstName} ${this.lastName}`;
    }

    isAdmin(): boolean {
        return this.role === "ADMIN";
    }

    canEditTournament(tournament: Tournament): boolean {
        // TODO: tournament managers that can delete the tournament
        return this.isAdmin();
    }

    canCreateTournament(): boolean {
        return this.isAdmin();
    }
}