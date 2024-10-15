import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map } from 'rxjs/operators';


@Injectable()
export class TimeInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler) {
    const now = Date.now();
    return next.handle().pipe(
      map((data) => {
        return { ...data, time: Date.now() - now };
      }),
    );
  }
}
