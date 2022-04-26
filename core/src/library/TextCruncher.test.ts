import { TextCruncher } from './TextCruncher';

describe('TextCruncher', () => {
  const cases = [
    {
      input: {
        bulkIngest: '**bold',
        ingest: '*'
      },
      output: '**bold*'
    },
    {
      input: {
        bulkIngest: '**bold',
        ingest: '**'
      },
      output: '<b>bold</b>'
    },
    {
      input: {
        bulkIngest: '***bold and italic',
        ingest: '**'
      },
      output: '***bold and italic**'
    },
    {
      input: {
        bulkIngest: '***bold and italic',
        ingest: '***'
      },
      output: '<i><b>bold and italic</b></i>'
    },
    {
      input: {
        bulkIngest: '**bold and *nested italic',
        ingest: '*'
      },
      output: '**bold and <i>nested italic</i>'
    },
    {
      input: {
        bulkIngest: '**bold and *nested italic*',
        ingest: '*'
      },
      output: '**bold and <i>nested italic</i>*'
    },
    {
      input: {
        bulkIngest: '**bold and *nested italic**',
        ingest: '*'
      },
      output: '<b>bold and <i>nested italic</i></b>'
    },
    {
      input: {
        bulkIngest: '****bold*',
        ingest: '*'
      },
      output: '****bold**'
    },
    {
      input: {
        bulkIngest: '***bold **bold*',
        ingest: '****'
      },
      output: '<i><b>bold <b>bold</b></b></i>'
    },
    {
      input: {
        bulkIngest: '***bold **bold*',
        ingest: '****x'
      },
      output: '<i><b>bold <b>bold</b></b></i>x'
    },
    {
      input: {
        bulkIngest: '***bold *italic',
        ingest: '****'
      },
      output: '<i><b>bold <i>italic</i></b></i>'
    },
    // {
    //   input: {
    //     bulkIngest: '****bold***',
    //     ingest: '*'
    //   },
    //   output: '<i><b><i>bold</i></b></i>'
    // },
  ];

  for (const { input, output } of cases) {
    test('produce correct text', () => {
      const cruncher = new TextCruncher();
      cruncher.bulkIngest(input.bulkIngest);

      for (const c of input.ingest) {
        cruncher.ingest(c);
      }

      expect(cruncher.html).toEqual(output);
    })
  }

});
