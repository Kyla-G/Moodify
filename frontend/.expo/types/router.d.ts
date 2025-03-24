/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/nickname-page`; params?: Router.UnknownInputParams; } | { pathname: `/on-boarding-page1`; params?: Router.UnknownInputParams; } | { pathname: `/on-boarding-page2`; params?: Router.UnknownInputParams; } | { pathname: `/on-boarding-page3`; params?: Router.UnknownInputParams; } | { pathname: `/on-boarding-page4`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/calendar-page` | `/calendar-page`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/chatbot-page` | `/chatbot-page`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/emotion-journal-modal` | `/emotion-journal-modal`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/entry-details-page` | `/entry-details-page`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/entry-page` | `/entry-page`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/home-page` | `/home-page`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/mood-selection-modal` | `/mood-selection-modal`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/settings-page` | `/settings-page`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/stats-page` | `/stats-page`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/streak-notif` | `/streak-notif`; params?: Router.UnknownInputParams; } | { pathname: `/services/api`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}/properties/[id]` | `/properties/[id]`, params: Router.UnknownInputParams & { id: string | number; } };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/nickname-page`; params?: Router.UnknownOutputParams; } | { pathname: `/on-boarding-page1`; params?: Router.UnknownOutputParams; } | { pathname: `/on-boarding-page2`; params?: Router.UnknownOutputParams; } | { pathname: `/on-boarding-page3`; params?: Router.UnknownOutputParams; } | { pathname: `/on-boarding-page4`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/calendar-page` | `/calendar-page`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/chatbot-page` | `/chatbot-page`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/emotion-journal-modal` | `/emotion-journal-modal`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/entry-details-page` | `/entry-details-page`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/entry-page` | `/entry-page`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/home-page` | `/home-page`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/mood-selection-modal` | `/mood-selection-modal`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/settings-page` | `/settings-page`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/stats-page` | `/stats-page`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/streak-notif` | `/streak-notif`; params?: Router.UnknownOutputParams; } | { pathname: `/services/api`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(root)'}/properties/[id]` | `/properties/[id]`, params: Router.UnknownOutputParams & { id: string; } };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/nickname-page${`?${string}` | `#${string}` | ''}` | `/on-boarding-page1${`?${string}` | `#${string}` | ''}` | `/on-boarding-page2${`?${string}` | `#${string}` | ''}` | `/on-boarding-page3${`?${string}` | `#${string}` | ''}` | `/on-boarding-page4${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(root)'}${'/(tabs)'}/calendar-page${`?${string}` | `#${string}` | ''}` | `/calendar-page${`?${string}` | `#${string}` | ''}` | `${'/(root)'}${'/(tabs)'}/chatbot-page${`?${string}` | `#${string}` | ''}` | `/chatbot-page${`?${string}` | `#${string}` | ''}` | `${'/(root)'}${'/(tabs)'}/emotion-journal-modal${`?${string}` | `#${string}` | ''}` | `/emotion-journal-modal${`?${string}` | `#${string}` | ''}` | `${'/(root)'}${'/(tabs)'}/entry-details-page${`?${string}` | `#${string}` | ''}` | `/entry-details-page${`?${string}` | `#${string}` | ''}` | `${'/(root)'}${'/(tabs)'}/entry-page${`?${string}` | `#${string}` | ''}` | `/entry-page${`?${string}` | `#${string}` | ''}` | `${'/(root)'}${'/(tabs)'}/home-page${`?${string}` | `#${string}` | ''}` | `/home-page${`?${string}` | `#${string}` | ''}` | `${'/(root)'}${'/(tabs)'}/mood-selection-modal${`?${string}` | `#${string}` | ''}` | `/mood-selection-modal${`?${string}` | `#${string}` | ''}` | `${'/(root)'}${'/(tabs)'}/settings-page${`?${string}` | `#${string}` | ''}` | `/settings-page${`?${string}` | `#${string}` | ''}` | `${'/(root)'}${'/(tabs)'}/stats-page${`?${string}` | `#${string}` | ''}` | `/stats-page${`?${string}` | `#${string}` | ''}` | `${'/(root)'}${'/(tabs)'}/streak-notif${`?${string}` | `#${string}` | ''}` | `/streak-notif${`?${string}` | `#${string}` | ''}` | `/services/api${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/nickname-page`; params?: Router.UnknownInputParams; } | { pathname: `/on-boarding-page1`; params?: Router.UnknownInputParams; } | { pathname: `/on-boarding-page2`; params?: Router.UnknownInputParams; } | { pathname: `/on-boarding-page3`; params?: Router.UnknownInputParams; } | { pathname: `/on-boarding-page4`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/calendar-page` | `/calendar-page`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/chatbot-page` | `/chatbot-page`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/emotion-journal-modal` | `/emotion-journal-modal`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/entry-details-page` | `/entry-details-page`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/entry-page` | `/entry-page`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/home-page` | `/home-page`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/mood-selection-modal` | `/mood-selection-modal`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/settings-page` | `/settings-page`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/stats-page` | `/stats-page`; params?: Router.UnknownInputParams; } | { pathname: `${'/(root)'}${'/(tabs)'}/streak-notif` | `/streak-notif`; params?: Router.UnknownInputParams; } | { pathname: `/services/api`; params?: Router.UnknownInputParams; } | `${'/(root)'}/properties/${Router.SingleRoutePart<T>}` | `/properties/${Router.SingleRoutePart<T>}` | { pathname: `${'/(root)'}/properties/[id]` | `/properties/[id]`, params: Router.UnknownInputParams & { id: string | number; } };
    }
  }
}
