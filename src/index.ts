import { readFileSync } from "fs";
import express from 'express';
import bodyParser from 'body-parser';

import jwt from "jsonwebtoken";

/* Routes */
import stripeRoutes from "./routes/stripe"

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get("/", (_, res) => {
  res.json({ message: "Hello World" })
})

app.use("/stripe", stripeRoutes)

app.listen(port, () => {
  console.info('Running on port ', port)
});

const privateRSAKey = readFileSync("./src/private.key", "utf8");
const publicRSAKey = readFileSync("./src/public.key", "utf8");

const payload = {
	sub: '123456789',
	name: 'Vinicius',
	admin: false
}

const token = jwt.sign(
	payload,
	privateRSAKey,
	{ algorithm: "RS256" }
)

console.log("\n Token: ", token)

const decode = jwt.verify(
	token,
	publicRSAKey,
	{ algorithms: ["RS256"] }
);

console.log("\n Decode: ", decode)