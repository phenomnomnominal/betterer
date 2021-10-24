import { MarkdownDocumenterFeature, IApiDocumenterPluginManifest } from '@microsoft/api-documenter';

class BettererMarkdownDocumenter extends MarkdownDocumenterFeature {}

export const apiDocumenterPluginManifest: IApiDocumenterPluginManifest = {
  manifestVersion: 1000,
  features: [
    {
      featureName: 'betterer-docgen',
      kind: 'MarkdownDocumenterFeature',
      subclass: BettererMarkdownDocumenter
    }
  ]
};
