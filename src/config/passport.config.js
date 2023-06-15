import passport from "passport";
import githubService from "passport-github2";
import local from "passport-local";
import UsersManager from "../dao/dbManagers/users.js";
import { createHash, isValidPassword } from "../utils.js";
import jwt from "passport-jwt";
import config from "./config.js";

const insUsers = new UsersManager();
const jwtStrategy = jwt.Strategy;
const jwtExtract = jwt.ExtractJwt;
const localStrategy = local.Strategy;

const initializePassport = () => {
  //register

  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email", session: false },
      async (req, email, password, done) => {
        const { first_name, last_name, age } = req.body;

        try {
          let user = await insUsers.getOne(null, email);

          if (user) return done(null, false, { message: "user alredy exists" });

          if (!first_name || !last_name || !age || !email || !password)
            return done(null, false, { message: "Enter all data" });
          else {
            const newUser = {
              first_name,
              last_name,
              email,
              age,
              password: createHash(password),
            };
            let result = await insUsers.createUser(newUser);
            return done(null, result);
          }
        } catch (err) {
          return done("Error al obtener el usuario" + err);
        }
      }
    )
  );

  //login

  passport.use(
    "login",
    new localStrategy(
      { usernameField: "email", session: false },
      async (email, password, done) => {
        try {
          const user = await insUsers.getOne(null, email);

          if (!user) {
            return done(null, false, { message: "user not found" });
          }

          if (!email || !password)
            return done(null, false, { message: "Enter all data" });

          if (!isValidPassword(user, password))
            return done(null, false, { message: "password incorrect" });

          await insUsers.updateUser(email, {
            last_connection: new Date().getTime(),
          });

          return done(null, user);
        } catch (err) {
          return done("error al obtener el usuario" + err);
        }
      }
    )
  );

  //github

  passport.use(
    "github",
    new githubService(
      {
        clientID: "Iv1.1b1f54066790674f",
        clientSecret: "771093a48eaffb5a556abfc2ccfec802b39323f9",
        callbackURL: `https://proyecto-final-backend-production-4715.up.railway.app/api/sessions`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await insUsers.getOne(null, profile._json.email);
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "not last name",
              age: 21,
              email: profile._json.email,
              password: "not password",
            };
            let result = await insUsers.createUser(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  //restore

  passport.use(
    "restore",
    new localStrategy(
      { usernameField: "email", session: false },
      async (email, password, done) => {
        try {
          const user = await insUsers.getOne(null, email);

          if (!user) {
            return done(null, false, { message: "user not found" });
          }

          await insUsers.changePassword(email, createHash(password));

          return done(null, user);
        } catch (err) {
          return done("error al obtener el usuario" + err);
        }
      }
    )
  );

  //jwt

  passport.use(
    "jwt",
    new jwtStrategy(
      {
        jwtFromRequest: jwtExtract.fromExtractors([cookieExtractor]),
        secretOrKey: config.token,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await insUsers.getOne(id, null);
    done(null, user);
  });
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[config.cookie];
  }
  return token;
};

export default initializePassport;
