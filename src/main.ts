import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: ['http://localhost:3000', 'https://emanuel.com'],
		methods: 'GET,POST,PUT,PATCH,DELETE',
	});
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	);
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: '1',
	});
	app.setGlobalPrefix('api');

	setupSwagger(app);

	await app.listen(AppModule.port);
}
bootstrap();
