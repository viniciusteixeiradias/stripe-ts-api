import { readFileSync } from "fs";
import express from 'express';
import bodyParser from 'body-parser';

/* Routes */
import stripeRoutes from "./routes/stripe"

const app = express();
const port = process.env.PORT;

import jwt from "jsonwebtoken";

const payload = {
	user: "Vinicius",
	company: "Foodinn",
	aud: "http://localhost/3000"
}

const token = jwt.sign(payload, process.env.SECRET!)
console.log(token)

app.use(bodyParser.json());

app.get("/", (_, res) => {
  res.json({ message: "Hello World" })
})

app.use("/stripe", stripeRoutes)

app.listen(port, () => {
  console.info('Running on port ', port)
});
