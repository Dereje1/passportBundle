import { PassportStatic } from 'passport';
import { Model } from 'mongoose';
// config/passport.js for twitter
import { Strategy as TwitterStrategy, Profile as twitterProfile } from 'passport-twitter';
import { OAuth2Strategy as GoogleStrategy, Profile as googleProfile, VerifyFunction } from 'passport-google-oauth';
import { Strategy as GitHubStrategy, Profile as githubProfile } from 'passport-github';
// load up the user model
import { getApiKeys } from '../utils';
import { UserType } from '../interfaces';

export const processLogin = async (
  token: string,
  tokenSecret: string,
  profile: twitterProfile | googleProfile | githubProfile,
  done: VerifyFunction,
  User: Model<UserType>
) => {
  const {
    provider, id, username, displayName, emails,
  } = profile;
  try {
    const user = await User.findOne({ $and: [{ userId: id }, { service: provider }] }).exec();
    if (user) {
      return done(null, user);
    }
    const newUser = await User.create({
      userId: id,
      token,
      username: username || (emails && emails[0].value),
      displayName,
      service: provider,
    });
    return done(null, newUser);
  } catch (error) {
    return done(error, undefined);
  }
};

export const passportConfig = (passport: PassportStatic, User: Model<UserType>) => {
  const { keys: { twitterApiKeys, googleApiKeys, githubApiKeys } } = getApiKeys();

  // used to serialize the user for the session
  passport.serializeUser((user: { id?: number }, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err: unknown, user: { id?: number }) => {
      done(err, user);
    });
  });

  if (twitterApiKeys) {
    passport.use(new TwitterStrategy(twitterApiKeys, (...args) => processLogin(...args, User)));
  }

  if (googleApiKeys) {
    passport.use(new GoogleStrategy(googleApiKeys, (...args) => processLogin(...args, User)));
  }

  if (githubApiKeys) {
    passport.use(new GitHubStrategy(githubApiKeys, (...args) => processLogin(...args, User)));
  }
};
