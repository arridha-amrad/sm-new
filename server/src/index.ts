import dotenv from 'dotenv';
import { connect } from './database/mongo';
dotenv.config();
import App from './MyApp';

console.clear();

connect(process.env.MONGO_DB_ATLAS_URI!)
  .then(() => {
    App.runApp();
  })
  .catch((err) => console.log('failure on starting server', err));
