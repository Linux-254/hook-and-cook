import { useState, useEffect } from "react";
import { siteConfig } from "../config/site.config";

export interface OpenNowStatus {
  isOpen: boolean;
  statusText: string;
  nextEventText: string;
}

export function useOpenNow(): OpenNowStatus {
  const [status, setStatus] = useState<OpenNowStatus>(() => computeStatus());

  function computeStatus(): OpenNowStatus {
    try {
      // Format current time into Nairobi timezone
      const now = new Date();
      const nairobiString = now.toLocaleString("en-US", { timeZone: siteConfig.hoursDetail.timezone });
      const nairobiDate = new Date(nairobiString);

      const hour = nairobiDate.getHours();
      const minute = nairobiDate.getMinutes();

      // Hook & Cook hours: 11:00 AM to 1:00 AM next day
      // 11:00 -> 23:59: OPEN
      // 00:00 -> 00:59: OPEN (still open from previous calendar day)
      // 01:00 -> 10:59: CLOSED
      const isOpen = hour >= 11 || hour === 0;

      if (isOpen) {
        return {
          isOpen: true,
          statusText: "Open now until 1:00 AM",
          nextEventText: "Kitchen & bar serving late tonight",
        };
      } else {
        const hoursUntilOpen = 11 - hour;
        return {
          isOpen: false,
          statusText: "Opens at 11:00 AM",
          nextEventText: `Serving lunch, dinner & late lounge in ${hoursUntilOpen > 0 ? hoursUntilOpen + "h" : "a few hours"}`,
        };
      }
    } catch {
      // Fallback
      return {
        isOpen: true,
        statusText: "Open daily 11:00 AM – 1:00 AM",
        nextEventText: "Serving late nights in Nairobi",
      };
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus(computeStatus());
    }, 60000); // Recheck every minute

    return () => clearInterval(timer);
  }, []);

  return status;
}
