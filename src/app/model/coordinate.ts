import { UserPhoto } from "./userPhoto";

export class Coordinate {

    constructor(
        //public lat: number,
        //public lng: number,
    ) { }

    id: number;
    lat: number;
    lng: number;
    title: string;
    description: string;
    photo: UserPhoto;
    date: Date;
    category: string;

    toString(): string {
        return this.lat + ' ' + this.lng;
    }

    metaDataToString(): string {
        return this.title + ' ' + this.description;
    }

    allToString(): string {
        return this.title + ' ' + this.description + ' ' + this.lat + ' ' + this.lng + ' ' + this.date;
    }

    phototoBase64String(): string | Blob {
        return this.photo.base64Data;
    }

}