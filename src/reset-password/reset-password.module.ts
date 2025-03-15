import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { EmailModule } from 'src/email/email.module';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
	imports: [EmailModule, UsersModule, PrismaModule],
	providers: [ResetPasswordService],
	exports: [ResetPasswordService],
})
export class ResetPasswordModule {}
