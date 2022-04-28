import { last, equals, is } from 'ramda';

export enum OperationType {
  Insert,
  Delete,
  Retain,
  Format,
}

export type OperationData = string | { image: string };

export type OperationAttributes = { bold?: boolean, italic?: boolean, code?: boolean };

export type InsertOperation = {
  type: OperationType.Insert;
  data: OperationData;
  attributes?: OperationAttributes;
};

export type DeleteOperation = {
  type: OperationType.Delete;
  length: number;
};

export type RetainOperation = {
  type: OperationType.Retain;
  length: number;
};

export type Operation = InsertOperation | DeleteOperation | RetainOperation;

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

  public get length() {
    return this.operations.length;
  }

  public get(index: number) {
    return this.operations[index] || null;
  }
}
