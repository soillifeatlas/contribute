import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ strict: false, allErrors: true });
addFormats(ajv);
const schema = JSON.parse(fs.readFileSync('../sop-frontmatter.schema.json', 'utf8'));
const validate = ajv.compile(schema);

const dirs = ['../../sops/_shared', '../../sops/biomass', '../../sops/extract'];
const sopFiles = dirs.flatMap(d =>
  fs.readdirSync(d).filter(f => f.endsWith('.md')).map(f => path.join(d, f))
);

for (const file of sopFiles) {
  test(`SOP frontmatter valid: ${path.basename(file)}`, () => {
    const text = fs.readFileSync(file, 'utf8');
    const m = text.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(m, `no frontmatter in ${file}`);
    const parsed = yaml.load(m[1]);
    const ok = validate(parsed);
    assert.equal(ok, true, JSON.stringify(validate.errors));
  });
}
