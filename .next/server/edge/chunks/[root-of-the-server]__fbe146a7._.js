(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__fbe146a7._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[project]/src/utils/sessions.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "defaultSession": (()=>defaultSession),
    "getSession": (()=>getSession),
    "readSessionFromRequest": (()=>readSessionFromRequest),
    "sessionOptions": (()=>sessionOptions)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/iron-session/dist/index.js [middleware-edge] (ecmascript)");
;
const defaultSession = {
    isLoggedIn: false
};
const sessionOptions = {
    password: process.env.SESSION_SECRET || (("TURBOPACK compile-time truthy", 1) ? "FALLBACK_DEVELOPMENT_SECRET_KEY_IF_NO_ENV_FILE" : ("TURBOPACK unreachable", undefined)),
    cookieName: "flowchat_session",
    cookieOptions: {
        // secure should be true in production
        secure: ("TURBOPACK compile-time value", "development") === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24
    }
};
async function getSession() {
    const { cookies } = await Promise.resolve().then(()=>__turbopack_context__.i("[project]/node_modules/next/dist/esm/api/headers.js [middleware-edge] (ecmascript)"));
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getIronSession"])(await cookies(), sessionOptions);
    // Initialize the session if not already done
    if (!session.isLoggedIn) {
        session.isLoggedIn = false;
    }
    return session;
}
async function readSessionFromRequest(req) {
    try {
        const cookieValue = req.cookies.get(sessionOptions.cookieName)?.value;
        if (!cookieValue) {
            return defaultSession;
        }
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["unsealData"])(cookieValue, {
            password: sessionOptions.password
        });
        return data.isLoggedIn ? data : defaultSession;
    } catch (error) {
        console.error("Error reading session in middleware:", error);
        return defaultSession;
    }
}
}}),
"[project]/src/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessions$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/sessions.ts [middleware-edge] (ecmascript)");
;
;
async function middleware(request) {
    const path = request.nextUrl.pathname;
    // Forum default route handling
    if (path === "/forum" || path === "/forum/") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/forum/latest", request.url));
    }
    // Define path categories
    const authPaths = [
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password"
    ];
    const isAuthPath = authPaths.includes(path);
    const isRoot = path === "/";
    // Get session state
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessions$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["readSessionFromRequest"])(request);
    const isAuthenticated = session.isLoggedIn;
    // Redirect logic
    if (isAuthenticated && isRoot) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/forum/latest", request.url));
    }
    if (isAuthenticated && isAuthPath) {
        // Authenticated users shouldn't access auth pages
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/", request.url));
    }
    if (!isAuthenticated && !isAuthPath) {
        // Unauthenticated users can only access auth pages
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login", request.url));
    }
    // Default: allow the navigation
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.swa).*)"
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__fbe146a7._.js.map