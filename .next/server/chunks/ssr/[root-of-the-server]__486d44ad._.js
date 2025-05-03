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
"[project]/src/utils/posts.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"00ea58ac1cac156effee2a42784344f8a6315042d2":"getAllTags","400f4e9440d1f535054541e77b34a614f79fb16664":"getSearchPosts","40dce588911040281a23d1a5c8c49e04ac16d57a05":"getPosts","40f14b3bfd677ce91ef1e92df13e32d64b934adddd":"getPostById","78aea39e016b203b6a3d92e9ea7edbbc12594df80a":"createPost","7ea5fe3613fb40e28ae354fcac269aa95cbb0f309e":"updatePost"},"",""] */ __turbopack_context__.s({
    "createPost": (()=>createPost),
    "getAllTags": (()=>getAllTags),
    "getPostById": (()=>getPostById),
    "getPosts": (()=>getPosts),
    "getSearchPosts": (()=>getSearchPosts),
    "updatePost": (()=>updatePost)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/sessions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getAllTags() {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
        const apiUrl = `https://flowchatbackend.azurewebsites.net/api/Forum/getAllTag`;
        // Fetch data from the API
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        });
        // If API call fails, use mock data
        if (!response.ok) {
            console.log(`Mock tags are returned due to API request failed with status ${response.status}`);
            return [];
        }
        const data = await response.json();
        return data.data.tagList;
    } catch (error) {
        console.error("Error fetching tags:", error);
        return [];
    }
}
async function getPosts(options = {}) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
        // Build the API URL based on the filter
        let apiUrl = "https://flowchatbackend.azurewebsites.net/api/Forum/";
        switch(options.filter){
            case "latest":
                apiUrl += `getLatestPostPreviewList?`;
                break;
            case "recommended":
                apiUrl += "getRecommendedPostPreviewList?";
                break;
            case "following":
                apiUrl += "getFollowingPostPreviewList?";
                break;
            case "created":
                apiUrl = "https://flowchatbackend.azurewebsites.net/api/Profile/getMyPostPreviewList?";
                break;
        }
        // Add query parameters
        switch(options.filter){
            case "created":
                apiUrl += `userIdFrom=${session.userId}`;
                if (options.authorUserId === "0") {
                    apiUrl += `&userIdTo=${session.userId}`;
                } else {
                    apiUrl += `&userIdTo=${options.authorUserId}`;
                }
                break;
            default:
                apiUrl += `userId=${session.userId}`; // Add userId to the URL
                break;
        }
        if (options.excludingPostIdList) {
            while(options.excludingPostIdList.length > 0){
                //add all excludingPostIds to the URL
                apiUrl += `&excludingPostIdList=${options.excludingPostIdList.shift()}`;
            }
        } else {
            //default value = 0
            apiUrl += `&excludingPostIdList=0`;
        }
        apiUrl += `&postNum=${options.count || 10}`;
        // Fetch data from the API
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        });
        const data = await response.json();
        // Map API response to frontend Post interface
        const posts = data.data.postPreviewList.map((post)=>({
                postId: post.postId,
                userId: post.userId,
                username: post.username,
                avatar: post.avatar,
                isUserBlocked: post.isUserBlocked,
                title: post.title,
                content: post.content,
                imageAPIList: post.imageAPIList,
                tagNameList: post.tagNameList,
                likeCount: post.likeCount,
                isLiked: post.isLiked,
                dislikeCount: post.dislikeCount,
                isDisliked: post.isDisliked,
                commentCount: post.commentCount,
                updatedAt: post.updatedAt,
                commentList: post.commentList
            }));
        return posts;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}
async function getSearchPosts(options = {}) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
        let apiUrl = `https://flowchatbackend.azurewebsites.net/api/Forum/searchPost?`;
        // Add query parameters
        apiUrl += `userId=${session.userId}`; // Add userId to the URL
        // Add keyword if provided
        if (options.keyword) {
            apiUrl += `&keyword=${options.keyword}`;
        }
        if (options.excludingPostIdList) {
            const idList = [
                ...options.excludingPostIdList
            ]; // Create a copy to prevent mutation
            idList.forEach((id)=>{
                apiUrl += `&excludingPostIdList=${id}`;
            });
        } else {
            //default value = 0
            apiUrl += `&excludingPostIdList=0`;
        }
        apiUrl += `&postNum=${options.count || 10}`;
        // Fetch data from the API
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        });
        if (!response.ok) {
            console.error(`Failed to fetch search posts with status ${response.status}`);
            return null;
        }
        const data = await response.json();
        // Map API response to frontend Post interface
        const posts = data.data.postPreviewList.map((post)=>({
                postId: post.postId,
                userId: post.userId,
                username: post.username,
                avatar: post.avatar,
                isUserBlocked: post.isUserBlocked,
                title: post.title,
                content: post.content,
                imageAPIList: post.imageAPIList,
                tagNameList: post.tagNameList,
                likeCount: post.likeCount,
                isLiked: post.isLiked,
                dislikeCount: post.dislikeCount,
                isDisliked: post.isDisliked,
                commentCount: post.commentCount,
                updatedAt: post.updatedAt,
                commentList: post.commentList
            }));
        return posts;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return null;
    }
}
async function getPostById(postId) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
        const apiUrl = `https://flowchatbackend.azurewebsites.net/api/Forum/getPostContent?userId=${session.userId}&postId=${postId}`;
        // Fetch data from the API
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        });
        try {
            const json = await response.json();
            const data = json;
            const post = data.data.post;
            return {
                postId: post.postId,
                userId: post.userId,
                username: post.username,
                avatar: post.avatar,
                isUserBlocked: post.isUserBlocked,
                title: post.title,
                content: post.content,
                imageAPIList: post.imageAPIList,
                tagNameList: post.tagNameList,
                likeCount: post.likeCount,
                isLiked: post.isLiked,
                dislikeCount: post.dislikeCount,
                isDisliked: post.isDisliked,
                commentCount: post.commentCount,
                updatedAt: post.updatedAt,
                commentList: post.commentList
            };
        } catch (error) {
            console.error("Error parsing JSON response:", error);
            return null;
        }
    } catch (error) {
        console.error("Error fetching post:", error);
        return null;
    }
}
async function createPost(title, content, tags, images) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
        // Validate session
        if (!session?.isLoggedIn || !session?.token) {
            throw new Error("User is not logged in or token is unavailable");
        }
        // Validate userId
        const userId = parseInt(session.userId?.toString() || "0", 10);
        if (isNaN(userId)) {
            throw new Error("Invalid userId");
        }
        // Construct request body for the backend
        const requestBody = {
            userId,
            title,
            content: content.replace(/<[^>]+>/g, ""),
            tag: tags.map((tag)=>tag.tagName),
            attachTo: 0
        };
        // Create FormData for multipart/form-data request
        const formData = new FormData();
        const requestBodyBlob = new Blob([
            JSON.stringify(requestBody)
        ], {
            type: "application/json"
        });
        formData.append("requestBody", requestBodyBlob);
        // Append images to imageList if any
        if (images.length > 0) {
            images.forEach((image)=>{
                formData.append("imageList", image);
            });
        }
        const apiUrl = "https://flowchatbackend.azurewebsites.net/api/Forum/createPostOrComment";
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.token}`
            },
            body: formData
        });
        // Check response status
        if (!response.ok) {
            if (response.status === 415) {
                throw new Error("Unsupported media type, please check request format");
            }
            if (response.status === 401) {
                throw new Error("Authentication failed, please log in again");
            }
            if (response.status === 500) {
                throw new Error("Server error, please contact the administrator");
            }
            throw new Error(`Failed to create post, status code: ${response.status}`);
        }
        // Parse response
        const data = await response.json();
        let postId = null;
        let isSuccess = false;
        // Handle different response formats
        if (typeof data.data === "string") {
            // Legacy format: data.data is a string like "48 success: true"
            const dataString = data.data;
            const [id, successPart] = dataString.split(" success: ");
            postId = id;
            isSuccess = successPart === "true";
        } else if (data.data && typeof data.data === "object" && "isSuccess" in data.data) {
            // New format: data.data is an object like { isSuccess: true }
            isSuccess = data.data.isSuccess;
            if (isSuccess) {
                // Backend did not return postId, fetch the latest post
                const latestPosts = await getPosts({
                    filter: "latest",
                    count: 1
                });
                if (!latestPosts || latestPosts.length === 0) {
                    throw new Error("Unable to fetch the latest post for navigation");
                }
                postId = latestPosts[0].postId;
            }
        } else {
            throw new Error("Unexpected response format from backend");
        }
        if (!isSuccess) {
            throw new Error(data.message || "Failed to create post");
        }
        if (!postId) {
            throw new Error("Unable to retrieve post ID for navigation");
        }
        return postId;
    } catch (error) {
        throw error;
    }
}
async function updatePost(postId, title, content, tags, images, existingImages) {
    try {
        // Retrieve the current session
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
        // Validate session
        if (!session?.isLoggedIn || !session?.token) {
            throw new Error("User is not logged in or token is unavailable");
        }
        // Validate userId
        const userId = parseInt(session.userId?.toString() || "0", 10);
        if (isNaN(userId)) {
            throw new Error("Invalid userId");
        }
        // Construct the request body, consistent with createPost
        const requestBody = {
            postId: parseInt(postId, 10),
            userId,
            title,
            content: content.replace(/<[^>]+>/g, ""),
            tag: tags.map((tag)=>tag.tagName),
            attachTo: 0,
            imageAPIList: existingImages
        };
        // Create FormData for multipart/form-data request
        const formData = new FormData();
        const requestBodyBlob = new Blob([
            JSON.stringify(requestBody)
        ], {
            type: "application/json"
        });
        formData.append("requestBody", requestBodyBlob);
        // If there are new images, append them to imageList
        if (images.length > 0) {
            images.forEach((image)=>{
                formData.append("imageList", image);
            });
        }
        // API endpoint for updating a post or comment
        const apiUrl = "https://flowchatbackend.azurewebsites.net/api/Forum/updatePostOrComment";
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${session.token}`
            },
            body: formData
        });
        // Check response status
        if (!response.ok) {
            if (response.status === 415) {
                throw new Error("Unsupported media type, please check request format");
            }
            if (response.status === 401) {
                throw new Error("Authentication failed, please log in again");
            }
            if (response.status === 500) {
                throw new Error("Server error, please contact the administrator");
            }
            throw new Error(`Failed to update post, status code: ${response.status}`);
        }
        // Parse the response
        const data = await response.json();
        let updatedPostId = null;
        let isSuccess = false;
        // Handle different response formats, consistent with createPost
        if (typeof data.data === "string") {
            // Legacy format: data.data is a string like "48 success: true"
            const dataString = data.data;
            const [id, successPart] = dataString.split(" success: ");
            updatedPostId = id;
            isSuccess = successPart === "true";
        } else if (data.data && typeof data.data === "object" && "isSuccess" in data.data) {
            // New format: data.data is an object like { isSuccess: true }
            isSuccess = data.data.isSuccess;
            if (isSuccess) {
                // Backend did not return postId, use the provided postId
                updatedPostId = postId;
            }
        } else {
            throw new Error("Unexpected response format from backend");
        }
        // Check if the update was successful
        if (!isSuccess) {
            throw new Error(data.message || "Failed to update post");
        }
        // Ensure a post ID is available for navigation
        if (!updatedPostId) {
            throw new Error("Unable to retrieve post ID for navigation");
        }
        return updatedPostId;
    } catch (error) {
        throw error;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getAllTags,
    getPosts,
    getSearchPosts,
    getPostById,
    createPost,
    updatePost
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAllTags, "00ea58ac1cac156effee2a42784344f8a6315042d2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPosts, "40dce588911040281a23d1a5c8c49e04ac16d57a05", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getSearchPosts, "400f4e9440d1f535054541e77b34a614f79fb16664", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPostById, "40f14b3bfd677ce91ef1e92df13e32d64b934adddd", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createPost, "78aea39e016b203b6a3d92e9ea7edbbc12594df80a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updatePost, "7ea5fe3613fb40e28ae354fcac269aa95cbb0f309e", null);
}}),
"[project]/.next-internal/server/app/forum/post/[postId]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/utils/authentication.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/utils/posts.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/authentication.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/posts.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
}}),
"[project]/.next-internal/server/app/forum/post/[postId]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/utils/authentication.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/utils/posts.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/authentication.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/posts.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$forum$2f$post$2f5b$postId$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/forum/post/[postId]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/utils/authentication.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/utils/posts.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/forum/post/[postId]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/utils/authentication.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/utils/posts.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00d347e48e6d2236e1f2b1fadcb1fb08f178d130b4": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logout"]),
    "00ea58ac1cac156effee2a42784344f8a6315042d2": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAllTags"]),
    "400f4e9440d1f535054541e77b34a614f79fb16664": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSearchPosts"]),
    "40dce588911040281a23d1a5c8c49e04ac16d57a05": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPosts"]),
    "40f14b3bfd677ce91ef1e92df13e32d64b934adddd": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPostById"]),
    "78aea39e016b203b6a3d92e9ea7edbbc12594df80a": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createPost"]),
    "7ea5fe3613fb40e28ae354fcac269aa95cbb0f309e": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updatePost"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/authentication.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/posts.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$forum$2f$post$2f5b$postId$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/forum/post/[postId]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/utils/authentication.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/utils/posts.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/forum/post/[postId]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/utils/authentication.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/utils/posts.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00d347e48e6d2236e1f2b1fadcb1fb08f178d130b4": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$forum$2f$post$2f5b$postId$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00d347e48e6d2236e1f2b1fadcb1fb08f178d130b4"]),
    "00ea58ac1cac156effee2a42784344f8a6315042d2": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$forum$2f$post$2f5b$postId$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00ea58ac1cac156effee2a42784344f8a6315042d2"]),
    "400f4e9440d1f535054541e77b34a614f79fb16664": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$forum$2f$post$2f5b$postId$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["400f4e9440d1f535054541e77b34a614f79fb16664"]),
    "40dce588911040281a23d1a5c8c49e04ac16d57a05": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$forum$2f$post$2f5b$postId$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40dce588911040281a23d1a5c8c49e04ac16d57a05"]),
    "40f14b3bfd677ce91ef1e92df13e32d64b934adddd": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$forum$2f$post$2f5b$postId$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40f14b3bfd677ce91ef1e92df13e32d64b934adddd"]),
    "78aea39e016b203b6a3d92e9ea7edbbc12594df80a": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$forum$2f$post$2f5b$postId$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["78aea39e016b203b6a3d92e9ea7edbbc12594df80a"]),
    "7ea5fe3613fb40e28ae354fcac269aa95cbb0f309e": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$forum$2f$post$2f5b$postId$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["7ea5fe3613fb40e28ae354fcac269aa95cbb0f309e"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$forum$2f$post$2f5b$postId$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/forum/post/[postId]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/utils/authentication.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/utils/posts.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$forum$2f$post$2f5b$postId$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$authentication$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/forum/post/[postId]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/utils/authentication.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/utils/posts.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
}}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/forum/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/forum/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/forum/post/[postId]/loading.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/forum/post/[postId]/loading.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/components/posts/PostHeader.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/posts/PostHeader.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/posts/PostHeader.tsx <module evaluation>", "default");
}}),
"[project]/src/components/posts/PostHeader.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/posts/PostHeader.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/posts/PostHeader.tsx", "default");
}}),
"[project]/src/components/posts/PostHeader.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$posts$2f$PostHeader$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/posts/PostHeader.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$posts$2f$PostHeader$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/components/posts/PostHeader.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$posts$2f$PostHeader$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/components/posts/PostFooter.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/posts/PostFooter.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/posts/PostFooter.tsx <module evaluation>", "default");
}}),
"[project]/src/components/posts/PostFooter.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/posts/PostFooter.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/posts/PostFooter.tsx", "default");
}}),
"[project]/src/components/posts/PostFooter.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$posts$2f$PostFooter$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/posts/PostFooter.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$posts$2f$PostFooter$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/components/posts/PostFooter.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$posts$2f$PostFooter$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/components/posts/LoadingImage.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/posts/LoadingImage.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/posts/LoadingImage.tsx <module evaluation>", "default");
}}),
"[project]/src/components/posts/LoadingImage.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/posts/LoadingImage.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/posts/LoadingImage.tsx", "default");
}}),
"[project]/src/components/posts/LoadingImage.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$posts$2f$LoadingImage$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/posts/LoadingImage.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$posts$2f$LoadingImage$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/components/posts/LoadingImage.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$posts$2f$LoadingImage$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/components/posts/PostDetail.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>PostDetail)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$posts$2f$PostHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/posts/PostHeader.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$posts$2f$PostFooter$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/posts/PostFooter.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$posts$2f$LoadingImage$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/posts/LoadingImage.tsx [app-rsc] (ecmascript)");
;
;
;
;
function PostDetail({ post }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            post.isUserBlocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                role: "alert",
                className: "alert alert-warning text-warning-content w-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
                children: "You have blocked this user"
            }, void 0, false, {
                fileName: "[project]/src/components/posts/PostDetail.tsx",
                lineNumber: 10,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: post.isUserBlocked ? "pointer-events-none blur-2xl" : "",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "card px-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card-body p-0 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$posts$2f$PostHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                postId: post.postId,
                                postUserId: post.userId,
                                postUsername: post.username,
                                postUpdatedAt: post.updatedAt,
                                size: "md",
                                postUserAvatar: post.avatar
                            }, void 0, false, {
                                fileName: "[project]/src/components/posts/PostDetail.tsx",
                                lineNumber: 21,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 overflow-hidden",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "card-title text-2xl font-bold break-words",
                                            children: post.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/posts/PostDetail.tsx",
                                            lineNumber: 33,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-base-content text-md my-2 whitespace-pre-wrap break-words",
                                            children: post.content
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/posts/PostDetail.tsx",
                                            lineNumber: 34,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/posts/PostDetail.tsx",
                                    lineNumber: 32,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/posts/PostDetail.tsx",
                                lineNumber: 31,
                                columnNumber: 13
                            }, this),
                            post.imageAPIList && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$posts$2f$LoadingImage$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                src: post.imageAPIList[0],
                                alt: post.title,
                                className: "object-contain rounded-md max-h-96 mx-auto"
                            }, void 0, false, {
                                fileName: "[project]/src/components/posts/PostDetail.tsx",
                                lineNumber: 40,
                                columnNumber: 15
                            }, this),
                            post.tagNameList && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-1",
                                children: post.tagNameList.map((tag, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "badge badge-md badge-accent",
                                        children: tag.trim()
                                    }, index, false, {
                                        fileName: "[project]/src/components/posts/PostDetail.tsx",
                                        lineNumber: 51,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/posts/PostDetail.tsx",
                                lineNumber: 49,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$posts$2f$PostFooter$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                postId: post.postId,
                                postLikeCount: post.likeCount,
                                postIsLiked: post.isLiked,
                                postDislikeCount: post.dislikeCount,
                                postIsDisliked: post.isDisliked,
                                postCommentCount: post.commentCount
                            }, void 0, false, {
                                fileName: "[project]/src/components/posts/PostDetail.tsx",
                                lineNumber: 59,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/posts/PostDetail.tsx",
                        lineNumber: 19,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/posts/PostDetail.tsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/posts/PostDetail.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/posts/PostDetail.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/app/forum/post/[postId]/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>PostDetailPage),
    "generateMetadata": (()=>generateMetadata)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/posts.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$posts$2f$PostDetail$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/posts/PostDetail.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
;
;
;
;
;
const getPost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])((postId)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPostById"])(postId);
});
async function generateMetadata(props) {
    const params = await props.params;
    const post = await getPost(params.postId);
    if (!post) {
        return {
            title: "Post Not Found | FlowChat"
        };
    }
    return {
        title: `${post.title} | FlowChat`,
        description: post.content.substring(0, 160)
    };
}
async function PostDetailPage(props) {
    const params = await props.params;
    const post = await getPost(params.postId);
    if (!post) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col px-4 py-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$posts$2f$PostDetail$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                post: post
            }, void 0, false, {
                fileName: "[project]/src/app/forum/post/[postId]/page.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: "comments",
                className: "card bg-base-100 p-4 min-h-screen",
                children: '@Boscode31415 Please create a comment section here, label the component id="comments" so my comment button can navigate to the comment section without navbar blocking'
            }, void 0, false, {
                fileName: "[project]/src/app/forum/post/[postId]/page.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/forum/post/[postId]/page.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/app/forum/post/[postId]/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/forum/post/[postId]/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__486d44ad._.js.map