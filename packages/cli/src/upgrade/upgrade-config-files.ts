import { BettererConfigPaths } from '@betterer/betterer';
import { BettererLogger } from '@betterer/logger';
import { tsquery } from '@phenomnomnominal/tsquery';
import { promises as fs } from 'fs';
import {
  createBlock,
  createExportDefault,
  createFunctionExpression,
  createObjectLiteral,
  createPrinter,
  createPropertyAssignment,
  createReturn,
  ExportAssignment,
  isFunctionExpression,
  isPropertyAssignment,
  ObjectLiteralExpression,
  SyntaxKind
} from 'typescript';

export async function run(logger: BettererLogger, absoluteConfigPaths: BettererConfigPaths): Promise<void> {
  await Promise.all(
    absoluteConfigPaths.map(async (configPath) => {
      await logger.progress(`upgrading "${configPath}"...`);

      const fileText = await fs.readFile(configPath, 'utf8');
      const sourceFile = tsquery.ast(fileText, configPath);
      const updated = tsquery.map(sourceFile, 'ExportAssignment:has(PropertyAssignment)', (configExports) => {
        debugger;
        const { expression } = configExports as ExportAssignment;
        if (expression.kind === SyntaxKind.ObjectLiteralExpression) {
          const { properties } = expression as ObjectLiteralExpression;
          return createExportDefault(
            createObjectLiteral(
              properties.map((property) => {
                if (!isPropertyAssignment(property)) {
                  return property;
                }
                if (!isFunctionExpression(property.initializer)) {
                  return createPropertyAssignment(
                    property.name || '',
                    createFunctionExpression(
                      [],
                      undefined,
                      'foo',
                      [],
                      [],
                      undefined,
                      createBlock([createReturn(property.initializer)])
                    )
                  );
                }
                return property;
              })
            )
          );
        }
        if (expression.kind !== SyntaxKind.FunctionExpression) {
          return createFunctionExpression(
            [],
            undefined,
            'foo',
            [],
            [],
            undefined,
            createBlock([createReturn(expression)])
          );
        }
        return configExports;
      });
      const printer = createPrinter();
      debugger;
      const output = printer.printFile(updated);
      console.log(output);
      await fs.writeFile(configPath, output);
    })
  );
}
