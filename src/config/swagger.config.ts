import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
	const config = new DocumentBuilder()
		.addBearerAuth()
		.setTitle('Emanuel Api V1')
		.setDescription('The Emanuel API V1 documentation')
		.setVersion('1.0')
		.addTag('users')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document);
}
