import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
	const config = new DocumentBuilder()
		.addBearerAuth()
		.setTitle('Vidal Api V1')
		.setDescription('The Vidal API V1 documentation')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document);
}
