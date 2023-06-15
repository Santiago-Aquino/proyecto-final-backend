import { Router } from "express";
import passport from "passport";
import { strategyPassport } from "../utils.js";
import controller from "../controller/sessions.controller.js";
import { restoreUser } from "../middlewares/restore.js";
import { changePassword } from "../middlewares/changePassword.js";

const router = Router();

//register

router.post(
  "/register",
  strategyPassport("register", {
    passReqToCallback: true,
    session: false,
    failureRedirect: "/api/sessions/failregister",
  }),
  async (req, res) => {
    controller.register(req, res);
  }
);

router.get("/failregister", async (req, res) => {
  controller.failregister(req, res);
});

// login

router.post(
  "/login",
  strategyPassport("login", {
    session: false,
    failureRedirect: "/api/sessions/faillogin",
  }),
  async (req, res) => {
    controller.login(req, res);
  }
);

router.get("/faillogin", async (req, res) => {
  controller.faillogin(req, res);
});

// github

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
  async (req, res) => {}
);

router.get(
  "/",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    controller.github(req, res);
  }
);

// restore

router.post("/restore", restoreUser, async (req, res, next) => {
  controller.restore(req, res, next);
});

router.post("/changePassword", changePassword, async (req, res, next) => {
  controller.changePassword(req, res, next);
});

//current

router.get(
  "/current",
  strategyPassport("jwt", { session: false }),
  (req, res) => {
    controller.current(req, res);
  }
);

export default router;
