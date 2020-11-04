import mongoose from 'mongoose';
import Config from '../config';

mongoose.connect(Config.dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
  .then(() => {
    console.log('⚡️[DB]: DB is running');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

export default mongoose;
