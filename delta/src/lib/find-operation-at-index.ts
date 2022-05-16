import { is } from 'ramda';
import { Operation, OperationType } from './types';

export function findOperationAtIndex(operations: Operation[], index: number) {
  let position = 0;

  let result: Operation | null = null;

  operations.some((operation) => {
    if (operation.type === OperationType.Insert) {
      if (is(String, operation.data)) {
        position += operation.data.length;
      } else {
        position += 1;
      }
    }

    if (index <= position) {
      result = operation;

      return false;
    }

    return true;
  });

  return result;
}
