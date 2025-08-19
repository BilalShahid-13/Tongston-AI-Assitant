import { Router } from "express";
import { sendOtp } from "../controller/sendOtp.controller";
import { verifyOtp } from "../controller/verifyOtp.controller";
const otpRouter = Router();
otpRouter.post("/verifyOtp", verifyOtp)
otpRouter.post("/sendOtp", sendOtp)
export default otpRouter;