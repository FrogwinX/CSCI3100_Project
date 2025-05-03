module.exports = {

"[project]/.next-internal/server/app/api/[...action]/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/node:crypto [external] (node:crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}}),
"[project]/src/utils/sessions.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "defaultSession": (()=>defaultSession),
    "getSession": (()=>getSession),
    "readSessionFromRequest": (()=>readSessionFromRequest),
    "sessionOptions": (()=>sessionOptions)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/iron-session/dist/index.js [app-route] (ecmascript)");
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
    const { cookies } = await __turbopack_context__.r("[project]/node_modules/next/headers.js [app-route] (ecmascript, async loader)")(__turbopack_context__.i);
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getIronSession"])(await cookies(), sessionOptions);
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
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unsealData"])(cookieValue, {
            password: sessionOptions.password
        });
        return data.isLoggedIn ? data : defaultSession;
    } catch (error) {
        console.error("Error reading session in middleware:", error);
        return defaultSession;
    }
}
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/app/api/[...action]/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "DELETE": (()=>DELETE),
    "GET": (()=>GET),
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/sessions.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
// Backend API URL
const API_BASE_URL = "https://flowchatbackend.azurewebsites.net/api";
// Helper function to get token and user ID from session
async function getAuthInfo() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])();
    const token = session.token ? `Bearer ${session.token}` : "";
    const userId = session.userId ?? null;
    return {
        token,
        userId
    };
}
// Helper function to handle API responses
async function handleApiResponse(response) {
    if (!response.ok) {
        // Forward the error status and potentially the body from the backend
        const errorBody = await response.text();
        console.error(`Backend API Error (${response.status}): ${errorBody}`);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](errorBody || response.statusText, {
            status: response.status
        });
    }
    const contentType = response.headers.get("content-type");
    // Handle image responses
    if (contentType && contentType.includes("image")) {
        const imageData = await response.arrayBuffer();
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](imageData, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable"
            }
        });
    }
    // Handle JSON responses (default)
    try {
        const data = await response.json();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data);
    } catch (error) {
        // Handle cases where response is not JSON but status is OK (e.g., empty body)
        console.error("Error parsing JSON response, but status was OK:", error);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](null, {
            status: response.status
        }); // Return OK with empty body
    }
}
async function POST(request, props) {
    const params = await props.params;
    const actionPath = params.action.join("/");
    const { token } = await getAuthInfo();
    let response;
    // Check if it's the image upload endpoint
    if (actionPath === "Image/uploadImage") {
        // Handle FormData for image upload
        const formData = await request.formData();
        response = await fetch(`${API_BASE_URL}/${actionPath}`, {
            method: "POST",
            headers: {
                Authorization: token
            },
            body: formData
        });
    } else {
        // Handle JSON body for other POST requests
        try {
            const body = await request.json();
            response = await fetch(`${API_BASE_URL}/${actionPath}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                },
                body: JSON.stringify(body)
            });
        } catch (error) {
            // Handle cases where request is not image upload but body isn't valid JSON
            console.error("Error parsing JSON body for non-image POST request:", error);
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"]("Invalid JSON body", {
                status: 400
            });
        }
    }
    return handleApiResponse(response);
}
async function DELETE(request, props) {
    const params = await props.params;
    const actionPath = params.action.join("/");
    const body = await request.json();
    const { token } = await getAuthInfo();
    const response = await fetch(`${API_BASE_URL}/${actionPath}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify(body)
    });
    return handleApiResponse(response);
}
async function GET(request, props) {
    const params = await props.params;
    const actionPath = params.action.join("/");
    const url = new URL(request.url);
    const searchParams = url.search;
    const { token, userId } = await getAuthInfo();
    const response = await fetch(`${API_BASE_URL}/${actionPath}${searchParams}&userId=${userId}`, {
        method: "GET",
        headers: {
            Authorization: token
        }
    });
    return handleApiResponse(response);
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__41d0e46b._.js.map