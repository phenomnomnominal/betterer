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
