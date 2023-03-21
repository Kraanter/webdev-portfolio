'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.generateGroupCode = void 0;
const randomstring_1 = __importDefault(require('randomstring'));
const database_1 = require('../database');
async function generateGroupCode(client) {
  // Generate a random 4-character string using letters and numbers
  const code = randomstring_1.default.generate({
    length: 4,
    charset: 'alphanumeric',
  });
  // Check if the code is already in use in the database
  // If it is, generate a new code recursively
  const check = await (0, database_1.checkGroupCode)(code, client);
  if (check) {
    return await generateGroupCode(client);
  }
  return code;
}
exports.generateGroupCode = generateGroupCode;
//# sourceMappingURL=groupCode.js.map
