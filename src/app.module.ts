import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PartnerModule } from './modules/partner/partner.module';
import { TypePhoneModule } from './modules/typephone/typePhone.module';
import { TypedocumetModule } from './modules/typedocumet/typedocumet.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		PartnerModule,
		TypePhoneModule,
		TypedocumetModule,
	],
})
export class AppModule {
	static port: number;

	constructor(private readonly config: ConfigService) {
		AppModule.port = this.config.get('APP_PORT');
	}
}
