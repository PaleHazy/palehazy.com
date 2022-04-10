export interface User<idType> {
    _id: idType
    email: string
    emailVerified: Date
}