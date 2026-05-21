import { a as defineEventHandler } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _____ = defineEventHandler(() => {
  return { message: "API proxy - use NUXT_PUBLIC_API_BASE for backend" };
});

export { _____ as default };
//# sourceMappingURL=_..._.mjs.map
