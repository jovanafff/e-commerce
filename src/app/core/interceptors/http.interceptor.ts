import { HttpInterceptorFn} from "@angular/common/http";
import { error } from "console";
import {tap} from 'rxjs';
import {catchError} from 'rxjs';
import { throwError } from "rxjs";
import { inject } from "@angular/core"; 
import { AuthService } from "../services/auth.service";

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

    console.log(' Requisição:', req.url);

    const authService = inject(AuthService);
    const token = authService.obterToken();
    const novaReq = token ?
     req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        },
    }): req;
    return next(novaReq).pipe(
        tap({
            next: (event) => console.log('Responde:', event),
            error: (error) => console.log('erro na requisição', error),
        }),
        catchError((error) =>{
            console.error('Erro na requisição', error);
            return throwError(() => error);
        }),
        catchError((error) =>{
            console.error('ERRO GLOBAL:', error);
            if (error.status === 401){
                console.warn('Usuario não autorizado!');
            }
            if (error.status === 500){
                console.warn('Erro interno do servidor!');
            }
           return throwError(() => error) ;
        }),
    );

};