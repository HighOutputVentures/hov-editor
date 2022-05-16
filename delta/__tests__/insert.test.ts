import {
  Delta,
} from '../src';
import {
  DeleteOperation,
  InsertOperation,
  OperationType,
  RetainOperation,
} from '../src/lib/types';

describe('#insert', () => {
  test('first Insert', () => {
    const data = 'Hello World!';
    const attributes = { bold: true };

    const delta = new Delta();

    delta.insert(data, attributes);

    expect(delta.length).toBe(1);
    expect(delta.get(0)).toEqual({
      type: OperationType.Insert,
      data,
      attributes,
    });
  });

  test('combine with previous Insert', () => {
    const attributes = { bold: true };

    const delta = new Delta([
      {
        type: OperationType.Insert,
        data: 'Hello',
        attributes,
      },
    ]);

    delta.insert(' World!', attributes);

    expect(delta.length).toBe(1);
    expect(delta.get(0)).toEqual({
      type: OperationType.Insert,
      data: 'Hello World!',
      attributes,
    });
  });

  test('do not combine with previous Insert with different attributes', () => {
    const attributes = { bold: true };

    const previousOperation: InsertOperation = {
      type: OperationType.Insert,
      data: 'Hello',
    };

    const delta = new Delta([previousOperation]);

    delta.insert(' World!', attributes);

    expect(delta.length).toBe(2);
    expect(delta.get(0)).toEqual(previousOperation);
    expect(delta.get(1)).toEqual({
      type: OperationType.Insert,
      data: ' World!',
      attributes,
    });
  });

  test('do not combile with previous Delete', () => {
    const data = 'Hello World!';
    const attributes = { bold: true };

    const previousOperation: DeleteOperation = {
      type: OperationType.Delete,
      length: 5,
    };

    const delta = new Delta([
      previousOperation,
    ]);

    delta.insert(data, attributes);

    expect(delta.length).toBe(2);
    expect(delta.get(0)).toEqual(previousOperation);
    expect(delta.get(1)).toEqual({
      type: OperationType.Insert,
      data,
      attributes,
    });
  });

  test('do not combile with previous Retain', () => {
    const data = 'Hello World!';
    const attributes = { bold: true };

    const previousOperation: RetainOperation = {
      type: OperationType.Retain,
      length: 5,
    };

    const delta = new Delta([
      previousOperation,
    ]);

    delta.insert(data, attributes);

    expect(delta.length).toBe(2);
    expect(delta.get(0)).toEqual(previousOperation);
    expect(delta.get(1)).toEqual({
      type: OperationType.Insert,
      data,
      attributes,
    });
  });
});
