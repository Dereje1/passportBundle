### A bundler for multiple [passport](https://www.passportjs.org/) authentication strategies in an Express app.

```
npm i passportbundle
```

Note: Express app needs to be connected to a mongodb instance and a mongoose user model with the config below*
passed into the bundler for it to work.

```
import { auth } from 'passportbundle';
.
.
// setup Express app and connect to mongodb
.
.
auth(Express_app, mongoose_user_model)
```

With a user model mongoose config* ...

```
import mongoose from 'mongoose';

interface UserType {
    _id: string,
    userId: string,
    token: string,
    displayName: string | null,
    username: string,
    service: string,
}

const userSchema = new mongoose.Schema({
  userId: String,
  token: String,
  displayName: String,
  username: String,
  service: String,
}, { timestamps: true });

export default mongoose.model<UserType>('User', userSchema);
```

>env file
```

TWITTER_CONSUMER_KEY=< Get from Twitter Developer API >
TWITTER_CONSUMER_SECRET=< Get from Twitter Developer API >
TWITTER_CALLBACK=http://<Domain>/auth/twitter/redirect
GOOGLE_CLIENT_ID=< Get from Google Developer API >
GOOGLE_CLIENT_SECRET=< Get from Google Developer API >
GOOGLE_CALLBACK=http://<Domain>/auth/google/redirect
GITHUB_CLIENT_ID=< Get from Github Developer API >
GITHUB_CLIENT_SECRET=< Get from Github Developer API >
GITHUB_CALLBACK=http://<Domain>/auth/github/redirect
```
Where `Domain` would be the domain where authorization requests are redirected to, e.g. localhost:8080

Currently, this package can only authenticate with Twitter, Google or Github.

>Exposed routes

The following routes are exposed to the client:

`/auth/${provider}` -> login

`/auth/profile` -> authentication status

`/auth/guest` -> sets a dummy non-authenticated guest account

`/auth/logout` -> logout

>Router-level middleware

This package also exports a router level middleware `isLoggedIn` to intercept requests that may require authentication before proceeding, example usage: 

```
import { Router } from 'express';
import { isLoggedIn } from 'passportbundle';

const router = Router();
router.get('/api/myroute', isLoggedIn, myRouteHandler);
export default router;
```

## Built With

* see [dependencies](https://www.npmjs.com/package/passportbundle?activeTab=dependencies) in npm or package.json

## Authors

* **Dereje Getahun** - [Dereje Getahun](https://github.com/Dereje1)

* package extracted from [this project](https://github.com/Dereje1/Pinterest-Clone) for the purposes of making it reusable