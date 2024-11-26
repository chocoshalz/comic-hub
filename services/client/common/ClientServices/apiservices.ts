// apiservices.ts
import axios from 'axios'; //npm install axios for more derails  =>>> https://axios-http.com/docs/api_intro
import { Observable } from 'rxjs'; //npm install rxjs for more details =>>> https://rxjs.dev/guide/overview
import { API_BASE_URL, API_PATHS } from './apipathservices';

// Axios instance (you can configure interceptors, headers, etc., here if needed)
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    // Add other headers like Authorization if needed
  },
});

// Helper function to wrap axios requests in an Observable
const request = (method: 'get' | 'post' | 'put' | 'patch' | 'delete', url: string, data?: object): Observable<any> => {
  return new Observable((observer) => {
    axiosInstance[method](`${API_BASE_URL}/${url}`, data)
      .then((response) => {
        observer.next(response.data);  // Emit the data from the response
        observer.complete();            // Complete the observable stream
      })
      .catch((error) => {
        observer.error(error);         // Emit any error that occurred during the request
      });
  });
};

// Reusable API Methods
export const get = (url: string): Observable<any> => {
  return request('get', url);
};

export const post = (url: string, data: object): Observable<any> => {
  return request('post', url, data);
};

export const put = (url: string, data: object): Observable<any> => {
  return request('put', url, data);
};

export const patch = (url: string, data: object): Observable<any> => {
  return request('patch', url, data);
};

export const remove = (url: string): Observable<any> => {
  return request('delete', url);
};
