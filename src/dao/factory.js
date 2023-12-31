import mongoose from "mongoose";
import config from "../config/config.js";

export let Users;

switch (config.persistence) {
  case "MONGO":
    mongoose.set("strictQuery", false);
    mongoose.connect(config.mongo);
    const { default: UsersManager } = await import("./dbManagers/users.js");

    Users = new UsersManager();
    break;
  case "MEMORY":
    const { default: UserManager } = await import(
      "./fileManagers/usersManager.js"
    );

    Users = new UserManager();
    break;
}
