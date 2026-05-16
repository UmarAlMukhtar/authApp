const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        // profile looks like this:
        // {
        //   id: '118293847562938475',
        //   displayName: 'John Doe',
        //   emails: [{ value: 'john@gmail.com', verified: true }],
        //   photos: [{ value: 'https://...' }]
        // }

        const googleEmail = profile.emails[0].value;
        const googleId = profile.id;
        const profilePicture = profile.photos[0].value;

        let user = await User.findOne({ googleId });

        if (user) {
          return done(null, user);
        }

        user = await User.findOne({ email: googleEmail });

        if (user) {
          user.googleId = googleId;
          await user.save();
          return done(null, user);
        }

        user = await User.create({
          email: googleEmail,
          googleId,
          password: null,
          isProfileComplete: false,
          profilePicture: profilePicture,
        });

        return done(null, user);
      } catch (err) {
        console.error("Google auth error:", err);
        return done(err, null);
      }
    },
  ),
);

module.exports = passport;
