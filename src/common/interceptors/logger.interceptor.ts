import { ExecutionContext, NestInterceptor, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class LoggerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    console.log(`[REQUEST] ${method} ${url} - início da requisição`);

    return next.handle().pipe(
      tap(() => {
        console.log(`[RESPONE] ${method} ${url} - ${Date.now() - now}ms`);
      }),
    );
  }
}
