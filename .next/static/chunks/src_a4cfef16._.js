(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/components/navigation/BackButton.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>BackButton)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@fortawesome/free-solid-svg-icons/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@fortawesome/react-fontawesome/index.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function BackButton() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const shouldHide = pathname?.includes("/forum/latest") || pathname?.includes("/forum/recommended") || pathname?.includes("/forum/search-results") || pathname?.includes("/forum/following");
    if (shouldHide) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: ()=>router.back(),
        className: "btn btn-circle btn-lg bg-base-100",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["faChevronLeft"],
            className: "w-4 h-4"
        }, void 0, false, {
            fileName: "[project]/src/components/navigation/BackButton.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/navigation/BackButton.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_s(BackButton, "gA9e4WsoP6a20xDgQgrFkfMP8lc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = BackButton;
var _c;
__turbopack_context__.k.register(_c, "BackButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/utils/data:4236a1 [app-client] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"00ea58ac1cac156effee2a42784344f8a6315042d2":"getAllTags"},"src/utils/posts.ts",""] */ __turbopack_context__.s({
    "getAllTags": (()=>getAllTags)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var getAllTags = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("00ea58ac1cac156effee2a42784344f8a6315042d2", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getAllTags"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vcG9zdHMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc2VydmVyXCI7XG5cbmltcG9ydCB7IGdldFNlc3Npb24gfSBmcm9tIFwiQC91dGlscy9zZXNzaW9uc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBvc3Qge1xuICBwb3N0SWQ6IHN0cmluZztcbiAgdXNlcklkOiBzdHJpbmc7XG4gIHVzZXJuYW1lOiBzdHJpbmc7XG4gIGF2YXRhcjogc3RyaW5nIHwgbnVsbDtcbiAgaXNVc2VyQmxvY2tlZDogYm9vbGVhbjtcbiAgdGl0bGU6IHN0cmluZztcbiAgY29udGVudDogc3RyaW5nO1xuICBpbWFnZUFQSUxpc3Q6IHN0cmluZ1tdIHwgbnVsbDtcbiAgdGFnTmFtZUxpc3Q6IHN0cmluZ1tdIHwgbnVsbDtcbiAgbGlrZUNvdW50OiBudW1iZXI7XG4gIGlzTGlrZWQ6IGJvb2xlYW47XG4gIGRpc2xpa2VDb3VudDogbnVtYmVyO1xuICBpc0Rpc2xpa2VkOiBib29sZWFuO1xuICBjb21tZW50Q291bnQ6IG51bWJlcjtcbiAgdXBkYXRlZEF0OiBzdHJpbmc7XG4gIGNvbW1lbnRMaXN0OiBQb3N0W10gfCBudWxsO1xufVxuXG4vLyBBUEkgcmVzcG9uc2UgdHlwZSBmb3IgZ2V0UG9zdFxuaW50ZXJmYWNlIFBvc3RQcmV2aWV3UmVzcG9uc2Uge1xuICBtZXNzYWdlOiBzdHJpbmc7XG4gIGRhdGE6IHtcbiAgICBpc1N1Y2Nlc3M6IGJvb2xlYW47XG4gICAgcG9zdFByZXZpZXdMaXN0OiBQb3N0W107XG4gIH07XG59XG5cbmludGVyZmFjZSBQb3N0Q29udGVudFJlc3BvbnNlIHtcbiAgbWVzc2FnZTogc3RyaW5nO1xuICBkYXRhOiB7XG4gICAgaXNTdWNjZXNzOiBib29sZWFuO1xuICAgIHBvc3Q6IFBvc3Q7XG4gIH07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGFnIHtcbiAgdGFnSWQ6IHN0cmluZztcbiAgdGFnTmFtZTogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgVGFnUmVzcG9uc2Uge1xuICBtZXNzYWdlOiBzdHJpbmc7XG4gIGRhdGE6IHtcbiAgICBpc1N1Y2Nlc3M6IGJvb2xlYW47XG4gICAgdGFnTGlzdDogVGFnW107XG4gIH07XG59XG5cbmludGVyZmFjZSBDcmVhdGVQb3N0UmVzcG9uc2Uge1xuICBtZXNzYWdlOiBzdHJpbmc7XG4gIGRhdGE6IHtcbiAgICBpc1N1Y2Nlc3M6IGJvb2xlYW47XG4gIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBbGxUYWdzKCk6IFByb21pc2U8VGFnW10+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2Vzc2lvbigpO1xuICAgIGNvbnN0IGFwaVVybCA9IGBodHRwczovL2Zsb3djaGF0YmFja2VuZC5henVyZXdlYnNpdGVzLm5ldC9hcGkvRm9ydW0vZ2V0QWxsVGFnYDtcblxuICAgIC8vIEZldGNoIGRhdGEgZnJvbSB0aGUgQVBJXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChhcGlVcmwsIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Nlc3Npb24udG9rZW59YCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBJZiBBUEkgY2FsbCBmYWlscywgdXNlIG1vY2sgZGF0YVxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIGNvbnNvbGUubG9nKGBNb2NrIHRhZ3MgYXJlIHJldHVybmVkIGR1ZSB0byBBUEkgcmVxdWVzdCBmYWlsZWQgd2l0aCBzdGF0dXMgJHtyZXNwb25zZS5zdGF0dXN9YCk7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YTogVGFnUmVzcG9uc2UgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgICByZXR1cm4gZGF0YS5kYXRhLnRhZ0xpc3Q7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIHRhZ3M6XCIsIGVycm9yKTtcbiAgICByZXR1cm4gW107XG4gIH1cbn1cblxuLy8gc2FtcGxlIEFQSSBjYWxsXG4vLyBodHRwczovL2Zsb3djaGF0YmFja2VuZC5henVyZXdlYnNpdGVzLm5ldC9hcGkvRm9ydW0vXG4vLyBnZXRMYXRlc3RQb3N0UHJldmlld0xpc3Q/XG4vLyB1c2VySWQ9MVxuLy8gJmV4Y2x1ZGluZ1Bvc3RJZExpc3Q9MVxuLy8gJmV4Y2x1ZGluZ1Bvc3RJZExpc3Q9MzRcbi8vICZwb3N0TnVtPTVcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRQb3N0cyhcbiAgb3B0aW9uczoge1xuICAgIGZpbHRlcj86IFwibGF0ZXN0XCIgfCBcInJlY29tbWVuZGVkXCIgfCBcImZvbGxvd2luZ1wiIHwgXCJjcmVhdGVkXCI7XG4gICAgZXhjbHVkaW5nUG9zdElkTGlzdD86IG51bWJlcltdO1xuICAgIGNvdW50PzogbnVtYmVyO1xuICAgIGF1dGhvclVzZXJJZD86IHN0cmluZztcbiAgfSA9IHt9XG4pOiBQcm9taXNlPFBvc3RbXSB8IG51bGw+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2Vzc2lvbigpO1xuICAgIC8vIEJ1aWxkIHRoZSBBUEkgVVJMIGJhc2VkIG9uIHRoZSBmaWx0ZXJcbiAgICBsZXQgYXBpVXJsID0gXCJodHRwczovL2Zsb3djaGF0YmFja2VuZC5henVyZXdlYnNpdGVzLm5ldC9hcGkvRm9ydW0vXCI7XG4gICAgc3dpdGNoIChvcHRpb25zLmZpbHRlcikge1xuICAgICAgY2FzZSBcImxhdGVzdFwiOlxuICAgICAgICBhcGlVcmwgKz0gYGdldExhdGVzdFBvc3RQcmV2aWV3TGlzdD9gO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJyZWNvbW1lbmRlZFwiOlxuICAgICAgICBhcGlVcmwgKz0gXCJnZXRSZWNvbW1lbmRlZFBvc3RQcmV2aWV3TGlzdD9cIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZm9sbG93aW5nXCI6XG4gICAgICAgIGFwaVVybCArPSBcImdldEZvbGxvd2luZ1Bvc3RQcmV2aWV3TGlzdD9cIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY3JlYXRlZFwiOlxuICAgICAgICBhcGlVcmwgPSBcImh0dHBzOi8vZmxvd2NoYXRiYWNrZW5kLmF6dXJld2Vic2l0ZXMubmV0L2FwaS9Qcm9maWxlL2dldE15UG9zdFByZXZpZXdMaXN0P1wiO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBBZGQgcXVlcnkgcGFyYW1ldGVyc1xuICAgIHN3aXRjaCAob3B0aW9ucy5maWx0ZXIpIHtcbiAgICAgIGNhc2UgXCJjcmVhdGVkXCI6XG4gICAgICAgIGFwaVVybCArPSBgdXNlcklkRnJvbT0ke3Nlc3Npb24udXNlcklkfWA7XG4gICAgICAgIGlmIChvcHRpb25zLmF1dGhvclVzZXJJZCA9PT0gXCIwXCIpIHtcbiAgICAgICAgICBhcGlVcmwgKz0gYCZ1c2VySWRUbz0ke3Nlc3Npb24udXNlcklkfWBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcGlVcmwgKz0gYCZ1c2VySWRUbz0ke29wdGlvbnMuYXV0aG9yVXNlcklkfWBcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFwaVVybCArPSBgdXNlcklkPSR7c2Vzc2lvbi51c2VySWR9YDsgLy8gQWRkIHVzZXJJZCB0byB0aGUgVVJMXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBcblxuICAgIGlmIChvcHRpb25zLmV4Y2x1ZGluZ1Bvc3RJZExpc3QpIHtcbiAgICAgIHdoaWxlIChvcHRpb25zLmV4Y2x1ZGluZ1Bvc3RJZExpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAvL2FkZCBhbGwgZXhjbHVkaW5nUG9zdElkcyB0byB0aGUgVVJMXG4gICAgICAgIGFwaVVybCArPSBgJmV4Y2x1ZGluZ1Bvc3RJZExpc3Q9JHtvcHRpb25zLmV4Y2x1ZGluZ1Bvc3RJZExpc3Quc2hpZnQoKX1gO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvL2RlZmF1bHQgdmFsdWUgPSAwXG4gICAgICBhcGlVcmwgKz0gYCZleGNsdWRpbmdQb3N0SWRMaXN0PTBgO1xuICAgIH1cblxuICAgIGFwaVVybCArPSBgJnBvc3ROdW09JHtvcHRpb25zLmNvdW50IHx8IDEwfWA7XG5cbiAgICAvLyBGZXRjaCBkYXRhIGZyb20gdGhlIEFQSVxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYXBpVXJsLCB7XG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnRva2VufWAsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgZGF0YTogUG9zdFByZXZpZXdSZXNwb25zZSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAvLyBNYXAgQVBJIHJlc3BvbnNlIHRvIGZyb250ZW5kIFBvc3QgaW50ZXJmYWNlXG4gICAgY29uc3QgcG9zdHM6IFBvc3RbXSA9IGRhdGEuZGF0YS5wb3N0UHJldmlld0xpc3QubWFwKChwb3N0KSA9PiAoe1xuICAgICAgcG9zdElkOiBwb3N0LnBvc3RJZCxcbiAgICAgIHVzZXJJZDogcG9zdC51c2VySWQsXG4gICAgICB1c2VybmFtZTogcG9zdC51c2VybmFtZSxcbiAgICAgIGF2YXRhcjogcG9zdC5hdmF0YXIsXG4gICAgICBpc1VzZXJCbG9ja2VkOiBwb3N0LmlzVXNlckJsb2NrZWQsXG4gICAgICB0aXRsZTogcG9zdC50aXRsZSxcbiAgICAgIGNvbnRlbnQ6IHBvc3QuY29udGVudCxcbiAgICAgIGltYWdlQVBJTGlzdDogcG9zdC5pbWFnZUFQSUxpc3QsXG4gICAgICB0YWdOYW1lTGlzdDogcG9zdC50YWdOYW1lTGlzdCxcbiAgICAgIGxpa2VDb3VudDogcG9zdC5saWtlQ291bnQsXG4gICAgICBpc0xpa2VkOiBwb3N0LmlzTGlrZWQsXG4gICAgICBkaXNsaWtlQ291bnQ6IHBvc3QuZGlzbGlrZUNvdW50LFxuICAgICAgaXNEaXNsaWtlZDogcG9zdC5pc0Rpc2xpa2VkLFxuICAgICAgY29tbWVudENvdW50OiBwb3N0LmNvbW1lbnRDb3VudCxcbiAgICAgIHVwZGF0ZWRBdDogcG9zdC51cGRhdGVkQXQsXG4gICAgICBjb21tZW50TGlzdDogcG9zdC5jb21tZW50TGlzdCxcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gcG9zdHM7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIHBvc3RzOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG5cbi8vIFNhbXBsZSBBUEkgY2FsbDpcbi8vIGh0dHBzOi8vZmxvd2NoYXRiYWNrZW5kLmF6dXJld2Vic2l0ZXMubmV0L2FwaS9Gb3J1bS9cbi8vIHNlYXJjaFBvc3Q/XG4vLyB1c2VySWQ9MSZcbi8vIGtleXdvcmQ9cHJvZyZcbi8vIGV4Y2x1ZGluZ1Bvc3RJZExpc3Q9MjMmXG4vLyBleGNsdWRpbmdQb3N0SWRMaXN0PTI0JlxuLy8gc2VhcmNoTnVtPTEwXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U2VhcmNoUG9zdHMoXG4gIG9wdGlvbnM6IHtcbiAgICBrZXl3b3JkPzogc3RyaW5nO1xuICAgIHRhZ0lkTGlzdD86IG51bWJlcltdO1xuICAgIGV4Y2x1ZGluZ1Bvc3RJZExpc3Q/OiBudW1iZXJbXTtcbiAgICBjb3VudD86IG51bWJlcjtcbiAgfSA9IHt9XG4pOiBQcm9taXNlPFBvc3RbXSB8IG51bGw+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2Vzc2lvbigpO1xuXG4gICAgbGV0IGFwaVVybCA9IGBodHRwczovL2Zsb3djaGF0YmFja2VuZC5henVyZXdlYnNpdGVzLm5ldC9hcGkvRm9ydW0vc2VhcmNoUG9zdD9gO1xuXG4gICAgLy8gQWRkIHF1ZXJ5IHBhcmFtZXRlcnNcbiAgICBhcGlVcmwgKz0gYHVzZXJJZD0ke3Nlc3Npb24udXNlcklkfWA7IC8vIEFkZCB1c2VySWQgdG8gdGhlIFVSTFxuXG4gICAgLy8gQWRkIGtleXdvcmQgaWYgcHJvdmlkZWRcbiAgICBpZiAob3B0aW9ucy5rZXl3b3JkKSB7XG4gICAgICBhcGlVcmwgKz0gYCZrZXl3b3JkPSR7b3B0aW9ucy5rZXl3b3JkfWA7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuZXhjbHVkaW5nUG9zdElkTGlzdCkge1xuICAgICAgY29uc3QgaWRMaXN0ID0gWy4uLm9wdGlvbnMuZXhjbHVkaW5nUG9zdElkTGlzdF07IC8vIENyZWF0ZSBhIGNvcHkgdG8gcHJldmVudCBtdXRhdGlvblxuICAgICAgaWRMaXN0LmZvckVhY2goKGlkKSA9PiB7XG4gICAgICAgIGFwaVVybCArPSBgJmV4Y2x1ZGluZ1Bvc3RJZExpc3Q9JHtpZH1gO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vZGVmYXVsdCB2YWx1ZSA9IDBcbiAgICAgIGFwaVVybCArPSBgJmV4Y2x1ZGluZ1Bvc3RJZExpc3Q9MGA7XG4gICAgfVxuXG4gICAgYXBpVXJsICs9IGAmcG9zdE51bT0ke29wdGlvbnMuY291bnQgfHwgMTB9YDtcblxuICAgIC8vIEZldGNoIGRhdGEgZnJvbSB0aGUgQVBJXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChhcGlVcmwsIHtcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Nlc3Npb24udG9rZW59YCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gZmV0Y2ggc2VhcmNoIHBvc3RzIHdpdGggc3RhdHVzICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YTogUG9zdFByZXZpZXdSZXNwb25zZSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgIC8vIE1hcCBBUEkgcmVzcG9uc2UgdG8gZnJvbnRlbmQgUG9zdCBpbnRlcmZhY2VcbiAgICBjb25zdCBwb3N0czogUG9zdFtdID0gZGF0YS5kYXRhLnBvc3RQcmV2aWV3TGlzdC5tYXAoKHBvc3QpID0+ICh7XG4gICAgICBwb3N0SWQ6IHBvc3QucG9zdElkLFxuICAgICAgdXNlcklkOiBwb3N0LnVzZXJJZCxcbiAgICAgIHVzZXJuYW1lOiBwb3N0LnVzZXJuYW1lLFxuICAgICAgYXZhdGFyOiBwb3N0LmF2YXRhcixcbiAgICAgIGlzVXNlckJsb2NrZWQ6IHBvc3QuaXNVc2VyQmxvY2tlZCxcbiAgICAgIHRpdGxlOiBwb3N0LnRpdGxlLFxuICAgICAgY29udGVudDogcG9zdC5jb250ZW50LFxuICAgICAgaW1hZ2VBUElMaXN0OiBwb3N0LmltYWdlQVBJTGlzdCxcbiAgICAgIHRhZ05hbWVMaXN0OiBwb3N0LnRhZ05hbWVMaXN0LFxuICAgICAgbGlrZUNvdW50OiBwb3N0Lmxpa2VDb3VudCxcbiAgICAgIGlzTGlrZWQ6IHBvc3QuaXNMaWtlZCxcbiAgICAgIGRpc2xpa2VDb3VudDogcG9zdC5kaXNsaWtlQ291bnQsXG4gICAgICBpc0Rpc2xpa2VkOiBwb3N0LmlzRGlzbGlrZWQsXG4gICAgICBjb21tZW50Q291bnQ6IHBvc3QuY29tbWVudENvdW50LFxuICAgICAgdXBkYXRlZEF0OiBwb3N0LnVwZGF0ZWRBdCxcbiAgICAgIGNvbW1lbnRMaXN0OiBwb3N0LmNvbW1lbnRMaXN0LFxuICAgIH0pKTtcblxuICAgIHJldHVybiBwb3N0cztcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgcG9zdHM6XCIsIGVycm9yKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UG9zdEJ5SWQocG9zdElkOiBzdHJpbmcpOiBQcm9taXNlPFBvc3QgfCBudWxsPiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlc3Npb24oKTtcblxuICAgIGNvbnN0IGFwaVVybCA9IGBodHRwczovL2Zsb3djaGF0YmFja2VuZC5henVyZXdlYnNpdGVzLm5ldC9hcGkvRm9ydW0vZ2V0UG9zdENvbnRlbnQ/dXNlcklkPSR7c2Vzc2lvbi51c2VySWR9JnBvc3RJZD0ke3Bvc3RJZH1gO1xuXG4gICAgLy8gRmV0Y2ggZGF0YSBmcm9tIHRoZSBBUElcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGFwaVVybCwge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi50b2tlbn1gLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBqc29uID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgY29uc3QgZGF0YTogUG9zdENvbnRlbnRSZXNwb25zZSA9IGpzb247XG4gICAgICBjb25zdCBwb3N0ID0gZGF0YS5kYXRhLnBvc3Q7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3N0SWQ6IHBvc3QucG9zdElkLFxuICAgICAgICB1c2VySWQ6IHBvc3QudXNlcklkLFxuICAgICAgICB1c2VybmFtZTogcG9zdC51c2VybmFtZSxcbiAgICAgICAgYXZhdGFyOiBwb3N0LmF2YXRhcixcbiAgICAgICAgaXNVc2VyQmxvY2tlZDogcG9zdC5pc1VzZXJCbG9ja2VkLFxuICAgICAgICB0aXRsZTogcG9zdC50aXRsZSxcbiAgICAgICAgY29udGVudDogcG9zdC5jb250ZW50LFxuICAgICAgICBpbWFnZUFQSUxpc3Q6IHBvc3QuaW1hZ2VBUElMaXN0LFxuICAgICAgICB0YWdOYW1lTGlzdDogcG9zdC50YWdOYW1lTGlzdCxcbiAgICAgICAgbGlrZUNvdW50OiBwb3N0Lmxpa2VDb3VudCxcbiAgICAgICAgaXNMaWtlZDogcG9zdC5pc0xpa2VkLFxuICAgICAgICBkaXNsaWtlQ291bnQ6IHBvc3QuZGlzbGlrZUNvdW50LFxuICAgICAgICBpc0Rpc2xpa2VkOiBwb3N0LmlzRGlzbGlrZWQsXG4gICAgICAgIGNvbW1lbnRDb3VudDogcG9zdC5jb21tZW50Q291bnQsXG4gICAgICAgIHVwZGF0ZWRBdDogcG9zdC51cGRhdGVkQXQsXG4gICAgICAgIGNvbW1lbnRMaXN0OiBwb3N0LmNvbW1lbnRMaXN0LFxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHBhcnNpbmcgSlNPTiByZXNwb25zZTpcIiwgZXJyb3IpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBmZXRjaGluZyBwb3N0OlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLy8gQ3JlYXRlIGEgbmV3IHBvc3Qgd2l0aCB0aGUgZ2l2ZW4gdGl0bGUsIGNvbnRlbnQsIHRhZ3MsIGFuZCBpbWFnZXNcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVQb3N0KHRpdGxlOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgdGFnczogVGFnW10sIGltYWdlczogRmlsZVtdKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlc3Npb24oKTtcblxuICAgIC8vIFZhbGlkYXRlIHNlc3Npb25cbiAgICBpZiAoIXNlc3Npb24/LmlzTG9nZ2VkSW4gfHwgIXNlc3Npb24/LnRva2VuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVc2VyIGlzIG5vdCBsb2dnZWQgaW4gb3IgdG9rZW4gaXMgdW5hdmFpbGFibGVcIik7XG4gICAgfVxuXG4gICAgLy8gVmFsaWRhdGUgdXNlcklkXG4gICAgY29uc3QgdXNlcklkID0gcGFyc2VJbnQoc2Vzc2lvbi51c2VySWQ/LnRvU3RyaW5nKCkgfHwgXCIwXCIsIDEwKTtcbiAgICBpZiAoaXNOYU4odXNlcklkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB1c2VySWRcIik7XG4gICAgfVxuXG4gICAgLy8gQ29uc3RydWN0IHJlcXVlc3QgYm9keSBmb3IgdGhlIGJhY2tlbmRcbiAgICBjb25zdCByZXF1ZXN0Qm9keSA9IHtcbiAgICAgIHVzZXJJZCxcbiAgICAgIHRpdGxlLFxuICAgICAgY29udGVudDogY29udGVudC5yZXBsYWNlKC88W14+XSs+L2csIFwiXCIpLCAvLyBSZW1vdmUgSFRNTCB0YWdzIGZyb20gY29udGVudFxuICAgICAgdGFnOiB0YWdzLm1hcCgodGFnKSA9PiB0YWcudGFnTmFtZSksXG4gICAgICBhdHRhY2hUbzogMCxcbiAgICB9O1xuXG4gICAgLy8gQ3JlYXRlIEZvcm1EYXRhIGZvciBtdWx0aXBhcnQvZm9ybS1kYXRhIHJlcXVlc3RcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgIGNvbnN0IHJlcXVlc3RCb2R5QmxvYiA9IG5ldyBCbG9iKFtKU09OLnN0cmluZ2lmeShyZXF1ZXN0Qm9keSldLCB7IHR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiIH0pO1xuICAgIGZvcm1EYXRhLmFwcGVuZChcInJlcXVlc3RCb2R5XCIsIHJlcXVlc3RCb2R5QmxvYik7XG5cbiAgICAvLyBBcHBlbmQgaW1hZ2VzIHRvIGltYWdlTGlzdCBpZiBhbnlcbiAgICBpZiAoaW1hZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIGltYWdlcy5mb3JFYWNoKChpbWFnZSkgPT4ge1xuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJpbWFnZUxpc3RcIiwgaW1hZ2UpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgYXBpVXJsID0gXCJodHRwczovL2Zsb3djaGF0YmFja2VuZC5henVyZXdlYnNpdGVzLm5ldC9hcGkvRm9ydW0vY3JlYXRlUG9zdE9yQ29tbWVudFwiO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYXBpVXJsLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi50b2tlbn1gLFxuICAgICAgfSxcbiAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgIH0pO1xuXG4gICAgLy8gQ2hlY2sgcmVzcG9uc2Ugc3RhdHVzXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDE1KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIG1lZGlhIHR5cGUsIHBsZWFzZSBjaGVjayByZXF1ZXN0IGZvcm1hdFwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBdXRoZW50aWNhdGlvbiBmYWlsZWQsIHBsZWFzZSBsb2cgaW4gYWdhaW5cIik7XG4gICAgICB9XG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA1MDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2VydmVyIGVycm9yLCBwbGVhc2UgY29udGFjdCB0aGUgYWRtaW5pc3RyYXRvclwiKTtcbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGNyZWF0ZSBwb3N0LCBzdGF0dXMgY29kZTogJHtyZXNwb25zZS5zdGF0dXN9YCk7XG4gICAgfVxuXG4gICAgLy8gUGFyc2UgcmVzcG9uc2VcbiAgICBjb25zdCBkYXRhOiBDcmVhdGVQb3N0UmVzcG9uc2UgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgbGV0IHBvc3RJZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IGlzU3VjY2VzczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgLy8gSGFuZGxlIGRpZmZlcmVudCByZXNwb25zZSBmb3JtYXRzXG4gICAgaWYgKHR5cGVvZiBkYXRhLmRhdGEgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIC8vIExlZ2FjeSBmb3JtYXQ6IGRhdGEuZGF0YSBpcyBhIHN0cmluZyBsaWtlIFwiNDggc3VjY2VzczogdHJ1ZVwiXG4gICAgICBjb25zdCBkYXRhU3RyaW5nID0gZGF0YS5kYXRhIGFzIHN0cmluZztcbiAgICAgIGNvbnN0IFtpZCwgc3VjY2Vzc1BhcnRdID0gZGF0YVN0cmluZy5zcGxpdChcIiBzdWNjZXNzOiBcIik7XG4gICAgICBwb3N0SWQgPSBpZDtcbiAgICAgIGlzU3VjY2VzcyA9IHN1Y2Nlc3NQYXJ0ID09PSBcInRydWVcIjtcbiAgICB9IGVsc2UgaWYgKGRhdGEuZGF0YSAmJiB0eXBlb2YgZGF0YS5kYXRhID09PSBcIm9iamVjdFwiICYmIFwiaXNTdWNjZXNzXCIgaW4gZGF0YS5kYXRhKSB7XG4gICAgICAvLyBOZXcgZm9ybWF0OiBkYXRhLmRhdGEgaXMgYW4gb2JqZWN0IGxpa2UgeyBpc1N1Y2Nlc3M6IHRydWUgfVxuICAgICAgaXNTdWNjZXNzID0gKGRhdGEuZGF0YSBhcyB7IGlzU3VjY2VzczogYm9vbGVhbiB9KS5pc1N1Y2Nlc3M7XG4gICAgICBpZiAoaXNTdWNjZXNzKSB7XG4gICAgICAgIC8vIEJhY2tlbmQgZGlkIG5vdCByZXR1cm4gcG9zdElkLCBmZXRjaCB0aGUgbGF0ZXN0IHBvc3RcbiAgICAgICAgY29uc3QgbGF0ZXN0UG9zdHMgPSBhd2FpdCBnZXRQb3N0cyh7IGZpbHRlcjogXCJsYXRlc3RcIiwgY291bnQ6IDEgfSk7XG4gICAgICAgIGlmICghbGF0ZXN0UG9zdHMgfHwgbGF0ZXN0UG9zdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIGZldGNoIHRoZSBsYXRlc3QgcG9zdCBmb3IgbmF2aWdhdGlvblwiKTtcbiAgICAgICAgfVxuICAgICAgICBwb3N0SWQgPSBsYXRlc3RQb3N0c1swXS5wb3N0SWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuZXhwZWN0ZWQgcmVzcG9uc2UgZm9ybWF0IGZyb20gYmFja2VuZFwiKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzU3VjY2Vzcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGRhdGEubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBjcmVhdGUgcG9zdFwiKTtcbiAgICB9XG5cbiAgICBpZiAoIXBvc3RJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIHJldHJpZXZlIHBvc3QgSUQgZm9yIG5hdmlnYXRpb25cIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBvc3RJZDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG4vLyBVcGRhdGUgYW4gZXhpc3RpbmcgcG9zdCB3aXRoIHRoZSBnaXZlbiBkYXRhXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlUG9zdChcbiAgcG9zdElkOiBzdHJpbmcsXG4gIHRpdGxlOiBzdHJpbmcsXG4gIGNvbnRlbnQ6IHN0cmluZyxcbiAgdGFnczogVGFnW10sXG4gIGltYWdlczogRmlsZVtdLFxuICBleGlzdGluZ0ltYWdlczogc3RyaW5nW11cbik6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICB0cnkge1xuICAgIC8vIFJldHJpZXZlIHRoZSBjdXJyZW50IHNlc3Npb25cbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2Vzc2lvbigpO1xuXG4gICAgLy8gVmFsaWRhdGUgc2Vzc2lvblxuICAgIGlmICghc2Vzc2lvbj8uaXNMb2dnZWRJbiB8fCAhc2Vzc2lvbj8udG9rZW4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlVzZXIgaXMgbm90IGxvZ2dlZCBpbiBvciB0b2tlbiBpcyB1bmF2YWlsYWJsZVwiKTtcbiAgICB9XG5cbiAgICAvLyBWYWxpZGF0ZSB1c2VySWRcbiAgICBjb25zdCB1c2VySWQgPSBwYXJzZUludChzZXNzaW9uLnVzZXJJZD8udG9TdHJpbmcoKSB8fCBcIjBcIiwgMTApO1xuICAgIGlmIChpc05hTih1c2VySWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHVzZXJJZFwiKTtcbiAgICB9XG5cbiAgICAvLyBDb25zdHJ1Y3QgdGhlIHJlcXVlc3QgYm9keSwgY29uc2lzdGVudCB3aXRoIGNyZWF0ZVBvc3RcbiAgICBjb25zdCByZXF1ZXN0Qm9keSA9IHtcbiAgICAgIHBvc3RJZDogcGFyc2VJbnQocG9zdElkLCAxMCksIC8vIFBvc3QgSUQgdG8gdXBkYXRlXG4gICAgICB1c2VySWQsIC8vIFVzZXIgSUQgb2YgdGhlIHBvc3RlclxuICAgICAgdGl0bGUsIC8vIFVwZGF0ZWQgcG9zdCB0aXRsZVxuICAgICAgY29udGVudDogY29udGVudC5yZXBsYWNlKC88W14+XSs+L2csIFwiXCIpLCAvLyBSZW1vdmUgSFRNTCB0YWdzIGZyb20gY29udGVudFxuICAgICAgdGFnOiB0YWdzLm1hcCgodGFnKSA9PiB0YWcudGFnTmFtZSksIC8vIExpc3Qgb2YgdGFnIG5hbWVzXG4gICAgICBhdHRhY2hUbzogMCwgLy8gUGFyZW50IHBvc3QgSUQgKGlmIGFwcGxpY2FibGUsIHNldCB0byAwIGlmIG5vdCBhIGNvbW1lbnQpXG4gICAgICBpbWFnZUFQSUxpc3Q6IGV4aXN0aW5nSW1hZ2VzLCAvLyBMaXN0IG9mIGV4aXN0aW5nIGltYWdlIFVSTHMgdG8gcmV0YWluXG4gICAgfTtcblxuICAgIC8vIENyZWF0ZSBGb3JtRGF0YSBmb3IgbXVsdGlwYXJ0L2Zvcm0tZGF0YSByZXF1ZXN0XG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICBjb25zdCByZXF1ZXN0Qm9keUJsb2IgPSBuZXcgQmxvYihbSlNPTi5zdHJpbmdpZnkocmVxdWVzdEJvZHkpXSwgeyB0eXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9KTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoXCJyZXF1ZXN0Qm9keVwiLCByZXF1ZXN0Qm9keUJsb2IpO1xuXG4gICAgLy8gSWYgdGhlcmUgYXJlIG5ldyBpbWFnZXMsIGFwcGVuZCB0aGVtIHRvIGltYWdlTGlzdFxuICAgIGlmIChpbWFnZXMubGVuZ3RoID4gMCkge1xuICAgICAgaW1hZ2VzLmZvckVhY2goKGltYWdlKSA9PiB7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImltYWdlTGlzdFwiLCBpbWFnZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBUEkgZW5kcG9pbnQgZm9yIHVwZGF0aW5nIGEgcG9zdCBvciBjb21tZW50XG4gICAgY29uc3QgYXBpVXJsID0gXCJodHRwczovL2Zsb3djaGF0YmFja2VuZC5henVyZXdlYnNpdGVzLm5ldC9hcGkvRm9ydW0vdXBkYXRlUG9zdE9yQ29tbWVudFwiO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYXBpVXJsLCB7XG4gICAgICBtZXRob2Q6IFwiUFVUXCIsIC8vIFVzZSBQVVQgbWV0aG9kIGZvciB1cGRhdGluZ1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi50b2tlbn1gLCAvLyBBdXRob3JpemF0aW9uIHRva2VuXG4gICAgICB9LFxuICAgICAgYm9keTogZm9ybURhdGEsIC8vIEZvcm1EYXRhIGNvbnRhaW5pbmcgcmVxdWVzdEJvZHkgYW5kIGltYWdlTGlzdFxuICAgIH0pO1xuXG4gICAgLy8gQ2hlY2sgcmVzcG9uc2Ugc3RhdHVzXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDE1KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIG1lZGlhIHR5cGUsIHBsZWFzZSBjaGVjayByZXF1ZXN0IGZvcm1hdFwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBdXRoZW50aWNhdGlvbiBmYWlsZWQsIHBsZWFzZSBsb2cgaW4gYWdhaW5cIik7XG4gICAgICB9XG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA1MDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2VydmVyIGVycm9yLCBwbGVhc2UgY29udGFjdCB0aGUgYWRtaW5pc3RyYXRvclwiKTtcbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIHVwZGF0ZSBwb3N0LCBzdGF0dXMgY29kZTogJHtyZXNwb25zZS5zdGF0dXN9YCk7XG4gICAgfVxuXG4gICAgLy8gUGFyc2UgdGhlIHJlc3BvbnNlXG4gICAgY29uc3QgZGF0YTogQ3JlYXRlUG9zdFJlc3BvbnNlID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIGxldCB1cGRhdGVkUG9zdElkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgaXNTdWNjZXNzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvLyBIYW5kbGUgZGlmZmVyZW50IHJlc3BvbnNlIGZvcm1hdHMsIGNvbnNpc3RlbnQgd2l0aCBjcmVhdGVQb3N0XG4gICAgaWYgKHR5cGVvZiBkYXRhLmRhdGEgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIC8vIExlZ2FjeSBmb3JtYXQ6IGRhdGEuZGF0YSBpcyBhIHN0cmluZyBsaWtlIFwiNDggc3VjY2VzczogdHJ1ZVwiXG4gICAgICBjb25zdCBkYXRhU3RyaW5nID0gZGF0YS5kYXRhIGFzIHN0cmluZztcbiAgICAgIGNvbnN0IFtpZCwgc3VjY2Vzc1BhcnRdID0gZGF0YVN0cmluZy5zcGxpdChcIiBzdWNjZXNzOiBcIik7XG4gICAgICB1cGRhdGVkUG9zdElkID0gaWQ7XG4gICAgICBpc1N1Y2Nlc3MgPSBzdWNjZXNzUGFydCA9PT0gXCJ0cnVlXCI7XG4gICAgfSBlbHNlIGlmIChkYXRhLmRhdGEgJiYgdHlwZW9mIGRhdGEuZGF0YSA9PT0gXCJvYmplY3RcIiAmJiBcImlzU3VjY2Vzc1wiIGluIGRhdGEuZGF0YSkge1xuICAgICAgLy8gTmV3IGZvcm1hdDogZGF0YS5kYXRhIGlzIGFuIG9iamVjdCBsaWtlIHsgaXNTdWNjZXNzOiB0cnVlIH1cbiAgICAgIGlzU3VjY2VzcyA9IChkYXRhLmRhdGEgYXMgeyBpc1N1Y2Nlc3M6IGJvb2xlYW4gfSkuaXNTdWNjZXNzO1xuICAgICAgaWYgKGlzU3VjY2Vzcykge1xuICAgICAgICAvLyBCYWNrZW5kIGRpZCBub3QgcmV0dXJuIHBvc3RJZCwgdXNlIHRoZSBwcm92aWRlZCBwb3N0SWRcbiAgICAgICAgdXBkYXRlZFBvc3RJZCA9IHBvc3RJZDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCByZXNwb25zZSBmb3JtYXQgZnJvbSBiYWNrZW5kXCIpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHRoZSB1cGRhdGUgd2FzIHN1Y2Nlc3NmdWxcbiAgICBpZiAoIWlzU3VjY2Vzcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGRhdGEubWVzc2FnZSB8fCBcIkZhaWxlZCB0byB1cGRhdGUgcG9zdFwiKTtcbiAgICB9XG5cbiAgICAvLyBFbnN1cmUgYSBwb3N0IElEIGlzIGF2YWlsYWJsZSBmb3IgbmF2aWdhdGlvblxuICAgIGlmICghdXBkYXRlZFBvc3RJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIHJldHJpZXZlIHBvc3QgSUQgZm9yIG5hdmlnYXRpb25cIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVwZGF0ZWRQb3N0SWQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoic1JBNERzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/hooks/useTags.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "TagContext": (()=>TagContext),
    "TagProvider": (()=>TagProvider),
    "useTagContext": (()=>useTagContext)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const TagContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    selectedTags: [],
    setSelectedTags: ()=>{},
    isPostsLoading: false,
    setPostsLoading: ()=>{}
});
function TagProvider({ children }) {
    _s();
    const [selectedTags, setSelectedTags] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isPostsLoading, setPostsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TagContext.Provider, {
        value: {
            selectedTags,
            setSelectedTags,
            isPostsLoading,
            setPostsLoading
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/hooks/useTags.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_s(TagProvider, "IeheE3b3XSEpXjQ3rUhznY2PJ4k=");
_c = TagProvider;
function useTagContext() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(TagContext);
    if (context === undefined) {
        throw new Error("useTagContext must be used within a TagProvider");
    }
    return context;
}
_s1(useTagContext, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "TagProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/navigation/SideMenu.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>SideMenu)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@fortawesome/react-fontawesome/index.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@fortawesome/free-solid-svg-icons/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$data$3a$4236a1__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/utils/data:4236a1 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTags$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useTags.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function SideMenu() {
    _s();
    const { selectedTags: searchTags, setSelectedTags: setSearchTags, isPostsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTags$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTagContext"])();
    const [AllTags, setAllTags] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [recommendedTags, setRecommendedTags] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Add debounced loading state to prevent flickering
    const [debouncedLoading, setDebouncedLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(isPostsLoading);
    const timerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Debounce the loading state changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SideMenu.useEffect": ()=>{
            // When loading starts, update immediately
            if (isPostsLoading) {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }
                setDebouncedLoading(true);
            } else {
                // When loading ends, delay the update by 500ms
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                }
                timerRef.current = setTimeout({
                    "SideMenu.useEffect": ()=>{
                        setDebouncedLoading(false);
                    }
                }["SideMenu.useEffect"], 500);
            }
            // Clean up
            return ({
                "SideMenu.useEffect": ()=>{
                    if (timerRef.current) {
                        clearTimeout(timerRef.current);
                    }
                }
            })["SideMenu.useEffect"];
        }
    }["SideMenu.useEffect"], [
        isPostsLoading
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SideMenu.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$data$3a$4236a1__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getAllTags"])().then({
                "SideMenu.useEffect": (tags)=>{
                    setAllTags(tags);
                    setRecommendedTags(tags);
                }
            }["SideMenu.useEffect"]);
        }
    }["SideMenu.useEffect"], []);
    const toggleTag = (tag)=>{
        if (debouncedLoading) return;
        if (searchTags.some((t)=>t.tagId === tag.tagId)) {
            setSearchTags(searchTags.filter((t)=>t.tagId !== tag.tagId));
        } else {
            setSearchTags([
                ...searchTags,
                tag
            ]);
        }
    };
    const handleFilterTags = (e)=>{
        const search = e.target.value.toLowerCase();
        const filteredTags = AllTags.filter((tag)=>tag.tagName.toLowerCase().includes(search));
        setRecommendedTags(filteredTags);
    };
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const shouldShow = pathname?.includes("/forum/latest") || pathname?.includes("/forum/recommended") || pathname?.includes("/forum/search-results") || pathname?.includes("/forum/following");
    if (shouldShow) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "card bg-base-100 fixed w-77 h-full overflow-hidden",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card-body gap-0 flex flex-col h-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/forum/create-post",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-primary w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["faPlus"]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/SideMenu.tsx",
                                        lineNumber: 83,
                                        columnNumber: 17
                                    }, this),
                                    "Create Post"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/navigation/SideMenu.tsx",
                                lineNumber: 82,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/navigation/SideMenu.tsx",
                            lineNumber: 81,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/navigation/SideMenu.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "divider my-0 gap-0"
                    }, void 0, false, {
                        fileName: "[project]/src/components/navigation/SideMenu.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this),
                    "Filter By Tags",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row gap-2 justify-between flex-shrink-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-grow w-full relative my-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "Search tags",
                                    className: "w-full h-8 rounded-full bg-base-200 pl-10 pr-4 border-base-300",
                                    onChange: handleFilterTags
                                }, void 0, false, {
                                    fileName: "[project]/src/components/navigation/SideMenu.tsx",
                                    lineNumber: 93,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["faMagnifyingGlass"],
                                    className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/navigation/SideMenu.tsx",
                                    lineNumber: 99,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/navigation/SideMenu.tsx",
                            lineNumber: 92,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/navigation/SideMenu.tsx",
                        lineNumber: 91,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300 h-full overflow-y-scroll",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2 p-1",
                            children: recommendedTags.map((tag)=>{
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `btn btn-sm ${searchTags.some((t)=>t.tagId === tag.tagId) ? "btn-primary" : "btn-accent"}`,
                                    //if debouncedLoading is true do not toggle tag
                                    onClick: ()=>{
                                        if (!debouncedLoading) {
                                            toggleTag(tag);
                                        }
                                    },
                                    children: tag.tagName
                                }, tag.tagId, false, {
                                    fileName: "[project]/src/components/navigation/SideMenu.tsx",
                                    lineNumber: 111,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/components/navigation/SideMenu.tsx",
                            lineNumber: 108,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/navigation/SideMenu.tsx",
                        lineNumber: 106,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/navigation/SideMenu.tsx",
                lineNumber: 78,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/navigation/SideMenu.tsx",
            lineNumber: 77,
            columnNumber: 7
        }, this);
    } else return null;
}
_s(SideMenu, "II4BcqV8/w+59cO8gWEwLH50d2k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTags$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTagContext"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = SideMenu;
var _c;
__turbopack_context__.k.register(_c, "SideMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_a4cfef16._.js.map