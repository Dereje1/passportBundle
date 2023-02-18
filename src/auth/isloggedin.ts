/* eslint-disable import/no-import-module-exports */
import { Request, Response, NextFunction } from 'express';
import ip from 'ip';
// keys needed to provide available providers to client when not logged in
import { getApiKeys } from '../utils';
// Router-level middleware to verify a logged in user.
const isLoggedInMiddleWare = (req: Request, res:Response, next: NextFunction) => {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();
  // if they aren't populate the profile page accordingly
  const { apiKeysFound: providers } = getApiKeys();
  res.json({
    authenticated: false,
    userIp: ip.address(),
    username: null,
    displayName: null,
    providers,
  });
  return false;
};

export default isLoggedInMiddleWare;