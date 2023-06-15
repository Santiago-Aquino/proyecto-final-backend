import chai from "chai";
import mongoose from "mongoose";
import supertest from "supertest";
import config from "../src/config/config.js";
import { isValidPassword } from "../src/utils.js";
import { userService } from "../src/repository/index.js";

const expect = chai.expect;
const requester = supertest(`http://localhost:${config.port}`);

describe("Test para las sesiones", () => {
  const user = {
    first_name: "Test",
    last_name: "user",
    email: "testuser@coder.com",
    age: 30,
    password: "testUser",
  };

  before(function () {
    mongoose.connect(config.mongo);
  });

  // beforeEach(function () {
  //   mongoose.connection.collection("").deleteMany({});
  // });

  after(function () {
    mongoose.connection.close();
    this.timeout(5000);
  });

  it("Test para registrar un usuario", async () => {
    const result = await requester.post("/api/sessions/register").send(user);

    expect(result._body)
      .to.have.property("message")
      .equal("Usuario registrado");
  });

  it("Test para login de un usuario", async () => {
    const result = await requester.post("/api/sessions/login").send({
      email: user.email,
      password: user.password,
    });

    expect(result._body).to.have.property("status").equal("success!");
    expect(result._body.payload.email).to.equal(user.email);
  });

  it("Test para saber si la password esta correctamente hasheada", async () => {
    const { _body } = await requester.get("/api/users");
    const users = _body.payload;
    console.log(users);
    const userDB = users[users.length - 1];
    console.log(userDB);
    const isValid = isValidPassword(userDB, user.password);

    expect(users).to.not.empty;
    expect(isValid).to.be.true;
  });

  it("Test para eliminar un usuario de la DB", async () => {
    const userDeleted = await userService.deleteUser(null, user.email);

    expect(userDeleted).to.have.property("acknowledged").equal(true);
  });
});
