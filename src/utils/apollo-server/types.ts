import express from "express";

export type TExpressRequestWithPassport = express.Request & { session: { passport: any } };