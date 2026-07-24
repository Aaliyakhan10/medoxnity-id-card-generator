import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import employeeRoutes from './routes/employee.routes';

// Load env variables from root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/employees', employeeRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
