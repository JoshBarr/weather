export const MockTools: React.FC<{
  isSocketOpen: boolean;
  len: number;
  simulateWebSocketEvent: () => void;
}> = ({ isSocketOpen, len, simulateWebSocketEvent }) => {
  const isEnabled = isSocketOpen && len > 0;

  return (
    <div className="z-20 fixed bottom-0 left-0 right-0 p-3 text-sm bg-slate-800 text-slate-400">
      <span className="mr-4">Mock tools</span>
      <button
        disabled={!isEnabled}
        onClick={simulateWebSocketEvent}
        className={`text-slate-100 bg-slate-700 py-1 px-2 rounded-sm ${
          isEnabled ? "" : "opacity-50"
        }`}
      >
        Simulate push refresh from weather server
      </button>
      <span className="text-xs">
        {" - "}
        This also has a chance of simulating rain at the location
      </span>
    </div>
  );
};
