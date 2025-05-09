import app from './app';
import { PORT } from './config';

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});