import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ strict: false, allErrors: true });
addFormats(ajv);
const schema = JSON.parse(fs.readFileSync('../submission.schema.json', 'utf8'));
const validate = ajv.compile(schema);

const load = (f) => JSON.parse(fs.readFileSync(`fixtures/${f}`, 'utf8'));

test('valid T1 bacteria submission passes', () => {
  const ok = validate(load('valid-t1-bacteria.json'));
  assert.equal(ok, true, JSON.stringify(validate.errors));
});

test('valid T2 fungi submission passes', () => {
  const ok = validate(load('valid-t2-fungi.json'));
  assert.equal(ok, true, JSON.stringify(validate.errors));
});

test('T2 without internal standard fails', () => {
  const ok = validate(load('invalid-t2-no-is.json'));
  assert.equal(ok, false);
  const hasIsError = validate.errors.some(e => e.instancePath.includes('internal_standard'));
  assert.equal(hasIsError, true, 'expected internal_standard error');
});
