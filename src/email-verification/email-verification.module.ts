import { Module } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { EmailModule } from 'src/email/email.module';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
	imports: [EmailModule, UsersModule, PrismaModule],
	providers: [EmailVerificationService],
	exports: [EmailVerificationService],
})
export class EmailVerificationModule {}
