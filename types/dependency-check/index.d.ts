declare module 'dependency-check' {
  type DependencyCheckOptions = {
    path: string;
    entries: Array<string>;
  };

  type DependencyCheckPackage = {
    name: string;
  };

  type DependencyCheckResult = {
    package: DependencyCheckPackage;
    used: Array<string>;
  };

  namespace check {
    export function missing(package: DependencyCheckPackage, used: Array<string>): Promise<Array<string>>;
  }

  function check(options?: DependencyCheckOptions): Promise<DependencyCheckResult>;
  export = check;
}

// TODO: Remove when TypeScript upgraded
type Awaited<T> = T extends null | undefined
  ? T
  : T extends object & { then(onfulfilled: infer F, ...args: infer _): any }
  ? F extends (value: infer V, ...args: infer _) => any
    ? Awaited<V>
    : never
  : T;
