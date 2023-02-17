import {
  apiKeys,
  UserType
} from './interfaces';

export const getApiKeys = ():({
  keys: apiKeys
  apiKeysFound: {
    twitter: boolean
    google: boolean
    github: boolean
  }
}) => {
  const {
    TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET,
    TWITTER_CALLBACK,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK,
  } = process.env;

  const keys: apiKeys = {
    twitterApiKeys: null,
    googleApiKeys: null,
    githubApiKeys: null,
  };

  if (TWITTER_CONSUMER_KEY && TWITTER_CONSUMER_SECRET && TWITTER_CALLBACK) {
    keys.twitterApiKeys = {
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL: TWITTER_CALLBACK,
    };
  }
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_CALLBACK) {
    keys.googleApiKeys = {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK,
    };
  }

  if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET && GITHUB_CALLBACK) {
    keys.githubApiKeys = {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK,
    };
  }
  const apiKeysFound = {
    twitter: Boolean(keys.twitterApiKeys),
    google: Boolean(keys.googleApiKeys),
    github: Boolean(keys.githubApiKeys),
  };
  console.log({ apiKeysFound });

  return { keys, apiKeysFound };
};

/* Isolate auth service used from req.user and generate proffile */
export const getUserProfile = (user: UserType):({
  service: string | undefined,
  userId: string | undefined,
  displayName: string | null,
  username: string |undefined,
  isAdmin: boolean,
}) => {
  if (!user) {
    return {
      service: undefined,
      userId: undefined,
      displayName: null,
      username: undefined,
      isAdmin: false,
    };
  }
  const {
    _id, service, userId, displayName, username,
  } = user;

  const isAdmin = Boolean(
    process.env.ADMIN_USER_ID
    && userId === process.env.ADMIN_USER_ID,
  );
  return {
    service,
    userId: _id.toString(), // mask actual userId sent to client by mongo doc Id
    displayName: displayName || '🚫',
    username,
    isAdmin,
  };
};
