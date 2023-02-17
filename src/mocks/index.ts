async function initMocks() {
  if (typeof window === "undefined") {
    const { server } = await import("./server");
    server.listen();
    console.log("msw installed");
  } else {
    const { worker } = await import("./browser");
    worker.start();
  }
}

initMocks();

export {};
