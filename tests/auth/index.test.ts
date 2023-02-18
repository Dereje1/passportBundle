import { Express } from 'express';
import { Model } from 'mongoose';
import authConfig from '../../src/auth/index';
import { UserType } from '../../src/interfaces';

test('Will initialize passport, set routes and use in the app', () => {
  const mockedUse = jest.fn();
  const app = {
    use: mockedUse,
    get: jest.fn(),
  } as unknown as Express;

  const userModel = {} as Model<UserType>

  authConfig(app, userModel);
  const [[passportInitialize], [passportSession]] = mockedUse.mock.calls;
  expect(passportInitialize.name).toBe('initialize');
  expect(passportSession.name).toBe('authenticate');
});
