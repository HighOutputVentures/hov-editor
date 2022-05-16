import { Delta } from '../src';
import { Operation, OperationType } from '../src/lib/types';

describe('#compose', () => {
  const cases: {
    initial: Operation[];
    operations: Operation[];
    final: Operation[]
  }[] = [
    {
      initial: [],
      operations: [
        {
          type: OperationType.Insert,
          data: 'Hello World!',
        },
      ],
      final: [
        {
          type: OperationType.Insert,
          data: 'Hello World!',
        },
      ],
    },
    {
      initial: [
        {
          type: OperationType.Insert,
          data: 'World!',
        },
      ],
      operations: [
        {
          type: OperationType.Insert,
          data: 'Hello ',
        },
      ],
      final: [
        {
          type: OperationType.Insert,
          data: 'Hello World!',
        },
      ],
    },
    {
      initial: [
        {
          type: OperationType.Insert,
          data: 'Hello ',
        },
      ],
      operations: [
        {
          type: OperationType.Retain,
          length: 6,
        },
        {
          type: OperationType.Insert,
          data: 'World!',
        },
      ],
      final: [
        {
          type: OperationType.Insert,
          data: 'Hello World!',
        },
      ],
    },
  ];

  cases.forEach(({ initial, operations, final }) => {
    test(`operations are applied correctly: ${JSON.stringify({ initial, operations, final })}`, () => {
      const delta = new Delta(initial);

      const result = delta.compose(new Delta(operations));

      final.forEach((operation, index) => {
        expect(result.get(index)).toEqual(operation);
      });
    });
  });
});
