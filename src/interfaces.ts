export interface UserType {
    _id: string,
    userId: string,
    token: string,
    displayName: string | null,
    username: string,
    service: string,
}

export interface apiKeys {
    twitterApiKeys: {
        consumerKey: string
        consumerSecret: string
        callbackURL: string
    } | null
    googleApiKeys: {
        clientID: string
        clientSecret: string
        callbackURL: string
    } | null
    githubApiKeys: {
        clientID: string
        clientSecret: string
        callbackURL: string
    } | null
}

export interface genericResponseType {
    json: (res: string | unknown) => void
    end: () => void
    redirect: (route: string) => void
}

export interface OptionsType {
    redirect:{
      successRedirect: string
      failureRedirect: string
    }
  }