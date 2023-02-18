### A bundler for multiple [passport](https://www.passportjs.org/) authentication strategies for an Express app.

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


Currently can only authenticate with Twitter, Google or Github.