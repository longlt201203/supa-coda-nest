import { Module } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { MyExceptionFilter, ValidationPipe } from "@utils";
import { DbModule } from "@db";
import { AgentsModule } from "@modules/agents";
import { ServeStaticModule } from "@nestjs/serve-static";
import { SessionModule } from "@modules/session";
import { ClsModule } from "nestjs-cls";
import { ProjectModule } from "@modules/project";

@Module({
	imports: [
		DbModule,
		ServeStaticModule.forRoot({
			useGlobalPrefix: false,
			rootPath: "public",
		}),
		ClsModule.forRoot({
			global: true,
			middleware: {
				mount: true,
			},
		}),
		SessionModule,
		AgentsModule,
		ProjectModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_FILTER,
			useClass: MyExceptionFilter,
		},
		{
			provide: APP_PIPE,
			useClass: ValidationPipe,
		},
	],
})
export class AppModule {}
