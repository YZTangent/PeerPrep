import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor,  HTTP_INTERCEPTORS, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../_services/storage.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    constructor() {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({ withCredentials: true });
        return next.handle(req);
    }
}

export const httpInterceptorProviders = [{provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true}];

