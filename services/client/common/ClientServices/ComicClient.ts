
import type { PutBlobResult } from '@vercel/blob';
import { get, post } from './apiservices';
import { API_PATHS } from './apipathservices';

class ComicClient
{
    // apiServ!:ApiService
    constructor()
    {
        // this.apiServ = new ApiService()
    }

    

    async createComic(payload:any)
    {
        let req = {
            action:"create",
            payload:{
                "title": payload.title,
                "description": payload.description,
                "banner":payload.banner,
                "price": payload.price,
                "genre":payload.genre,
                "author":payload.author,
                "publisher":payload.publisher,
                "publicationyear":payload.publicationyear,
            }
          }
        return await post(API_PATHS.CreateComics_POSt,req)
    }

    async getAllComics(){ return await get(API_PATHS.GetAllComics_Get) }


    async updateComic(payload:any)
    {
        let req = {
            action:"update",
            id:payload.id,
            payload:{
                "title": payload.title,
                "description": payload.description,
                "banner":payload.banner,
                "price": payload.price,
                "genre":payload.genre,
                "author":payload.author,
                "publisher":payload.publisher,
                "publicationyear":payload.publicationyear,
            }
          }
        return await post(API_PATHS.CreateComics_POSt,req)
    }

    deleteComicFile = async (url:string) => {
        if (!url) {
          alert('Please enter a valid URL');
          return;
        }
    
        // const url = deleteInputRef.current.value;
        const filename = url.split('/').pop(); // Extract the filename from the URL
    
        if (!filename) {
          alert('Invalid URL');
          return;
        }
    
        try {
          const response = await fetch(`/api/imageupload?filename=${url}`, {
            method: 'DELETE',
          });
    
          if (response.ok) {
            console.log('File deleted successfully');
            // if (blob?.url === url) {
            //   setBlob(null); // Clear the blob state if the deleted file matches the uploaded one
            // }
          } else {
            console.log('Failed to delete file');
          }
        } catch (error) {
          console.error('Error deleting file:', error);
          alert('Error deleting file');
        }
      };

    async deleteComic(payload:any)
    {
        let req = { "action": "delete", id:payload.id  }
        if(!!payload.banner){ await this.deleteComicFile(payload.banner) }
        return await post(API_PATHS.CreateComics_POSt,req)
    }
}

export default ComicClient