import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import path from 'path';

type copyRow = {
  key: string;
  text: string;
};

export const readCopy = async () => {
  const file = readFileSync(
    path.join(process.cwd(), 'src/assets/copy.csv')
  ).toString('utf-8');
  const records = parse(file, {
    columns: true,
    skip_empty_lines: true,
    bom: true
  });

  const copy: Record<string, string> = {};

  records.forEach((r: copyRow) => {
    copy[r.key] = r.text;
  });

  return copy;
};
