import { Router } from "express";
import usersRouter from "./user.route.js"

const router = Router();
const prefijo = "app";

router.use(`/${prefijo}/user`, usersRouter);

export default usersRouter;