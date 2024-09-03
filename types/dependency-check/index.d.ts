declare module 'dependency-check' {
  interface DependencyCheckOptions {
    path: string;
    entries: Array<string>;
  }

  interface DependencyCheckPackage {
    name: string;
  }

  interface DependencyCheckResult {
    package: DependencyCheckPackage;
    used: Array<string>;
  }

  namespace check {
    export function missing(package: DependencyCheckPackage, used: Array<string>): Promise<Array<string>>;
  }

  function check(options?: DependencyCheckOptions): Promise<DependencyCheckResult>;
  export = check;
}
