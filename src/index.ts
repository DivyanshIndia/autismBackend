import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import compression from "compression";
import cors from "cors";

import router from "./router";
import mongoose from "mongoose";
import { initializeSocket } from "server";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const io = initializeSocket(server);

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080/");
});

const MONGO_URL =
  "mongodb+srv://lusizhao9:YQA2VmXJdapeRQt1@cluster0.2hlekxb.mongodb.net/?retryWrites=true&w=majority";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());
