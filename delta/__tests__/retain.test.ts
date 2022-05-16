import {
  Delta,
} from '../src';
import {
  DeleteOperation,
  InsertOperation,
  OperationType,
} from '../src/lib/types';

describe('#retain', () => {
  test('first Retain', () => {
    const length = 5;

    const delta = new Delta();

    delta.retain(length);

    expect(delta.length).toBe(1);
    expect(delta.get(0)).toEqual({
      type: OperationType.Retain,
      length,
    });
  });

  test('combine with previous Retain', () => {
    const delta = new Delta([
      {
        type: OperationType.Retain,
        length: 10,
      },
    ]);

    delta.retain(5);

    expect(delta.length).toBe(1);
    expect(delta.get(0)).toEqual({
      type: OperationType.Retain,
      length: 15,
    });
  });

  test('do not combine with previous Insert', () => {
    const length = 5;

    const previousOperation: InsertOperation = {
      type: OperationType.Insert,
      data: 'Hello World!',
      attributes: { bold: true },
    };

    const delta = new Delta([
      previousOperation,
    ]);

    delta.retain(length);

    expect(delta.length).toBe(2);
    expect(delta.get(0)).toEqual(previousOperation);
    expect(delta.get(1)).toEqual({
      type: OperationType.Retain,
      length,
    });
  });

  test('do not combine with previous Delete', () => {
    const length = 5;

    const previousOperation: DeleteOperation = {
      type: OperationType.Delete,
      length: 10,
    };

    const delta = new Delta([
      previousOperation,
    ]);

    delta.retain(length);

    expect(delta.length).toBe(2);
    expect(delta.get(0)).toEqual(previousOperation);
    expect(delta.get(1)).toEqual({
      type: OperationType.Retain,
      length,
    });
  });
});
