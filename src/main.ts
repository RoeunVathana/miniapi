import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  configureApp(app);

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`MiniShopStore API is running on http://localhost:${port}/api`);
}

void bootstrap();
