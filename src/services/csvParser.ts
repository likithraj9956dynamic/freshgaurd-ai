export interface ParseResult<T> {
  validRecords: T[];
  rejectedRecords: { row: number; data: Record<string, any>; reason: string }[];
  totalRows: number;
}

export class CsvParser {
  /**
   * Parse CSV string into array of object records
   */
  static parse(csvText: string): Record<string, string>[] {
    const lines = csvText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) {
      return [];
    }

    const headerLine = lines[0];
    const headers = this.splitCsvLine(headerLine).map((h) => h.trim().toLowerCase());

    const records: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.splitCsvLine(lines[i]);
      if (values.length === 0 || (values.length === 1 && !values[0])) continue;

      const record: Record<string, string> = {};
      headers.forEach((header, index) => {
        record[header] = values[index] !== undefined ? values[index].trim() : '';
      });
      records.push(record);
    }

    return records;
  }

  private static splitCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }

  /**
   * Validate required columns exist in the record headers
   */
  static validateHeaders(
    records: Record<string, any>[],
    requiredColumns: string[]
  ): { valid: boolean; missingColumns: string[] } {
    if (records.length === 0) {
      return { valid: false, missingColumns: requiredColumns };
    }

    const availableColumns = Object.keys(records[0]).map((c) => c.toLowerCase());
    const missingColumns = requiredColumns.filter((col) => !availableColumns.includes(col.toLowerCase()));

    return {
      valid: missingColumns.length === 0,
      missingColumns,
    };
  }
}
