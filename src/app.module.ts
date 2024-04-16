import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		UsersModule,
		PostsModule,
	],
})
export class AppModule {
	static port: number;

	constructor(private readonly config: ConfigService) {
		AppModule.port = this.config.get('APP_PORT');
	}
}
