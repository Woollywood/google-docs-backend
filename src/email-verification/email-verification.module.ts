import { Module } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerification } from './email-verification.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [EmailModule, TypeOrmModule.forFeature([EmailVerification]), UsersModule],
	providers: [EmailVerificationService],
	exports: [EmailVerificationService],
})
export class EmailVerificationModule {}
