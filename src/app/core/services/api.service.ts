import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";


export interface RequestOptions {
  headers?: HttpHeaders;
  observe?: any;
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  body?: any;
}

export function apiHttpClientCreator(http: HttpClient) {
  return new ApiService(http);
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
// {"apiUrl":"","certSha256":"B8908F3D4D7BCD4030FA8FDD5CF986F99E138BA7DB5CA94D6BF43310C9AE98CD"}
  baseURL: string = environment.serverApiUrl;

  public constructor(private http: HttpClient) {
  }

  public get<T>(endPoint: string, options?: RequestOptions): Observable<any> {
    return this.http.get<T>(this.baseURL + endPoint, options);
  }

  public post<T>(endPoint: string, body: Object, options?: RequestOptions): Observable<any> {
    return this.http.post<T>(this.baseURL + endPoint, body, options);
  }

  public put<T>(endPoint: string, params: Object, options?: RequestOptions): Observable<any> {
    return this.http.put<T>(this.baseURL + endPoint, params, options);
  }

  public patch<T>(endPoint: string, params: Object, options?: RequestOptions): Observable<any> {
    return this.http.patch<T>(this.baseURL + endPoint, params, options);
  }

  public delete<T>(endPoint: string, options?: RequestOptions): Observable<any> {
    return this.http.delete<T>(this.baseURL + endPoint, options);
  }

}
