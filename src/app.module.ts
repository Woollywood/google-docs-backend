import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { EmailModule } from './email/email.module';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { DocumentsModule } from './documents/documents.module';
import { CaslModule } from './casl/casl.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		UsersModule,
		AuthModule,
		SessionsModule,
		EmailModule,
		EmailVerificationModule,
		ResetPasswordModule,
		DocumentsModule,
		CaslModule,
		OrganizationsModule,
		PrismaModule,
	],
	providers: [PrismaService],
})
export class AppModule {}
