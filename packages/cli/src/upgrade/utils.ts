import type { ArrowFunction, Node, ObjectLiteralExpression, SourceFile } from 'typescript';

import { tsquery } from '@phenomnomnominal/tsquery';
import { tstemplate } from '@phenomnomnominal/tstemplate';
import { createPrinter, factory, isFunctionLike, isPropertyAssignment } from 'typescript';

export function reparse(upgradedSourceFile: SourceFile, configPath: string): SourceFile {
  return tsquery.ast(createPrinter().printFile(upgradedSourceFile), configPath);
}

// new BettererTest();
// new BettererTest().include();
const NEW_BETTERER_TEST =
  ':matches(CallExpression, NewExpression):has(NewExpression > Identifier[name="BettererTest"])';

// new BettererFileTest();
// new BettererFileTest().include();
const NEW_BETTERER_FILE_TEST =
  ':matches(CallExpression, NewExpression):has(NewExpression > Identifier[name="BettererFileTest"])';

// func();
const TEST_FACTORY_CALL = 'CallExpression';

// { test: foo }
const OBJECT_TEST = 'ObjectLiteralExpression:has(PropertyAssignment:has(Identifier[name="test"]))';

export function wrapTest(node: Node): ArrowFunction | null {
  const [testCall] = tsquery(node, `${NEW_BETTERER_TEST}, ${NEW_BETTERER_FILE_TEST}, ${TEST_FACTORY_CALL}`);
  if (testCall) {
    const code = tstemplate(
      `
() => <%= testCall %>
      `,
      { testCall }
    );
    const [wrapped] = tsquery(code, 'ArrowFunction');
    return wrapped as ArrowFunction;
  }
  const [testObject] = tsquery(node, OBJECT_TEST);
  if (testObject) {
    const code = tstemplate(
      `
() => new BettererTest(%= testObject %)
      `,
      { testObject }
    );
    const [wrapped] = tsquery(code, 'ArrowFunction');
    return wrapped as ArrowFunction;
  }
  return null;
}

export function wrapTests(expression: ObjectLiteralExpression): ObjectLiteralExpression {
  const { properties } = expression;
  return factory.createObjectLiteralExpression(
    properties.map((property) => {
      if (isPropertyAssignment(property) && !isFunctionLike(property.initializer)) {
        const wrapped = wrapTest(property.initializer);
        if (!wrapped) {
          return property;
        }
        return factory.createPropertyAssignment(property.name, wrapped);
      }
      return property;
    })
  );
}
