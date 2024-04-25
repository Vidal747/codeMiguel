import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PartnerModule } from './modules/partner/partner.module';
import { TypePhoneModule } from './modules/typephone/typePhone.module';
import { ActorModule } from './modules/actor/actor.module';
import { DirectorModule } from './modules/director/director.module';
import { FilmModule } from './modules/film/film.module';
import { MovieModule } from './modules/movie/movie.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		PartnerModule,
		TypePhoneModule,
		ActorModule,
		DirectorModule,
		FilmModule,
		MovieModule,
	],
})
export class AppModule {
	static port: number;

	constructor(private readonly config: ConfigService) {
		AppModule.port = this.config.get('APP_PORT');
	}
}
