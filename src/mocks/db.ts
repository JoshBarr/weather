import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import { WeatherLocation } from "@weather/lib/types/locations";

type WeatherAppSession = {
  locations: WeatherLocation[];
};

type MockStore = {
  sessions: Record<string, WeatherAppSession>;
};

const adapter = new JSONFileSync<MockStore>("db.json");
const db = new LowSync(adapter);

const readDb = () => {
  // seed from disk
  db.read();

  if (!db.data) {
    db.data = {
      sessions: {},
    };
  }

  return db.data as MockStore;
};

export function getMockStore() {
  let dbData = readDb();

  const getSession = (sessionId: string) => {
    dbData = readDb();
    const session = dbData.sessions[sessionId];
    return session;
  };

  // Make an empty mock session, if it does not exist yet
  const ensureSession = (sessionId: string) => {
    if (!dbData.sessions[sessionId]) {
      createSession(sessionId, { locations: [] });
    }
  };

  const createSession = (sessionId: string, session: WeatherAppSession) => {
    dbData.sessions[sessionId] = session;
    db.write();
  };

  const getLocation = (sessionId: string, name: string) => {
    ensureSession(sessionId);

    return dbData.sessions[sessionId].locations.find(
      (location) => location.address === name
    );
  };

  const addLocation = (sessionId: string, location: WeatherLocation) => {
    ensureSession(sessionId);
    dbData.sessions[sessionId].locations.push(location);
    db.write();
  };

  const updateLocation = (
    sessionId: string,
    address: string,
    nextData: WeatherLocation
  ) => {
    ensureSession(sessionId);

    const existingIndex = dbData.sessions[sessionId].locations.findIndex(
      (item) => item.address === address
    );

    if (existingIndex < 0) {
      return;
    }

    dbData.sessions[sessionId].locations[existingIndex] = nextData;
    db.write();
  };

  const deleteLocation = (sessionId: string, address: string) => {
    ensureSession(sessionId);

    const existingIndex = dbData.sessions[sessionId].locations.findIndex(
      (item) => item.address === address
    );

    if (existingIndex < 0) {
      return;
    }

    dbData.sessions[sessionId].locations.splice(existingIndex, 1);

    db.write();
  };

  return {
    db,
    getSession,
    createSession,
    getLocation,
    addLocation,
    updateLocation,
    deleteLocation,
  };
}
