const CHUNK_PUBLIC_PATH = "server/app/api/[...action]/route.js";
const runtime = require("../../../chunks/[turbopack]_runtime.js");
runtime.loadChunk("server/chunks/node_modules_next_headers_e8158a58.js");
runtime.loadChunk("server/chunks/node_modules_92b7b76e._.js");
runtime.loadChunk("server/chunks/[root-of-the-server]__41d0e46b._.js");
runtime.getOrInstantiateRuntimeModule("[project]/.next-internal/server/app/api/[...action]/route/actions.js [app-rsc] (server actions loader, ecmascript)", CHUNK_PUBLIC_PATH);
runtime.getOrInstantiateRuntimeModule("[project]/node_modules/next/dist/esm/build/templates/app-route.js { INNER_APP_ROUTE => \"[project]/src/app/api/[...action]/route.ts [app-route] (ecmascript)\" } [app-route] (ecmascript)", CHUNK_PUBLIC_PATH);
module.exports = runtime.getOrInstantiateRuntimeModule("[project]/node_modules/next/dist/esm/build/templates/app-route.js { INNER_APP_ROUTE => \"[project]/src/app/api/[...action]/route.ts [app-route] (ecmascript)\" } [app-route] (ecmascript)", CHUNK_PUBLIC_PATH).exports;
