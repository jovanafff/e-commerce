import { HttpInterceptorFn} from "@angular/common/http";
import { error } from "console";
import {tap} from 'rxjs';
import {catchError} from 'rxjs';
import { throwError } from "rxjs";
export const httpInterceptor: HttpInterceptorFn = (req, next) => {
    console.log('Interceptando Requisição:', req.url);

    const token = ' fake-token-jwt';
    const novaReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        },
    });
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