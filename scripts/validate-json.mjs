import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const readJson = async (relativePath) => {
  const filePath = path.join(rootDir, relativePath);
  const contents = await readFile(filePath, 'utf8');
  return JSON.parse(contents);
};

const matchesType = (type, value) => {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && Number.isFinite(value);
    case 'integer':
      return typeof value === 'number' && Number.isInteger(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'array':
      return Array.isArray(value);
    case 'object':
      return typeof value === 'object' && value !== null && !Array.isArray(value);
    default:
      return true;
  }
};

const resolveRef = (schema, ref) => {
  if (!ref.startsWith('#/')) {
    return undefined;
  }
  const pathSegments = ref
    .replace(/^#\//, '')
    .split('/')
    .map((segment) => segment.replace(/~1/g, '/').replace(/~0/g, '~'));
  let current = schema;
  for (const segment of pathSegments) {
    current = current?.[segment];
    if (current === undefined) {
      return undefined;
    }
  }
  return current;
};

const validateSchema = (schema, data, rootSchema, pathSegments, errors) => {
  if (!schema) {
    return;
  }

  if (schema.$ref) {
    const refSchema = resolveRef(rootSchema, schema.$ref);
    if (!refSchema) {
      errors.push({ path: pathSegments.join('.'), message: `Unknown $ref ${schema.$ref}` });
      return;
    }
    validateSchema(refSchema, data, rootSchema, pathSegments, errors);
    return;
  }

  if (schema.anyOf) {
    const matches = schema.anyOf.some((option) => {
      const optionErrors = [];
      validateSchema(option, data, rootSchema, pathSegments, optionErrors);
      return optionErrors.length === 0;
    });

    if (!matches) {
      errors.push({ path: pathSegments.join('.'), message: 'Value does not match anyOf schemas' });
    }
    return;
  }

  if (schema.enum) {
    if (!schema.enum.includes(data)) {
      errors.push({ path: pathSegments.join('.'), message: `Value must be one of ${schema.enum.join(', ')}` });
      return;
    }
  }

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const validType = types.some((type) => matchesType(type, data));
    if (!validType) {
      errors.push({ path: pathSegments.join('.'), message: `Expected type ${types.join(' or ')}` });
      return;
    }
  }

  if (schema.pattern && typeof data === 'string') {
    const regex = new RegExp(schema.pattern);
    if (!regex.test(data)) {
      errors.push({ path: pathSegments.join('.'), message: `Value does not match pattern ${schema.pattern}` });
    }
  }

  if (schema.type === 'object') {
    if (!matchesType('object', data)) {
      errors.push({ path: pathSegments.join('.'), message: 'Expected object' });
      return;
    }
    const required = schema.required ?? [];
    for (const key of required) {
      if (!(key in data)) {
        errors.push({ path: [...pathSegments, key].join('.'), message: 'Missing required property' });
      }
    }

    const properties = schema.properties ?? {};
    const additional = schema.additionalProperties;

    if (schema.minProperties && Object.keys(data).length < schema.minProperties) {
      errors.push({ path: pathSegments.join('.'), message: `Expected at least ${schema.minProperties} properties` });
    }

    for (const [key, value] of Object.entries(data)) {
      const propertySchema = properties[key];
      if (propertySchema) {
        validateSchema(propertySchema, value, rootSchema, [...pathSegments, key], errors);
      } else if (additional === false) {
        errors.push({ path: [...pathSegments, key].join('.'), message: 'Unexpected property' });
      } else if (typeof additional === 'object') {
        validateSchema(additional, value, rootSchema, [...pathSegments, key], errors);
      }
    }
  }

  if (schema.type === 'array') {
    if (!Array.isArray(data)) {
      errors.push({ path: pathSegments.join('.'), message: 'Expected array' });
      return;
    }
    if (schema.minItems && data.length < schema.minItems) {
      errors.push({ path: pathSegments.join('.'), message: `Expected at least ${schema.minItems} items` });
    }
    const itemSchema = schema.items;
    if (itemSchema) {
      data.forEach((item, index) => {
        validateSchema(itemSchema, item, rootSchema, [...pathSegments, String(index)], errors);
      });
    }
  }
};

const validateWithSchema = (schema, data) => {
  const errors = [];
  validateSchema(schema, data, schema, ['root'], errors);
  return errors;
};

const targets = [
  {
    name: 'categories',
    schema: 'schemas/categories.schema.json',
    data: 'data/categories.json'
  },
  {
    name: 'filters',
    schema: 'schemas/filters.schema.json',
    data: 'data/filters.json'
  },
  {
    name: 'vehicles',
    schema: 'schemas/vehicles.schema.json',
    data: 'data/vehicles/vehicles.json'
  }
];

async function validateAll() {
  let hasErrors = false;

  for (const target of targets) {
    try {
      const [schema, data] = await Promise.all([readJson(target.schema), readJson(target.data)]);
      const errors = validateWithSchema(schema, data);
      if (errors.length === 0) {
        console.log(`✅ ${target.name} valid`);
      } else {
        hasErrors = true;
        console.error(`❌ ${target.name} invalid`);
        for (const error of errors) {
          console.error(`  • ${error.path}: ${error.message}`);
        }
      }
    } catch (error) {
      hasErrors = true;
      console.error(`❌ Failed to validate ${target.name}`);
      console.error(error);
    }
  }

  if (hasErrors) {
    process.exitCode = 1;
  } else {
    console.log('All JSON assets validated successfully.');
  }
}

validateAll();
