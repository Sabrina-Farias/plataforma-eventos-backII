import passport from "passport"

import { Strategy as JwtStrategy } from "passport-jwt"
import { Strategy as LocalStrategy } from "passport-local"
import { validateLogin, getUserByEmail } from "../services/user.service.js"
import { registerUser } from "../services/sessions.service.js"

import { env } from "./env.js"

passport.use('register', new LocalStrategy( { usernameField:'email', passwordField:'password', session: false, passReqToCallback: true },
    async (req, email, password, done) =>{
        try {
            const newUser = await registerUser(req.body);

            return done(null, newUser);
        }
        catch (error) {
            return done( error );
        }
    }
));

passport.use('login', new LocalStrategy( { usernameField:'email', passwordField:'password', session: false },
    async (email, password, done) =>{
        try {
            const normalizedEmail = email.toLowerCase().trim()

            const user = await validateLogin(normalizedEmail, password)

            if (!user) {
                return done( null , false , {
                    status: 'error',
                    message: 'Credenciales inválidas'
                })
            }
            
            return done( null, user );
        }
        catch ( error ){
            return done( error );
        }
    }
))


/**
 * 
 * @param {import("express").Request} req
 * @returns
 */
const cookieExtractor = function(req) {
    var token = null;
    if (req && req.signedCookies) {
        token = req.signedCookies.currentUser
    }
    return token;
};

const jwtOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: env.JWT_SECRET
}

async function jwtVerifyPayload (jwtPayload, done) {
    try {
        const user = await getUserByEmail ( jwtPayload.email )

        if ( !user ) {
        return done ( null, false, {message: "Usuario incorrecto"} )
        }

        const clearUser = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        };

        return (done ( null, clearUser ) )

    }
    catch (error) {
        return done (error)
    }
}

passport.use('current', new JwtStrategy( jwtOptions , jwtVerifyPayload ))
