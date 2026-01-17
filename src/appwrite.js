import { Client, Databases,ID, Query } from 'appwrite';

const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const APPWRITE_TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client();

client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

const databases = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    try{
        const result = await databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_TABLE_ID, [
            Query.equal('searchTerm', searchTerm),
        ]);

        if(result.total > 0){
            const doc = result.documents[0];
            
            await databases.updateDocument(APPWRITE_DATABASE_ID, APPWRITE_TABLE_ID, doc.$id, {
                count: doc.count + 1,
            }); 
        }else{
            await databases.createDocument(APPWRITE_DATABASE_ID, APPWRITE_TABLE_ID, ID.unique(), {
                searchTerm: searchTerm,
                count: 1,
                movie_id : movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            });
        }
    }catch(error){
        console.error(error);
    }
}

export const getTrendingMovies = async () => {
    try{
        const result = await databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_TABLE_ID, [
            Query.orderDesc('count'),
            Query.limit(5),
        ]);

        return result.documents;
    }catch(error){
        console.error(error);
    }
}
