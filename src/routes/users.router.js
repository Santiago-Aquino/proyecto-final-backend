import { Router } from "express";
import controller from "../controller/users.controller.js";
import { uploader } from "../utils.js";

const router = Router();

router.get("/", async (req, res, next) => {
  controller.getAll(req, res, next);
});

router.post("/", async (req, res, next) => {
  controller.createUser(req, res, next);
});

router.delete("/", async (req, res, next) => {
  controller.deleteUsersInactivity(req, res, next);
});

router.put("/:uid/carts/:cid", async (req, res, next) => {
  controller.updates(req, res, next);
});

router.put("/premium/:uid", async (req, res, next) => {
  controller.changeRole(req, res, next);
});

router.delete("/:uid", async (req, res, next) => {
  controller.deleteUser(req, res, next);
});

router.post(
  "/:uid/documents",
  uploader.single("file"),
  async (req, res, next) => {
    controller.uploadUser(req, res, next);
  }
);

router.put("/change/:uid/admin/:role", async (req, res, next) => {
  controller.changeRoleByAdmin(req, res, next);
});

export default router;
