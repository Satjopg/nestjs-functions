import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { ExpressAdapter } from '@nestjs/platform-express';

const server = express();

const promiseApplicationReady = NestFactory.create(
  AppModule,
  new ExpressAdapter(server),
).then((app) => {
  app.use(helmet());
  app.enableCors();
  app.init();
});

export const api = functions
  .region('asia-northeast1')
  .https.onRequest(async (...args) => {
    // https://qiita.com/chelproc/items/37ed6ed27ee599b586bf
    await promiseApplicationReady;
    server(...args);
  });
