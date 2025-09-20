import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const vehiclesDir = path.join(rootDir, 'data', 'vehicles');

const usedAttributes = [
  { key: 'mileage_km', label: 'Mileage (km)' },
  { key: 'owners_count', label: 'Number of owners' },
  { key: 'accident_history', label: 'Accident history' },
  { key: 'warranty_status', label: 'Warranty status' },
  { key: 'service_history', label: 'Service history' }
];

const parseCsv = async (filename) => {
  const filePath = path.join(vehiclesDir, filename);
  const contents = await readFile(filePath, 'utf8');
  const lines = contents.trim().split(/\r?\n/);
  const headers = lines.shift()?.split(',') ?? [];

  return lines.map((line) => {
    const cells = line.split(',');
    return headers.reduce((accumulator, header, index) => {
      accumulator[header] = cells[index]?.trim() ?? '';
      return accumulator;
    }, {});
  });
};

const groupTrims = (trimRows) => {
  const grouped = new Map();

  for (const row of trimRows) {
    const modelKey = `${row.brand}:${row.model}`;
    let trimMap = grouped.get(modelKey);
    if (!trimMap) {
      trimMap = new Map();
      grouped.set(modelKey, trimMap);
    }

    const trimKey = row.trim;
    let trim = trimMap.get(trimKey);
    if (!trim) {
      trim = {
        trim: row.trim,
        label: row.trim_label,
        engine: row.engine || undefined,
        drivetrain: row.drivetrain || undefined,
        transmission: row.transmission || undefined,
        fuel: row.fuel || undefined,
        years: []
      };
      trimMap.set(trimKey, trim);
    }

    const year = Number.parseInt(row.year, 10);
    if (!Number.isNaN(year) && !trim.years.includes(year)) {
      trim.years.push(year);
      trim.years.sort((a, b) => a - b);
    }
  }

  return grouped;
};

async function generate() {
  const [brandRows, modelRows, trimRows] = await Promise.all([
    parseCsv('brands.csv'),
    parseCsv('models.csv'),
    parseCsv('trims.csv')
  ]);

  const trimsByModel = groupTrims(trimRows);

  const brands = brandRows.map((brandRow) => {
    const models = modelRows
      .filter((modelRow) => modelRow.brand === brandRow.brand)
      .map((modelRow) => {
        const trimsMap = trimsByModel.get(`${modelRow.brand}:${modelRow.model}`) ?? new Map();
        const trims = Array.from(trimsMap.values());

        if (trims.length === 0) {
          throw new Error(`Model ${modelRow.brand}/${modelRow.model} is missing trims in trims.csv`);
        }

        return {
          model: modelRow.model,
          label: modelRow.label,
          bodyType: modelRow.body_type,
          year_min: Number.parseInt(modelRow.year_start, 10),
          year_max: Number.parseInt(modelRow.year_end, 10),
          trims,
          condition: {
            options: ['new', 'used'],
            usedOnlyAttributes: usedAttributes
          }
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));

    return {
      brand: brandRow.brand,
      label: brandRow.label,
      origin: brandRow.origin,
      popularInKsa: String(brandRow.popular_in_ksa).toLowerCase() === 'true',
      models
    };
  });

  const vehiclesJson = {
    version: '2024-06-01',
    generatedAt: new Date().toISOString(),
    brands
  };

  const outputPath = path.join(vehiclesDir, 'vehicles.json');
  await writeFile(outputPath, JSON.stringify(vehiclesJson, null, 2));
  console.log(`✅ Generated vehicles.json with ${brands.length} brands.`);
}

generate().catch((error) => {
  console.error('Failed to generate vehicles.json');
  console.error(error);
  process.exitCode = 1;
});
