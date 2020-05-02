export type BettererLoggerMessages = ReadonlyArray<string>;
export type BettererLogger = (...messages: BettererLoggerMessages) => void;

export type BettererLoggerCodeInfo = {
  message: string;
  filePath: string;
  fileText: string;
  start: number;
  end: number;
  hash?: string;
};
