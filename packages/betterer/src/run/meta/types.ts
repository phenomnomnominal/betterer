export interface BettererRunMeta {
  readonly hasFilePaths: boolean;
  readonly isCacheable: boolean;
  readonly isFileTest: boolean;
  readonly isNew: boolean;
  readonly isOnly: boolean;
  readonly isSkipped: boolean;
}
