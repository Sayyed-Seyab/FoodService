import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';

import Db from './db/Config.js';
import UserRouter from './Routes/UserRoute.js'
import ProviderRoute from './Routes/ProviderRoute.js';


Db();



const app = express();
app.use(express.json({ limit: '50mb' })); // Parse JSON
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded form data

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("API Running");
  console.log("api is running");
});

app.use("/api/user", UserRouter);
app.use("/api/provider", ProviderRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(process.env.JWT_SECRET);
  console.log("hello from controller");
});