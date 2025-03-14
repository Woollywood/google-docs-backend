import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './utils';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });

	const configService = app.get(ConfigService);
	const port = configService.get<string>('PORT') ?? 3000;

	app.setGlobalPrefix('api/v1');
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	setupSwagger(app);

	await app.listen(port);
}
void bootstrap();
