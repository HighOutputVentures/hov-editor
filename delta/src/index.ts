import {
  last, equals, is, clone, range,
} from 'ramda';
import {
  Operation, OperationAttributes, OperationData, OperationType,
} from './lib/types';

export class Delta {
  private operations: Readonly<Operation>[] = [];

  constructor(operations: Operation[] = []) {
    this.operations = operations;
  }

  public insert(data: OperationData, attributes?: OperationAttributes): Delta {
    const operation: Operation = {
      type: OperationType.Insert,
      data,
      attributes,
    };

    const previous = last(this.operations);

    if (previous && previous.type === OperationType.Insert
      && is(String, previous.data)
      && is(String, operation.data)
      && equals(operation.attributes, previous.attributes)) {
      const combination = {
        ...previous,
        data: previous.data + operation.data,
      };

      this.operations.pop();
      this.operations.push(combination);

      return this;
    }

    this.operations.push(operation);

    return this;
  }

  public delete(length: number): Delta {
    const operation: Operation = {
      type: OperationType.Delete,
      length,
    };

    const previous = last(this.operations);

    if (previous && previous.type === OperationType.Delete) {
      const combination = {
        ...previous,
        length: previous.length + operation.length,
      };

      this.operations.pop();
      this.operations.push(combination);

      return this;
    }

    this.operations.push(operation);

    return this;
  }

  public retain(length: number): Delta {
    const operation: Operation = {
      type: OperationType.Retain,
      length,
    };

    const previous = last(this.operations);

    if (previous && previous.type === OperationType.Retain) {
      const combination = {
        ...previous,
        length: previous.length + operation.length,
      };

      this.operations.pop();
      this.operations.push(combination);

      return this;
    }

    this.operations.push(operation);

    return this;
  }

  public compose(delta: Delta): Delta {
    const operations = clone(this.operations);

    range(0, delta.length).forEach((index) => {
      const operation = delta.get(index);

      if (operation.type === OperationType.Insert) {
        operations.push(operation);
      }
    });

    return new Delta(operations);
  }

  public get length() {
    return this.operations.length;
  }

  public get(index: number) {
    return this.operations[index] || null;
  }
}
