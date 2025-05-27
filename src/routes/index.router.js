import { Router } from "express";
import usersRouter from "./user.route.js"

const routerIndex = Router();
const prefijo = "app";

routerIndex.use(`/${prefijo}/user`, usersRouter);

export default routerIndex;