/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams:
        | { pathname: Router.RelativePathString; params?: Router.UnknownInputParams }
        | { pathname: Router.ExternalPathString; params?: Router.UnknownInputParams }
        | { pathname: `/`; params?: Router.UnknownInputParams }
        | { pathname: `/nickname-page`; params?: Router.UnknownInputParams }
        | { pathname: `/on-boarding-page1`; params?: Router.UnknownInputParams }
        | { pathname: `/on-boarding-page2`; params?: Router.UnknownInputParams }
        | { pathname: `/on-boarding-page3`; params?: Router.UnknownInputParams }
        | { pathname: `/on-boarding-page4`; params?: Router.UnknownInputParams }
        | { pathname: `/_sitemap`; params?: Router.UnknownInputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/calendar-page` | `/calendar-page`; params?: Router.UnknownInputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/chatbot-page` | `/chatbot-page`; params?: Router.UnknownInputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/chatbot-rating-modal` | `/chatbot-rating-modal`; params?: Router.UnknownInputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/chatbot-start` | `/chatbot-start`; params?: Router.UnknownInputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/emotion-journal-modal` | `/emotion-journal-modal`; params?: Router.UnknownInputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/end-chat-modal` | `/end-chat-modal`; params?: Router.UnknownInputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/home-page` | `/home-page`; params?: Router.UnknownInputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/mood-selection-modal` | `/mood-selection-modal`; params?: Router.UnknownInputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/settings-page` | `/settings-page`; params?: Router.UnknownInputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/stats-page` | `/stats-page`; params?: Router.UnknownInputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/summary-modal` | `/summary-modal`; params?: Router.UnknownInputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/welcome-modal` | `/welcome-modal`; params?: Router.UnknownInputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/xp-streak-modal` | `/xp-streak-modal`; params?: Router.UnknownInputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/XpStreakManager` | `/XpStreakManager`; params?: Router.UnknownInputParams }
        | { pathname: `${'/(root)'}/properties/themecontext` | `/properties/themecontext`; params?: Router.UnknownInputParams }
        | { pathname: `/services/moodEntriesApi`; params?: Router.UnknownInputParams }
        | { pathname: `/services/type`; params?: Router.UnknownInputParams }
        | { pathname: `${'/(root)'}/properties/[id]` | `/properties/[id]`, params: Router.UnknownInputParams & { id: string | number } };

      hrefOutputParams:
        | { pathname: Router.RelativePathString; params?: Router.UnknownOutputParams }
        | { pathname: Router.ExternalPathString; params?: Router.UnknownOutputParams }
        | { pathname: `/`; params?: Router.UnknownOutputParams }
        | { pathname: `/nickname-page`; params?: Router.UnknownOutputParams }
        | { pathname: `/on-boarding-page1`; params?: Router.UnknownOutputParams }
        | { pathname: `/on-boarding-page2`; params?: Router.UnknownOutputParams }
        | { pathname: `/on-boarding-page3`; params?: Router.UnknownOutputParams }
        | { pathname: `/on-boarding-page4`; params?: Router.UnknownOutputParams }
        | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/calendar-page` | `/calendar-page`; params?: Router.UnknownOutputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/chatbot-page` | `/chatbot-page`; params?: Router.UnknownOutputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/chatbot-rating-modal` | `/chatbot-rating-modal`; params?: Router.UnknownOutputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/chatbot-start` | `/chatbot-start`; params?: Router.UnknownOutputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/emotion-journal-modal` | `/emotion-journal-modal`; params?: Router.UnknownOutputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/end-chat-modal` | `/end-chat-modal`; params?: Router.UnknownOutputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/home-page` | `/home-page`; params?: Router.UnknownOutputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/mood-selection-modal` | `/mood-selection-modal`; params?: Router.UnknownOutputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/settings-page` | `/settings-page`; params?: Router.UnknownOutputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/stats-page` | `/stats-page`; params?: Router.UnknownOutputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/summary-modal` | `/summary-modal`; params?: Router.UnknownOutputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/welcome-modal` | `/welcome-modal`; params?: Router.UnknownOutputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/xp-streak-modal` | `/xp-streak-modal`; params?: Router.UnknownOutputParams }
        | { pathname: `${'/(root)'}${'/(tabs)'}/XpStreakManager` | `/XpStreakManager`; params?: Router.UnknownOutputParams }
        | { pathname: `${'/(root)'}/properties/themecontext` | `/properties/themecontext`; params?: Router.UnknownOutputParams }
        | { pathname: `/services/moodEntriesApi`; params?: Router.UnknownOutputParams }
        | { pathname: `/services/type`; params?: Router.UnknownOutputParams }
        | { pathname: `${'/(root)'}/properties/[id]` | `/properties/[id]`, params: Router.UnknownOutputParams & { id: string } };
      
      href: string; // Keeping the complex string union here is unnecessary since all are represented in the input/output params above
    }
  }
}

