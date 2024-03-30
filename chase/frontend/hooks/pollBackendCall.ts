import { useEffect, useState } from "react";

/**
 * Repetetively calls the backend for something. Returns the value and a trigger
 */
export function pollBackendCall<SuccessReturn, Error>(
  apiCall: () => Promise<{ data: SuccessReturn | null; error: Error | null }>,
  intervalDuration = 5000
) {
  const [value, setValue] = useState<SuccessReturn>();

  const trigger = async () => {
    const response = await apiCall();
    //TODO we could do some actual error handling instead of just throwing
    if (response.error) {
      throw new Error(JSON.stringify(response.error));
    }
    if (response.data === null) {
      throw new Error("Invalid state: Response data is null");
    }
    setValue(response.data as SuccessReturn);
  };

  useEffect(() => {
    trigger();
    const interval = setInterval(trigger, intervalDuration);
    return () => clearInterval(interval);
  }, []);

  return { value: value as SuccessReturn, trigger };
}
