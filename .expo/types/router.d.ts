/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/screens/HomeScreen`; params?: Router.UnknownInputParams; } | { pathname: `/screens/ProfileScreen`; params?: Router.UnknownInputParams; } | { pathname: `/screens/SearchScreen`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/screens/HomeScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/screens/ProfileScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/screens/SearchScreen`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/screens/HomeScreen${`?${string}` | `#${string}` | ''}` | `/screens/ProfileScreen${`?${string}` | `#${string}` | ''}` | `/screens/SearchScreen${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/screens/HomeScreen`; params?: Router.UnknownInputParams; } | { pathname: `/screens/ProfileScreen`; params?: Router.UnknownInputParams; } | { pathname: `/screens/SearchScreen`; params?: Router.UnknownInputParams; };
    }
  }
}
