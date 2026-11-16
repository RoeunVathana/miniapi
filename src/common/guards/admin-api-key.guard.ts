import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const configuredKey = process.env.ADMIN_API_KEY;
    const expectedKey =
      configuredKey ||
      (process.env.NODE_ENV === 'production'
        ? undefined
        : 'local-teaching-key');

    if (!expectedKey) {
      throw new InternalServerErrorException(
        'ADMIN_API_KEY must be configured in production',
      );
    }

    const request = context.switchToHttp().getRequest<Request>();
    const providedKey = request.header('x-api-key');

    if (!providedKey || providedKey !== expectedKey) {
      throw new UnauthorizedException('A valid admin API key is required');
    }

    return true;
  }
}
