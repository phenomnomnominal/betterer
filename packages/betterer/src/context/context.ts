import { createBetterer } from '../betterer';
import { BettererConfig } from '../config';
import { CANT_READ_CONFIG } from '../errors';
import { BettererReporters } from '../reporters';
import { BettererResults, BettererResultsValues, read, write } from './results';
import { BettererRun } from './run';
import { BettererStats } from './statistics';

export class BettererContext {
  private _expected: BettererResultsValues = {};
  private _expectedRaw: BettererResults = {};
  private _results: Array<BettererResults> = [];
  private _runs: ReadonlyArray<BettererRun> = [];

  public static async create(
    config: BettererConfig,
    reporters: BettererReporters
  ): Promise<BettererContext> {
    const context = new BettererContext(config, reporters);
    await context._init();
    return context;
  }

  public get expected(): BettererResultsValues {
    return this._expected;
  }

  public get runs(): ReadonlyArray<BettererRun> {
    return this._runs;
  }

  public getResults(): BettererResults {
    return this._results.reduce((p, n) => {
      return { ...p, ...n };
    }, {});
  }

  private constructor(
    public readonly config: BettererConfig,
    private _reporters: BettererReporters,
    public readonly stats = new BettererStats()
  ) {
    this._reporters.context?.start();
  }

  public async complete(): Promise<BettererStats> {
    this._reporters.context?.complete(this);
    await write(this.getResults(), this.config.resultsPath);
    return this.stats;
  }

  public runnerStart(): void {
    this._reporters.runner?.start();
  }

  public runnerEnd(): void {
    this._reporters.runner?.end();
  }

  public runBetter(run: BettererRun, result: unknown): void {
    const { name } = run;
    this.stats.better.push(name);
    this._reporters.run?.better(run);
    this._results.push(this._createResults(name, result));
  }

  public runEnd(run: BettererRun): void {
    const { hasCompleted, name } = run;
    if (hasCompleted) {
      this.stats.completed.push(name);
    }
  }

  public runFailed(run: BettererRun): void {
    const { name } = run;
    this.stats.failed.push(name);
    this._reporters.run?.failed(run);
  }

  public runNew(run: BettererRun, result: unknown): void {
    const { name } = run;
    this.stats.new.push(name);
    this._reporters.run?.new(run);
    this._results.push(this._createResults(name, result));
  }

  public runRan(run: BettererRun): void {
    this.stats.ran.push(run.name);
  }

  public runSame(run: BettererRun): void {
    const { name } = run;
    this.stats.same.push(name);
    this._reporters.run?.same(run);
  }

  public runSkipped(run: BettererRun): void {
    const { name } = run;
    this.stats.skipped.push(name);
  }

  public runStart(run: BettererRun): void {
    this._reporters.run?.start(run);
  }

  public runWorse(
    run: BettererRun,
    result: unknown,
    serialised: unknown,
    expected: unknown
  ): void {
    const { name } = run;
    this.stats.worse.push(name);
    this._reporters.run?.worse(run, result, serialised, expected);
  }

  private async _init(): Promise<void> {
    this._expectedRaw = await this._initExpected(this.config.resultsPath);
    this._results.push({ ...this._expectedRaw });
    this._expected = this._initExpectedValues(this._expectedRaw);

    this._runs = await this._initRuns(this.config.configPaths);
    this._initFilters(this.config.filters);
    this._initObsolete();
  }

  private async _initRuns(
    configPaths: ReadonlyArray<string> = []
  ): Promise<ReadonlyArray<BettererRun>> {
    let runs: ReadonlyArray<BettererRun> = [];
    await Promise.all(
      configPaths.map(async configPath => {
        const more = await this._getRuns(configPath);
        runs = [...runs, ...more];
      })
    );
    const only = runs.find(run => run.betterer.isOnly);
    if (only) {
      runs.forEach(run => {
        const { betterer } = run;
        if (!betterer.isOnly) {
          betterer.skip();
        }
      });
    }
    return runs;
  }

  private async _initExpected(resultsPath: string): Promise<BettererResults> {
    let expected: BettererResults = {};
    if (resultsPath) {
      expected = await read(resultsPath);
    }
    return expected;
  }

  private _initExpectedValues(
    expected: BettererResults
  ): BettererResultsValues {
    const expectedValues: BettererResultsValues = {};
    Object.keys(expected).forEach(name => {
      expectedValues[name] = JSON.parse(expected[name].value as string);
    });
    return expectedValues;
  }

  private _initFilters(filters: ReadonlyArray<RegExp> = []): void {
    if (filters.length) {
      this.runs.forEach(run => {
        if (!filters.some(filter => filter.test(run.name))) {
          run.betterer.skip();
        }
      });
    }
  }

  private _initObsolete(): void {
    const obsolete = Object.keys(this._expected).filter(
      name => !this.runs.find(run => run.name === name)
    );
    obsolete.forEach(name => {
      delete this._expected[name];
    });
    this.stats.obsolete.push(...obsolete);
  }

  private async _getRuns(configPath: string): Promise<Array<BettererRun>> {
    try {
      const imported = await import(configPath);
      const betterers = imported.default ? imported.default : imported;
      return Object.keys(betterers).map(name => {
        return BettererRun.create(name, this, createBetterer(betterers[name]));
      });
    } catch {
      throw CANT_READ_CONFIG(configPath);
    }
  }

  private _createResults(name: string, value: unknown): BettererResults {
    return {
      [name]: {
        timestamp: Date.now(),
        value
      }
    };
  }
}
