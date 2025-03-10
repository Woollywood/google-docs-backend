import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPassword } from './reset-password.entity';
import { EmailModule } from 'src/email/email.module';
import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [TypeOrmModule.forFeature([ResetPassword]), EmailModule, UsersModule],
	providers: [ResetPasswordService],
	exports: [ResetPasswordService],
})
export class ResetPasswordModule {}
