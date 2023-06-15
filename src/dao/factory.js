import mongoose from "mongoose";
import config from "../config/config.js";

export let Users;

switch (config.persistence) {
  case "MONGO":
    mongoose.set("strictQuery", false);
    mongoose.connect(
      `mongodb+srv://santiagoaquino:Clwb3yHvsdsAKead@codercluster.lnjatj6.mongodb.net/${config.mongoName}?retryWrites=true&w=majority`
    );
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
