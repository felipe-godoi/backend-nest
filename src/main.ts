import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.setGlobalPrefix("api");

    const config = new DocumentBuilder()
        .setTitle("API de medições")
        .setDescription(
            "API que retorna as medições feitas pelos dispositivos de medição de energia, agregando conforme a resolução necessária."
        )
        .setVersion("1.0")
        .addTag("measurements")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    await app.listen(3000);
}
bootstrap();
