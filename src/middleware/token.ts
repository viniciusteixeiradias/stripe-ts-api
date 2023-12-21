import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

type Error = jwt.VerifyErrors | null;
type Payload = string | jwt.JwtPayload | undefined;

const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.sendStatus(401)
  }

  if (!process.env.SECRET) {
    res.sendStatus(400);
    return;
  }

  jwt.verify(token, process.env.SECRET, (error: Error, payload: Payload) => {
    if (error) {
      res.sendStatus(401);
    }

    console.log("Payload: ", payload)

    // @ts-ignore
    req["payload"] = payload

    next()
  })
}

export { checkJwt };
