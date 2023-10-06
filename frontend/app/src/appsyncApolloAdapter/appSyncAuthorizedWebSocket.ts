import { asBase64EncodedJson } from './encodingUtils';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createAppSyncAuthorizedWebSocket = (
  getAppSyncAuthorizationInfo: () => Promise<Record<string, string>>,
) => {
  return class extends WebSocket {
    // SubscriptionClient takes a fixed websocket url so we append query string parameters every time the websocket
    // is created, in case the authorization information has changed.
    constructor(url: string, protocols = undefined) {
      super(
        `${url}?header=${asBase64EncodedJson(
          getAppSyncAuthorizationInfo(),
        )}&payload=${asBase64EncodedJson({})}`,
        protocols,
      );
    }

    // AppSync acknowledges GraphQL subscriptions with "start_ack" messages but SubscriptionClient cannot handle them
    set onmessage(handler: (this: WebSocket, event: MessageEvent) => unknown) {
      super.onmessage = event => {
        if (event.data !== undefined) {
          const data = this._tryParseJsonString(event.data as string);

          if (data && data.type === 'start_ack') {
            return;
          }
        }

        return handler(event);
      };
    }

    _tryParseJsonString(jsonString: string) {
      try {
        return JSON.parse(jsonString) as object;
      } catch (e) {
        return undefined;
      }
    }
  };
};
