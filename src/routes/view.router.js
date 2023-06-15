import { Router } from "express";
import { strategyPassport } from "../utils.js";
import controller from "../controller/view.controller.js";

const router = Router();

router.get(
  "/chat",
  strategyPassport("jwt", { session: false }),
  async (req, res) => {
    controller.getChat(req, res);
  }
);

router.get(
  "/products",
  strategyPassport("jwt", { session: false }),
  async (req, res) => {
    controller.getProducts(req, res);
  }
);

router.get(
  "/carts/:cid",
  strategyPassport("jwt", { session: false }),
  async (req, res) => {
    controller.getCart(req, res);
  }
);

router.get("/login", (req, res) => {
  controller.getLogin(req, res);
});

router.get("/register", (req, res) => {
  controller.getRegister(req, res);
});

router.get(
  "/users",
  strategyPassport("jwt", { session: false }),
  async (req, res) => {
    controller.getUsers(req, res);
  }
);

router.get("/restore", (req, res) => {
  controller.getRestore(req, res);
});

router.get("/changePassword/:token", (req, res) => {
  controller.getChangePassword(req, res);
});

router.get("/upload", (req, res) => {
  controller.uploadFIle(req, res);
});
export default router;
