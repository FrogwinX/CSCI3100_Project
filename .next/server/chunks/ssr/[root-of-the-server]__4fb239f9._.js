module.exports = {

"[externals]/node:crypto [external] (node:crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}}),
"[project]/src/utils/sessions.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "defaultSession": (()=>defaultSession),
    "getSession": (()=>getSession),
    "readSessionFromRequest": (()=>readSessionFromRequest),
    "sessionOptions": (()=>sessionOptions)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/iron-session/dist/index.js [app-rsc] (ecmascript)");
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
    const { cookies } = await __turbopack_context__.r("[project]/node_modules/next/headers.js [app-rsc] (ecmascript, async loader)")(__turbopack_context__.i);
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getIronSession"])(await cookies(), sessionOptions);
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
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unsealData"])(cookieValue, {
            password: sessionOptions.password
        });
        return data.isLoggedIn ? data : defaultSession;
    } catch (error) {
        console.error("Error reading session in middleware:", error);
        return defaultSession;
    }
}
}}),
"[project]/src/utils/authentication.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"00d347e48e6d2236e1f2b1fadcb1fb08f178d130b4":"logout","40430f2a71e67aa13cdbf0605769d18bb84a35bfd6":"deleteAccount","404da9eeb43196037af4dab8b012da9e43f9a545c4":"login","4066d6a66eb9737e66171d940aee252c055d7cd18b":"requestAuthCode","40c048b43b1da302a737f857ac6e713a2babf0897d":"resetPasswordByOldPassword","40cb66672f88ef1c00befb7cbdd6d35c4b263a80ca":"checkEmailUnique","40ce69f359a29eba6fbcc6e738acab43bb7d81d248":"register","40d20c52fe88820f245da9fe9e2e01fd8e5c0c549d":"requestLicenseKey","40f3840a763cb4c80fad38e7cdb9f729ed4eda1c1c":"resetPasswordByEmail","40fa8c7b08b59c4bdaf5928f4a8f40ddb32d03c911":"checkUsernameUnique"},"",""] */ __turbopack_context__.s({
    "checkEmailUnique": (()=>checkEmailUnique),
    "checkUsernameUnique": (()=>checkUsernameUnique),
    "deleteAccount": (()=>deleteAccount),
    "login": (()=>login),
    "logout": (()=>logout),
    "register": (()=>register),
    "requestAuthCode": (()=>requestAuthCode),
    "requestLicenseKey": (()=>requestLicenseKey),
    "resetPasswordByEmail": (()=>resetPasswordByEmail),
    "resetPasswordByOldPassword": (()=>resetPasswordByOldPassword)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/sessions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
// Helper function for API calls to reduce repetition
async function apiFetch(endpoint, options) {
    try {
        const response = await fetch(`https://flowchatbackend.azurewebsites.net/api/${endpoint}`, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`API error (${endpoint}):`, error);
        return {
            message: "An error occurred during the request",
            data: {}
        };
    }
}
async function login(formData) {
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    try {
        const result = await apiFetch("/Account/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });
        // Successful login
        if (result.data.isPasswordCorrect && result.data.isAccountActive && result.data.user) {
            const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
            // Save user data in session
            session.userId = result.data.user.id;
            session.username = result.data.user.username;
            session.roles = result.data.user.roles;
            session.isLoggedIn = true;
            session.token = result.data.user.token;
            session.avatar = result.data.user.avatar;
            session.email = result.data.user.email;
            await session.save();
        }
        return result;
    } catch  {
        return {
            message: "Login failed",
            data: {
                isPasswordCorrect: false,
                isAccountActive: false,
                user: null
            }
        };
    }
}
async function logout() {
    try {
        // clear session
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
        session.destroy();
    } catch (error) {
        console.error("Logout error:", error);
        return {
            error: "Failed to log out"
        };
    }
}
async function register(formData) {
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const licenseKey = formData.get("licenseKey");
    try {
        const result = await apiFetch("Account/registerAccount", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password,
                licenseKey
            })
        });
        return result;
    } catch  {
        return {
            message: "An error occurred during registration",
            data: {
                user: null,
                isSuccess: false
            }
        };
    }
}
async function requestLicenseKey(email) {
    try {
        const result = await apiFetch("Account/requestLicenseKey", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
            })
        });
        return result;
    } catch  {
        return {
            message: "Failed to request license key",
            data: {
                isSuccess: false
            }
        };
    }
}
async function requestAuthCode(email) {
    try {
        const result = await apiFetch("Account/requestAuthenticationCode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
            })
        });
        return result;
    } catch  {
        return {
            message: "Failed to request authentication code",
            data: {
                isSuccess: false
            }
        };
    }
}
async function checkEmailUnique(email) {
    try {
        return await apiFetch(`Account/isEmailUnique?email=${encodeURIComponent(email)}`);
    } catch  {
        return {
            message: "Failed to check email uniqueness",
            data: {
                isEmailUnique: false
            }
        };
    }
}
async function checkUsernameUnique(username) {
    try {
        return await apiFetch(`Account/isUsernameUnique?username=${encodeURIComponent(username)}`);
    } catch  {
        return {
            message: "Failed to check username uniqueness",
            data: {
                isUsernameUnique: false
            }
        };
    }
}
async function deleteAccount(formData) {
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
        const result = await apiFetch("Account/deleteAccount", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.token}`
            },
            body: JSON.stringify({
                email,
                username,
                password
            })
        });
        return result;
    } catch  {
        return {
            message: "Failed to delete account",
            data: {
                isSuccess: false
            }
        };
    }
}
async function resetPasswordByEmail(formData) {
    const email = formData.get("email");
    const password = formData.get("password");
    const authenticationCode = formData.get("authenticationCode");
    try {
        const result = await apiFetch("Account/resetPasswordByEmail", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                authenticationCode
            })
        });
        return result;
    } catch  {
        return {
            message: "Failed to reset password",
            data: {
                username: null,
                isSuccess: false
            }
        };
    }
}
async function resetPasswordByOldPassword(formData) {
    const email = formData.get("email");
    const oldPassword = formData.get("oldPassword");
    const newPassword = formData.get("newPassword");
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
        const result = await apiFetch("Account/resetPasswordByOldPassword", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.token}`
            },
            body: JSON.stringify({
                email,
                oldPassword,
                newPassword
            })
        });
        return result;
    } catch  {
        return {
            message: "Failed to reset password",
            data: {
                username: null,
                isSuccess: false
            }
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    login,
    logout,
    register,
    requestLicenseKey,
    requestAuthCode,
    checkEmailUnique,
    checkUsernameUnique,
    deleteAccount,
    resetPasswordByEmail,
    resetPasswordByOldPassword
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(login, "404da9eeb43196037af4dab8b012da9e43f9a545c4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(logout, "00d347e48e6d2236e1f2b1fadcb1fb08f178d130b4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(register, "40ce69f359a29eba6fbcc6e738acab43bb7d81d248", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(requestLicenseKey, "40d20c52fe88820f245da9fe9e2e01fd8e5c0c549d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(requestAuthCode, "4066d6a66eb9737e66171d940aee252c055d7cd18b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(checkEmailUnique, "40cb66672f88ef1c00befb7cbdd6d35c4b263a80ca", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(checkUsernameUnique, "40fa8c7b08b59c4bdaf5928f4a8f40ddb32d03c911", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteAccount, "40430f2a71e67aa13cdbf0605769d18bb84a35bfd6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(resetPasswordByEmail, "40f3840a763cb4c80fad38e7cdb9f729ed4eda1c1c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(resetPasswordByOldPassword, "40c048b43b1da302a737f857ac6e713a2babf0897d", null);
}}),
"[project]/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/utils/authentication.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/authentication.ts [app-rsc] (ecmascript)");
;
;
}}),
"[project]/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/utils/authentication.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/authentication.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => "[project]/src/utils/authentication.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/utils/authentication.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00d347e48e6d2236e1f2b1fadcb1fb08f178d130b4": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logout"]),
    "404da9eeb43196037af4dab8b012da9e43f9a545c4": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["login"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/authentication.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => "[project]/src/utils/authentication.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/utils/authentication.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00d347e48e6d2236e1f2b1fadcb1fb08f178d130b4": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00d347e48e6d2236e1f2b1fadcb1fb08f178d130b4"]),
    "404da9eeb43196037af4dab8b012da9e43f9a545c4": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["404da9eeb43196037af4dab8b012da9e43f9a545c4"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => "[project]/src/utils/authentication.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => "[project]/src/utils/authentication.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
}}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/login/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/login/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/login/page.tsx <module evaluation>", "default");
}}),
"[project]/src/app/login/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/login/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/login/page.tsx", "default");
}}),
"[project]/src/app/login/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$login$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/login/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$login$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/app/login/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$login$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/app/login/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/login/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__4fb239f9._.js.map