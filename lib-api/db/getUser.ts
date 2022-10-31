import { Collection, MongoClient } from 'mongodb';
import { DatabaseUser } from 'interfaces-defenitions/DatabaseUser';
import clientPromise from './mongodb';
export const USERS_COLLECTION = 'users';
// export const DATABASE = 'next-auth-palehzy';
export const DATABASE = 'myFirstDatabase';

interface UserCollectionCallback<T = any> {
    (userCollection: Collection<DatabaseUser>): Promise<DatabaseUser | null>;
}

export async function getCollection(
    collection: string,
    database: string = DATABASE
) {
    const client: MongoClient = await clientPromise;
    const db = client.db(database);
    return db.collection<DatabaseUser>(collection);
}

export async function userCollection(userMods: UserCollectionCallback) {
    const collection = await getCollection(USERS_COLLECTION);
    const result = await userMods(collection);
    return result;
}

export async function getDatabaseUser(userParams: DatabaseUser) {
    try {
        const mongoUser = await userCollection(async (userCollection) => {
            const mongo_user = await userCollection.findOne({
                email: userParams.email,
            });
            return mongo_user;
        });
        return mongoUser;
    } catch (error) {
        console.error(error);
        console.error(
            getDatabaseUser.name,
            'Error Finding the User in the database'
        );
        return null;
    }
}
