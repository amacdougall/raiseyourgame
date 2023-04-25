// Dan Abramov's useInterval hook
import React, { useState, useEffect, useRef } from 'react';

type IntervalFunction = () => ( unknown | void );

function useInterval(callback: IntervalFunction, delay: number | null) {
  const savedCallback = useRef<IntervalFunction | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    if (delay === null) {
      return;
    }
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    if (delay === null) {
      return;
    }

    function tick() {
      if (savedCallback.current !== null) {
        savedCallback.current();
      }
    }

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;
