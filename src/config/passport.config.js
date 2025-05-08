import passportJWT from 'passport-jwt';
const { Strategy: JwtStrategy, ExtractJwt } = passportJWT;
import passport from 'passport';
import local from 'passport-local';
//import { userModel } from '../models/user.model.js';
import { compareSync } from 'bcrypt';
import { hashSync } from 'bcrypt';


const LocalStrategy = local.Strategy;

const initializePassport = () => {
  // Estrategia de REGISTRO
  passport.use(
    'register',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, email, password, done) => {
        try {
          const existingUser = await userModel.findOne({ email });
          if (existingUser) {
            return done(null, false, { message: 'Usuario ya registrado' });
          }

          const hashedPassword = hashSync(password, 10);
          const newUser = await userModel.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email,
            age: req.body.age,
            password: hashedPassword,
            role: 'user'
          });

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia de LOGIN
  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' }, // Asegúrate de usar 'email' para el campo de nombre de usuario
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email });
          if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
          }

          const isValidPassword = compareSync(password, user.password);
          if (!isValidPassword) {
            return done(null, false, { message: 'Contraseña incorrecta' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia JWT para autenticar rutas protegidas
  passport.use('jwt', new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await userModel.findById(jwtPayload.id); // Aquí estamos usando el ID del payload
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  ));
  // Serializar y deserializar usuario
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

export default initializePassport;
