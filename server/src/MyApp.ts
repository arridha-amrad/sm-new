import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import fileUpload from 'express-fileupload';
import { createServer, Server } from 'http';
import morgan from 'morgan';

import { initIo } from './socket/socketInitializer';

// Routes
import AuthRoutes from './routes/AuthRoutes';
import UserRoutes from './routes/UserRoutes';
import PostRoutes from './routes/PostRoutes';
import NotifRoutes from './routes/NotificationRoutes';
import CommentRoutes from './routes/CommentRoutes';
import ReplyRoutes from './routes/ReplyRoutes';

class MyApp {
  // required by heroku
  PORT = process.env.PORT || 5000;
  app: Express;
  httpServer: Server;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.plugins();
    this.initServer();
    this.routes();
  }

  plugins() {
    this.app.use(
      cors({ origin: process.env.CLIENT_ORIGIN, credentials: true })
    );
    this.app.use(
      fileUpload({
        useTempFiles: true,
      })
    );
    this.app.use(cookieParser());
    this.app.use([express.json(), express.urlencoded({ extended: false })]);
    this.app.use(morgan('dev'));
  }

  initServer() {
    initIo(this.httpServer);
    this.httpServer.listen(this.PORT, () => {
      console.log(`Server running on http://localhost:${this.PORT} 🚀`);
    });
  }

  routes() {
    this.app.use('/api/auth', AuthRoutes);
    this.app.use('/api/user', UserRoutes);
    this.app.use('/api/post', PostRoutes);
    this.app.use('/api/comment', CommentRoutes);
    this.app.use('/api/notif', NotifRoutes);
    this.app.use('/api/reply', ReplyRoutes);
  }

  runApp() {
    return this.app;
  }
}

export default new MyApp();
