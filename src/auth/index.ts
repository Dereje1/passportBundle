/* eslint-disable import/no-import-module-exports */
import { Express } from 'express';
import { Model } from 'mongoose';
// Index for authentication
import passport from 'passport';
import { setAuthRoutes } from './routes';
import { passportConfig } from './passportConfig';
import { UserType, OptionsType } from '../interfaces';

const configEntry = (app: Express, User: Model<UserType>, options?: OptionsType) => {
  passportConfig(passport, User); // pass passport for configuration
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  // routes ======================================================================
  setAuthRoutes(app, passport, options);
};

export default configEntry;
