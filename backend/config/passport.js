const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const UserRepository = require('../repositories/UserRepository');

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.com`;
      const name = profile.displayName || profile.username;
      const avatar_url = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
      const github_id = String(profile.id);

      let user;
      user = await UserRepository.findByGithubId(github_id);

      if (user) {
        user = await UserRepository.patch(user.id, { avatar_url });
      } else {
        user = await UserRepository.create({
          name,
          email,
          role: 'learner',
          github_id,
          avatar_url
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
