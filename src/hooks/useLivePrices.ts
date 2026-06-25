"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type PricesMap = Record<string, number>;

const STABLECOIN_SYMBOLS = new Set([
  "USDT", "USDC", "DAI", "BUSD", "TUSD", "FDUSD", "PYUSD", "USDS", "USDP",
]);

interface CoinRef {
  id: string;
  symbol: string;
}

export function useLivePrices(coins: CoinRef[]) {
  const [prices, setPrices] = useState<PricesMap>({});

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const coinsRef = useRef(coins);
  const intentionallyClosedRef = useRef(false);

  const streamsKey = useMemo(
    () =>
      coins
        .filter(({ symbol }) => !STABLECOIN_SYMBOLS.has(symbol.toUpperCase()))
        .map(({ symbol }) => symbol.toLowerCase())
        .sort()
        .join(","),
    [coins]
  );

  useEffect(() => {
    coinsRef.current = coins;
  }, [coins]);

  useEffect(() => {
    if (!streamsKey) return;

    intentionallyClosedRef.current = false;

    const connect = () => {
      const streams = coinsRef.current
        .filter(({ symbol }) => !STABLECOIN_SYMBOLS.has(symbol.toUpperCase()))
        .map(({ symbol }) => `${symbol.toLowerCase()}usdt@miniTicker`)
        .join("/");

      if (!streams) return;

      const ws = new WebSocket(
        `wss://stream.binance.com:9443/stream?streams=${streams}`
      );
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as {
            data: { s: string; c: string };
          };

          const symbolBase = msg.data.s.replace(/USDT$/i, "").toLowerCase();
          const coin = coinsRef.current.find(
            (c) => c.symbol.toLowerCase() === symbolBase
          );
          if (!coin) return;

          const price = Number(msg.data.c);
          if (!Number.isNaN(price)) {
            setPrices((prev) => ({ ...prev, [coin.id]: price }));
          }
        } catch {
          // Ignore malformed messages.
        }
      };

      ws.onerror = () => ws.close();

      ws.onclose = () => {
        wsRef.current = null;
        if (!intentionallyClosedRef.current) {
          reconnectTimerRef.current = setTimeout(connect, 5000);
        }
      };
    };

    connect();

    return () => {
      intentionallyClosedRef.current = true;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [streamsKey]);

  return prices;
}
