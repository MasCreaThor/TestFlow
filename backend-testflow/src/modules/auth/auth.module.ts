// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { PeopleModule } from '../people/people.module';
import { RolesModule } from '../roles/roles.module'; // Import RolesModule

import { 
  LoginController,
  RegisterController,
  RefreshTokenController,
  ResetPasswordController,
  ChangePasswordController
} from './controllers';
import {
  LoginService,
  RegisterService,
  RefreshTokenService,
  ResetPasswordService,
  ChangePasswordService
} from './services';
import { JwtStrategy, LocalStrategy } from './strategies';
import { AuthToken, AuthTokenSchema } from './infra/schemas';
import { TokenRepository } from './infra/repositories';

@Module({
  imports: [
    UsersModule,
    EmailModule,
    PeopleModule,
    RolesModule, // Add RolesModule to imports
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret') || 'testflow-secret-key',
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn') || '1d',
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: AuthToken.name, schema: AuthTokenSchema },
    ]),
  ],
  controllers: [
    LoginController,
    RegisterController,
    RefreshTokenController,
    ResetPasswordController,
    ChangePasswordController
  ],
  providers: [
    LoginService,
    RegisterService,
    RefreshTokenService,
    ResetPasswordService,
    ChangePasswordService,
    TokenRepository,
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [
    LoginService,
    RegisterService,
    RefreshTokenService,
    ResetPasswordService,
    ChangePasswordService,
  ],
})
export class AuthModule {}