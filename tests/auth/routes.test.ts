import { Request, Response, Express } from 'express';
import { PassportStatic } from 'passport';
import {
  setAuthRoutes, getProfile, logOut, setGuest,
} from '../../src/auth/routes';
import { UserType } from '../../src/interfaces';

const user = {
  _id: '5cad310f7672ca00146485a8',
  userId: 'twitter test id',
  displayName: 'tester-twitter',
  username: 'twitter-user-name',
  token: 'stub -token',
  service: 'twitter',
  createdAt: 'stub date'
};

describe('Authentication routes', () => {
  let req: {
    user: UserType,
    logout: jest.Mock
  };
  let res: {
    json: jest.Mock,
    redirect: jest.Mock
  };
  beforeEach(() => {
    req = {
      user,
      logout: jest.fn(),
    };
    res = {
      json: jest.fn(),
      redirect: jest.fn(),
    };
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('will get the profile for a user', () => {
    getProfile(req as unknown as Request, res as unknown as Response);
    expect(res.json).toHaveBeenCalledWith({
      authenticated: true,
      userIp: expect.any(String),
      username: 'twitter-user-name',
      userId: '5cad310f7672ca00146485a8',
      displayName: 'tester-twitter',
      service: 'twitter',
      isAdmin: false,
      createdAt: 'stub date'
    });
  });

  test('will set a user as guest', () => {
    setGuest(req as unknown as Request, res as unknown as Response);
    expect(res.json).toHaveBeenCalledWith({
      authenticated: false,
      userIp: expect.any(String),
      username: 'Guest',
      displayName: 'Guest',
      providers: {
        twitter: false,
        google: false,
        github: false,
      },
    });
  });

  test('will log a user out', () => {
    logOut(req as unknown as Request, res as unknown as Response);
    expect(req.logout).toHaveBeenCalled();
    const [[logoutCallback]] = req.logout.mock.calls;
    logoutCallback();
    expect(res.redirect).toHaveBeenCalledWith('/');
  });
});

describe('The app will', () => {
  let app: {
    get: jest.Mock
  };
  let passport: {
    authenticate: jest.Mock
  };
  beforeEach(() => {
    app = {
      get: jest.fn(),
    };
    passport = {
      authenticate: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('set the auth routes', () => {
    setAuthRoutes(app as unknown as Express, passport as unknown as PassportStatic, {
      redirect: {
        successRedirect: '/pins',
        failureRedirect: '/',
      },
    },);
    const allowedRoutes = app.get.mock.calls.map((r) => r[0]);
    expect(allowedRoutes).toEqual([
      '/auth/profile',
      '/auth/guest',
      '/auth/logout',
      '/auth/twitter',
      '/auth/google',
      '/auth/github',
      '/auth/twitter/redirect',
      '/auth/google/redirect',
      '/auth/github/redirect',
    ]);
    expect(passport.authenticate).toHaveBeenCalledTimes(6);
    expect(passport.authenticate.mock.calls[0]).toEqual(['twitter', {}]);
    expect(passport.authenticate.mock.calls[1]).toEqual(['google', { scope: ['profile', 'email'] }]);
    expect(passport.authenticate.mock.calls[2]).toEqual(['github', {}]);
    expect(passport.authenticate.mock.calls[3]).toEqual(['twitter', {
      successRedirect: '/pins',
      failureRedirect: '/',
    }]);
    expect(passport.authenticate.mock.calls[4]).toEqual(['google', {
      successRedirect: '/pins',
      failureRedirect: '/',
    }]);
    expect(passport.authenticate.mock.calls[5]).toEqual(['github', {
      successRedirect: '/pins',
      failureRedirect: '/',
    }]);
  });
});
