import {
  Delta,
  InsertOperation,
  OperationType,
  RetainOperation,
} from '../src';

describe('#delete', () => {
  test('first Delete', () => {
    const length = 5;

    const delta = new Delta();

    delta.delete(length);

    expect(delta.length).toBe(1);
    expect(delta.get(0)).toEqual({
      type: OperationType.Delete,
      length
    });
  })

  test('combine with previous Delete', () => {
    const delta = new Delta([
      {
        type: OperationType.Delete,
        length: 10,
      }
    ]);

    delta.delete(5);

    expect(delta.length).toBe(1);
    expect(delta.get(0)).toEqual({
      type: OperationType.Delete,
      length: 15
    });
  })

  test('do not combine with previous Insert', () => {
    const length = 5;

    const previousOperation: InsertOperation = {
      type: OperationType.Insert,
      data: 'Hello World!',
      attributes: { bold: true }
    };

    const delta = new Delta([
      previousOperation,
    ]);

    delta.delete(length);

    expect(delta.length).toBe(2);
    expect(delta.get(0)).toEqual(previousOperation);
    expect(delta.get(1)).toEqual({
      type: OperationType.Delete,
      length,
    });
  })

  test('do not combine with previous Retain', () => {
    const length = 5;

    const previousOperation: RetainOperation = {
      type: OperationType.Retain,
      length: 10,
    };

    const delta = new Delta([
      previousOperation,
    ]);

    delta.delete(length);

    expect(delta.length).toBe(2);
    expect(delta.get(0)).toEqual(previousOperation);
    expect(delta.get(1)).toEqual({
      type: OperationType.Delete,
      length,
    });
  })
});
