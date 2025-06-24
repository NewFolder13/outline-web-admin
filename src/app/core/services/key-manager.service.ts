import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {map, Observable} from "rxjs";
import {AccessKey} from "../models/key.model";
import {CreateAccessKeyDto} from "../dtos/create-access-key.dto";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class KeyManagerService {

  constructor(private readonly api: ApiService) {
  }

  hostUrl = environment.hostUrl;

  getAll(): Observable<AccessKey[]> {
    return this.api.get('/access-keys')
      .pipe(map(resp => resp.accessKeys.map((key: any) => {
        // const limit = Number((key.dataLimit?.bytes / 1073741824).toFixed(2));
        const limit = Number((key.dataLimit?.bytes / 1024 / 1024 / 1024).toFixed(2));
        const name = (key.name).split('-')[0];
        const keyString = `ss://${btoa(`chacha20-ietf-poly1305:${key.password}@${this.hostUrl}:${key.port}`)}#${name}-${limit}GB`
        return {
          ...key,
          accessUrl: keyString,
          limit: limit ? limit : 0
        }
      })))
  }

  create(payload: CreateAccessKeyDto): Observable<AccessKey> {
    !payload.password ? delete payload.password : null;
    !payload.port ? delete payload.port : payload.port = Number(payload.port);
    !payload.method ? delete payload.method : null;
    !payload.limit ? delete payload.limit : null;
    if (payload.limit) {
      payload.limit = {bytes: Math.round((<number>payload.limit) * 1024 * 1024 * 1024)};
    }

    const newPayload = {
      "method": "aes-192-gcm",
      "name": "First",
      "password": "8iu8V8EeoFVpwQvQeS9wiD",
      "port": 12345,
      "limit": {"bytes": 10000}
    };

    return this.api.post('/access-keys', {...payload, port: Number(payload.port)});
  }


  delete(accessKeyId: string) {
    return this.api.delete(`/access-keys/${accessKeyId}`);
  }

}
