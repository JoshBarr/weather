type stateListener = (state: boolean) => void;
type messageListener = (event: MessageEvent<any>) => void;

/**
 * See https://stackoverflow.com/questions/62768520/reconnecting-web-socket-using-react-hooks
 */
export function reconnectingSocket(url: string) {
  let client: WebSocket;
  let isConnected = false;
  let reconnectOnClose = true;
  let messageListeners: messageListener[] = [];
  let stateChangeListeners: stateListener[] = [];

  function on(fn: messageListener) {
    messageListeners.push(fn);
  }

  function off(fn: messageListener) {
    messageListeners = messageListeners.filter((l) => l !== fn);
  }

  function onStateChange(fn: stateListener) {
    stateChangeListeners.push(fn);
    return () => {
      stateChangeListeners = stateChangeListeners.filter((l) => l !== fn);
    };
  }

  function start() {
    client = new WebSocket(url);
    console.log("starting ws");

    client.onopen = () => {
      isConnected = true;
      stateChangeListeners.forEach((fn) => fn(true));
    };

    const close = client.close;

    // Close without reconnecting;
    client.close = () => {
      reconnectOnClose = false;
      close.call(client);
    };

    client.onmessage = (event) => {
      messageListeners.forEach((fn) => fn(event));
    };

    client.onerror = (e) => console.error(e);

    client.onclose = () => {
      isConnected = false;
      stateChangeListeners.forEach((fn) => fn(false));

      if (!reconnectOnClose) {
        console.log("ws closed by app");
        return;
      }

      console.log("ws closed by server");

      setTimeout(start, 1000);
    };
  }

  start();

  return {
    on,
    off,
    onStateChange,
    send: (event: unknown) => {
      if (!client.OPEN) {
        return;
      }

      client.send(JSON.stringify(event));
    },
    close: () => client.close(),
    getClient: () => client,
    isConnected: () => isConnected,
  };
}
