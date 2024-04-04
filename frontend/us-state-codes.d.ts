declare module 'us-state-codes' {
  export interface State {
    code: string;
    name: string;
  }

  const usStateCodes: {
    states: {
      [key: string]: State;
    };
    getStateCodeByStateName(name: string): string | undefined;
    getStateNameByStateCode(code: string): string | undefined;
    sanitizeStateCode(code: string): string | null;
    sanitizeStateName(name: string): string | null;
  };

  export default usStateCodes;
}
