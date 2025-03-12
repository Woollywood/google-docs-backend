import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { EmailModule } from './email/email.module';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { DocumentsModule } from './documents/documents.module';
import { CaslModule } from './casl/casl.module';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule.forRoot({ isGlobal: true })],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get('DB_HOST'),
				port: +configService.get('DB_PORT'),
				username: configService.get('DB_USERNAME'),
				password: configService.get('DB_PASSWORD'),
				database: configService.get('DB_NAME'),
				synchronize: true,
				autoLoadEntities: true,
			}),
			inject: [ConfigService],
		}),
		UsersModule,
		AuthModule,
		SessionsModule,
		EmailModule,
		EmailVerificationModule,
		ResetPasswordModule,
		DocumentsModule,
		CaslModule,
	],
})
export class AppModule {}
