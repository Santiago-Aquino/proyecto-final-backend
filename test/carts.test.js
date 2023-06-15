import chai from "chai";
import mongoose from "mongoose";
import supertest from "supertest";
import config from "../src/config/config.js";

const expect = chai.expect;
const requester = supertest(`http://localhost:${config.port}`);

describe("Test para los carritos", () => {
  before(function () {
    mongoose.connect(config.mongo);
  });

  // beforeEach(function () {
  //   mongoose.connection.collection("carts").deleteMany({});
  // });

  after(function () {
    mongoose.connection.close();
    this.timeout(5000);
  });

  it("Test para el guardado de producto de un carrito", async () => {
    const response = await requester.post(
      `/api/carts/${config.carritoTest}/products/63e3b0673bea028034831c5c`
    );

    expect(response._body).to.have.property("status").equal("success!");
  });

  it("Test para actualizar la cantidad de un producto en un carrito", async () => {
    const response = await requester
      .put(`/api/carts/${config.carritoTest}/products/63e3b0673bea028034831c5c`)
      .send({ quantity: 3 });

    expect(response._body).to.have.property("status").equal("success!");
  });

  it("Test para eliminar un producto de un carrito", async () => {
    const response = await requester.delete(
      `/api/carts/${config.carritoTest}/products/63e3b0673bea028034831c5c`
    );

    expect(response._body).to.have.property("status").equal("success!");
  });
});
