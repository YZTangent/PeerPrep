import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor,  HTTP_INTERCEPTORS} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../_services/storage.service';


@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    constructor(private storageService: StorageService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({ withCredentials: true });
        let token: string | null = null;
        if (this.storageService) {
            const user = this.storageService.getUser();
            if (user) {
                token = user.token;
            }
        }
        if (token) {
            req = req.clone({ headers: req.headers.set('Authorization', token) });
        }
        return next.handle(req);
    }
}

export const httpInterceptorProviders = [{provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true}];

