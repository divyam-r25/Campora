import { Router } from "express";
import { validateBody } from "../../middleware/validate.middleware";
import {
  loginHandler,
  logoutHandler,
  refreshHandler,
  signupHandler,
} from "./auth.controller";
import { loginSchema, refreshSchema, signupSchema } from "./auth.validation";

const router = Router();

router.post("/signup", validateBody(signupSchema), signupHandler);
router.post("/login", validateBody(loginSchema), loginHandler);
router.post("/refresh", validateBody(refreshSchema), refreshHandler);
router.post("/logout", validateBody(refreshSchema), logoutHandler);

export default router;
