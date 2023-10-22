export default class Profile {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    pictureLink?: string;

    constructor(id: number, email: string, firstName?: string, lastName?: string, pictureLink?: string) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.pictureLink = pictureLink;
    }

    static fromJson(data: any): Profile {
        return new Profile(data.id, data.email, data.firstName, data.lastName, data.pictureLink);
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
}