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
