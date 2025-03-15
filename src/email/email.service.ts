import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { EMAIL_FROM } from './email.constants';

@Injectable()
export class EmailService {
	private instance: Resend | null = null;

	constructor(private readonly configService: ConfigService) {
		this.instance = new Resend(configService.get<string>('RESEND_API_KEY'));
	}

	sendVerificationEmail(email: string, token: string) {
		const callbackURL = new URL(this.configService.get<string>('EMAIL_VERIFICATION_CALLBACK_URL') || '');
		callbackURL.searchParams.set('token', token);
		return this.send(
			email,
			'Email Verification',
			`<p>Click the link to verify your email: ${callbackURL.href}</p>`,
		);
	}

	sendResetPassword(email: string, token: string) {
		const callbackURL = new URL(this.configService.get<string>('RESET_PASSWORD_CALLBACK_URL') || '');
		callbackURL.searchParams.set('token', token);
		return this.send(email, 'Reset your password', `<p>Click the link to reset your password: ${callbackURL}</p>`);
	}

	private send(email: string, subject: string, html: string) {
		return this.instance?.emails.send({
			from: EMAIL_FROM,
			to: email,
			subject,
			html,
		});
	}
}
