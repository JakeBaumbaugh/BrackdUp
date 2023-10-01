export default class Profile {
    id: number;
    jwt: string;
    email: string;
    firstName?: string;
    lastName?: string;
    pictureLink?: string;

    constructor(id: number, jwt: string, email: string, firstName?: string, lastName?: string, pictureLink?: string) {
        this.id = id;
        this.jwt = jwt;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.pictureLink = pictureLink;
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