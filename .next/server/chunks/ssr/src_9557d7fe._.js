module.exports = {

"[project]/src/components/settings/UserSection.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>UserInfo)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$users$2f$UserAvatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/users/UserAvatar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSession$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSession.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function UserInfo() {
    const { session } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSession$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSession"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card lg:min-w-lg gap-2 bg-base-100 shadow-md p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-15 flex items-center gap-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "avatar avatar-placeholder items-center gap-1",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$users$2f$UserAvatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        src: session.avatar,
                        size: "lg"
                    }, void 0, false, {
                        fileName: "[project]/src/components/settings/UserSection.tsx",
                        lineNumber: 15,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/settings/UserSection.tsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl font-bold",
                            children: session.username
                        }, void 0, false, {
                            fileName: "[project]/src/components/settings/UserSection.tsx",
                            lineNumber: 20,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-base-content/70",
                            children: session.email
                        }, void 0, false, {
                            fileName: "[project]/src/components/settings/UserSection.tsx",
                            lineNumber: 21,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/settings/UserSection.tsx",
                    lineNumber: 19,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/settings/UserSection.tsx",
            lineNumber: 12,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/settings/UserSection.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/utils/data:b66ce9 [app-ssr] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"40c048b43b1da302a737f857ac6e713a2babf0897d":"resetPasswordByOldPassword"},"src/utils/authentication.ts",""] */ __turbopack_context__.s({
    "resetPasswordByOldPassword": (()=>resetPasswordByOldPassword)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var resetPasswordByOldPassword = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("40c048b43b1da302a737f857ac6e713a2babf0897d", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "resetPasswordByOldPassword"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYXV0aGVudGljYXRpb24udHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc2VydmVyXCI7XG5cbmltcG9ydCB7IGdldFNlc3Npb24gfSBmcm9tIFwiQC91dGlscy9zZXNzaW9uc1wiO1xuXG4vLyBBUEkgcmVzcG9uc2UgdHlwZXNcbmludGVyZmFjZSBBcGlSZXNwb25zZTxUPiB7XG4gIG1lc3NhZ2U6IHN0cmluZztcbiAgZGF0YTogVDtcbn1cblxuaW50ZXJmYWNlIExvZ2luRGF0YSB7XG4gIGlzUGFzc3dvcmRDb3JyZWN0OiBib29sZWFuIHwgbnVsbDtcbiAgaXNBY2NvdW50QWN0aXZlOiBib29sZWFuO1xuICB1c2VyOiB7XG4gICAgcm9sZXM6IHN0cmluZztcbiAgICBpZDogbnVtYmVyO1xuICAgIGF2YXRhcjogc3RyaW5nIHwgbnVsbDtcbiAgICBlbWFpbDogc3RyaW5nO1xuICAgIHRva2VuOiBzdHJpbmc7XG4gICAgdXNlcm5hbWU6IHN0cmluZztcbiAgfSB8IG51bGw7XG59XG5cbmludGVyZmFjZSBSZWdpc3RlckRhdGEge1xuICB1c2VyOiB7XG4gICAgcm9sZTogc3RyaW5nO1xuICAgIGlkOiBudW1iZXI7XG4gICAgdXNlcm5hbWU6IHN0cmluZztcbiAgfSB8IG51bGw7XG4gIGlzU3VjY2VzczogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIFJlcXVlc3REYXRhIHtcbiAgaXNTdWNjZXNzOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgRW1haWxDaGVja0RhdGEge1xuICBpc0VtYWlsVW5pcXVlOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgVXNlcm5hbWVDaGVja0RhdGEge1xuICBpc1VzZXJuYW1lVW5pcXVlOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgRGVsZXRlQWNjb3VudERhdGEge1xuICBpc1N1Y2Nlc3M6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBSZXNldFBhc3N3b3JkRGF0YSB7XG4gIHVzZXJuYW1lOiBzdHJpbmcgfCBudWxsO1xuICBpc1N1Y2Nlc3M6IGJvb2xlYW47XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbiBmb3IgQVBJIGNhbGxzIHRvIHJlZHVjZSByZXBldGl0aW9uXG5hc3luYyBmdW5jdGlvbiBhcGlGZXRjaDxUPihlbmRwb2ludDogc3RyaW5nLCBvcHRpb25zPzogUmVxdWVzdEluaXQpOiBQcm9taXNlPEFwaVJlc3BvbnNlPFQ+PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9mbG93Y2hhdGJhY2tlbmQuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpLyR7ZW5kcG9pbnR9YCwgb3B0aW9ucyk7XG4gICAgY29uc3QgcmVzdWx0OiBBcGlSZXNwb25zZTxUPiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoYEFQSSBlcnJvciAoJHtlbmRwb2ludH0pOmAsIGVycm9yKTtcbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZTogXCJBbiBlcnJvciBvY2N1cnJlZCBkdXJpbmcgdGhlIHJlcXVlc3RcIixcbiAgICAgIGRhdGE6IHt9IGFzIFQsXG4gICAgfTtcbiAgfVxufVxuXG4vLyBMb2dpbiBzZXJ2ZXIgYWN0aW9uXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9naW4oZm9ybURhdGE6IEZvcm1EYXRhKSB7XG4gIGNvbnN0IHVzZXJuYW1lID0gZm9ybURhdGEuZ2V0KFwidXNlcm5hbWVcIikgYXMgc3RyaW5nIHwgbnVsbDtcbiAgY29uc3QgZW1haWwgPSBmb3JtRGF0YS5nZXQoXCJlbWFpbFwiKSBhcyBzdHJpbmcgfCBudWxsO1xuICBjb25zdCBwYXNzd29yZCA9IGZvcm1EYXRhLmdldChcInBhc3N3b3JkXCIpIGFzIHN0cmluZztcblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGFwaUZldGNoPExvZ2luRGF0YT4oXCIvQWNjb3VudC9sb2dpblwiLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB1c2VybmFtZSwgZW1haWwsIHBhc3N3b3JkIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gU3VjY2Vzc2Z1bCBsb2dpblxuICAgIGlmIChyZXN1bHQuZGF0YS5pc1Bhc3N3b3JkQ29ycmVjdCAmJiByZXN1bHQuZGF0YS5pc0FjY291bnRBY3RpdmUgJiYgcmVzdWx0LmRhdGEudXNlcikge1xuICAgICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlc3Npb24oKTtcblxuICAgICAgLy8gU2F2ZSB1c2VyIGRhdGEgaW4gc2Vzc2lvblxuICAgICAgc2Vzc2lvbi51c2VySWQgPSByZXN1bHQuZGF0YS51c2VyLmlkO1xuICAgICAgc2Vzc2lvbi51c2VybmFtZSA9IHJlc3VsdC5kYXRhLnVzZXIudXNlcm5hbWU7XG4gICAgICBzZXNzaW9uLnJvbGVzID0gcmVzdWx0LmRhdGEudXNlci5yb2xlcztcbiAgICAgIHNlc3Npb24uaXNMb2dnZWRJbiA9IHRydWU7XG4gICAgICBzZXNzaW9uLnRva2VuID0gcmVzdWx0LmRhdGEudXNlci50b2tlbjtcbiAgICAgIHNlc3Npb24uYXZhdGFyID0gcmVzdWx0LmRhdGEudXNlci5hdmF0YXI7XG4gICAgICBzZXNzaW9uLmVtYWlsID0gcmVzdWx0LmRhdGEudXNlci5lbWFpbDtcbiAgICAgIGF3YWl0IHNlc3Npb24uc2F2ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiB7XG4gICAgICBtZXNzYWdlOiBcIkxvZ2luIGZhaWxlZFwiLFxuICAgICAgZGF0YToge1xuICAgICAgICBpc1Bhc3N3b3JkQ29ycmVjdDogZmFsc2UsXG4gICAgICAgIGlzQWNjb3VudEFjdGl2ZTogZmFsc2UsXG4gICAgICAgIHVzZXI6IG51bGwsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cblxuLy8gTG9nb3V0IHNlcnZlciBhY3Rpb25cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dvdXQoKSB7XG4gIHRyeSB7XG4gICAgLy8gY2xlYXIgc2Vzc2lvblxuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXNzaW9uKCk7XG4gICAgc2Vzc2lvbi5kZXN0cm95KCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkxvZ291dCBlcnJvcjpcIiwgZXJyb3IpO1xuICAgIHJldHVybiB7IGVycm9yOiBcIkZhaWxlZCB0byBsb2cgb3V0XCIgfTtcbiAgfVxufVxuXG4vLyBSZWdpc3RyYXRpb24gc2VydmVyIGFjdGlvblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlZ2lzdGVyKGZvcm1EYXRhOiBGb3JtRGF0YSkge1xuICBjb25zdCB1c2VybmFtZSA9IGZvcm1EYXRhLmdldChcInVzZXJuYW1lXCIpIGFzIHN0cmluZztcbiAgY29uc3QgZW1haWwgPSBmb3JtRGF0YS5nZXQoXCJlbWFpbFwiKSBhcyBzdHJpbmc7XG4gIGNvbnN0IHBhc3N3b3JkID0gZm9ybURhdGEuZ2V0KFwicGFzc3dvcmRcIikgYXMgc3RyaW5nO1xuICBjb25zdCBsaWNlbnNlS2V5ID0gZm9ybURhdGEuZ2V0KFwibGljZW5zZUtleVwiKSBhcyBzdHJpbmc7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBhcGlGZXRjaDxSZWdpc3RlckRhdGE+KFwiQWNjb3VudC9yZWdpc3RlckFjY291bnRcIiwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdXNlcm5hbWUsIGVtYWlsLCBwYXNzd29yZCwgbGljZW5zZUtleSB9KSxcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiB7XG4gICAgICBtZXNzYWdlOiBcIkFuIGVycm9yIG9jY3VycmVkIGR1cmluZyByZWdpc3RyYXRpb25cIixcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdXNlcjogbnVsbCxcbiAgICAgICAgaXNTdWNjZXNzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG4vLyBSZXF1ZXN0IGxpY2Vuc2Uga2V5IHNlcnZlciBhY3Rpb25cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXF1ZXN0TGljZW5zZUtleShlbWFpbDogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgYXBpRmV0Y2g8UmVxdWVzdERhdGE+KFwiQWNjb3VudC9yZXF1ZXN0TGljZW5zZUtleVwiLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBlbWFpbCB9KSxcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiB7XG4gICAgICBtZXNzYWdlOiBcIkZhaWxlZCB0byByZXF1ZXN0IGxpY2Vuc2Uga2V5XCIsXG4gICAgICBkYXRhOiB7IGlzU3VjY2VzczogZmFsc2UgfSxcbiAgICB9O1xuICB9XG59XG5cbi8vIFJlcXVlc3QgYXV0aGVudGljYXRpb24gY29kZSBzZXJ2ZXIgYWN0aW9uXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWVzdEF1dGhDb2RlKGVtYWlsOiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBhcGlGZXRjaDxSZXF1ZXN0RGF0YT4oXCJBY2NvdW50L3JlcXVlc3RBdXRoZW50aWNhdGlvbkNvZGVcIiwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgZW1haWwgfSksXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZTogXCJGYWlsZWQgdG8gcmVxdWVzdCBhdXRoZW50aWNhdGlvbiBjb2RlXCIsXG4gICAgICBkYXRhOiB7IGlzU3VjY2VzczogZmFsc2UgfSxcbiAgICB9O1xuICB9XG59XG5cbi8vIENoZWNrIGlmIGVtYWlsIGlzIHVuaXF1ZSBzZXJ2ZXIgYWN0aW9uXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2hlY2tFbWFpbFVuaXF1ZShlbWFpbDogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGFwaUZldGNoPEVtYWlsQ2hlY2tEYXRhPihgQWNjb3VudC9pc0VtYWlsVW5pcXVlP2VtYWlsPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGVtYWlsKX1gKTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIGNoZWNrIGVtYWlsIHVuaXF1ZW5lc3NcIixcbiAgICAgIGRhdGE6IHsgaXNFbWFpbFVuaXF1ZTogZmFsc2UgfSxcbiAgICB9O1xuICB9XG59XG5cbi8vIENoZWNrIGlmIHVzZXJuYW1lIGlzIHVuaXF1ZSBzZXJ2ZXIgYWN0aW9uXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2hlY2tVc2VybmFtZVVuaXF1ZSh1c2VybmFtZTogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGFwaUZldGNoPFVzZXJuYW1lQ2hlY2tEYXRhPihgQWNjb3VudC9pc1VzZXJuYW1lVW5pcXVlP3VzZXJuYW1lPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHVzZXJuYW1lKX1gKTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIGNoZWNrIHVzZXJuYW1lIHVuaXF1ZW5lc3NcIixcbiAgICAgIGRhdGE6IHsgaXNVc2VybmFtZVVuaXF1ZTogZmFsc2UgfSxcbiAgICB9O1xuICB9XG59XG5cbi8vIERlbGV0ZSBhY2NvdW50IHNlcnZlciBhY3Rpb25cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVBY2NvdW50KGZvcm1EYXRhOiBGb3JtRGF0YSkge1xuICBjb25zdCB1c2VybmFtZSA9IGZvcm1EYXRhLmdldChcInVzZXJuYW1lXCIpIGFzIHN0cmluZyB8IG51bGw7XG4gIGNvbnN0IGVtYWlsID0gZm9ybURhdGEuZ2V0KFwiZW1haWxcIikgYXMgc3RyaW5nIHwgbnVsbDtcbiAgY29uc3QgcGFzc3dvcmQgPSBmb3JtRGF0YS5nZXQoXCJwYXNzd29yZFwiKSBhcyBzdHJpbmc7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2Vzc2lvbigpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGFwaUZldGNoPERlbGV0ZUFjY291bnREYXRhPihcIkFjY291bnQvZGVsZXRlQWNjb3VudFwiLCB7XG4gICAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi50b2tlbn1gXG4gICAgICB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBlbWFpbCwgdXNlcm5hbWUsIHBhc3N3b3JkIH0pLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIGRlbGV0ZSBhY2NvdW50XCIsXG4gICAgICBkYXRhOiB7IGlzU3VjY2VzczogZmFsc2UgfSxcbiAgICB9O1xuICB9XG59XG5cbi8vIFJlc2V0IHBhc3N3b3JkIGJ5IGVtYWlsIHNlcnZlciBhY3Rpb25cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXNldFBhc3N3b3JkQnlFbWFpbChmb3JtRGF0YTogRm9ybURhdGEpIHtcbiAgY29uc3QgZW1haWwgPSBmb3JtRGF0YS5nZXQoXCJlbWFpbFwiKSBhcyBzdHJpbmc7XG4gIGNvbnN0IHBhc3N3b3JkID0gZm9ybURhdGEuZ2V0KFwicGFzc3dvcmRcIikgYXMgc3RyaW5nO1xuICBjb25zdCBhdXRoZW50aWNhdGlvbkNvZGUgPSBmb3JtRGF0YS5nZXQoXCJhdXRoZW50aWNhdGlvbkNvZGVcIikgYXMgc3RyaW5nO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgYXBpRmV0Y2g8UmVzZXRQYXNzd29yZERhdGE+KFwiQWNjb3VudC9yZXNldFBhc3N3b3JkQnlFbWFpbFwiLCB7XG4gICAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGVtYWlsLCBwYXNzd29yZCwgYXV0aGVudGljYXRpb25Db2RlIH0pLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIHJlc2V0IHBhc3N3b3JkXCIsXG4gICAgICBkYXRhOiB7IHVzZXJuYW1lOiBudWxsLCBpc1N1Y2Nlc3M6IGZhbHNlIH0sXG4gICAgfTtcbiAgfVxufVxuXG4vLyBSZXNldCBwYXNzd29yZCBieSBvbGQgcGFzc3dvcmQgc2VydmVyIGFjdGlvblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc2V0UGFzc3dvcmRCeU9sZFBhc3N3b3JkKGZvcm1EYXRhOiBGb3JtRGF0YSkge1xuICBjb25zdCBlbWFpbCA9IGZvcm1EYXRhLmdldChcImVtYWlsXCIpIGFzIHN0cmluZztcbiAgY29uc3Qgb2xkUGFzc3dvcmQgPSBmb3JtRGF0YS5nZXQoXCJvbGRQYXNzd29yZFwiKSBhcyBzdHJpbmc7XG4gIGNvbnN0IG5ld1Bhc3N3b3JkID0gZm9ybURhdGEuZ2V0KFwibmV3UGFzc3dvcmRcIikgYXMgc3RyaW5nO1xuXG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlc3Npb24oKTtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBhcGlGZXRjaDxSZXNldFBhc3N3b3JkRGF0YT4oXCJBY2NvdW50L3Jlc2V0UGFzc3dvcmRCeU9sZFBhc3N3b3JkXCIsIHtcbiAgICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnRva2VufWBcbiAgICAgIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGVtYWlsLCBvbGRQYXNzd29yZCwgbmV3UGFzc3dvcmQgfSksXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZTogXCJGYWlsZWQgdG8gcmVzZXQgcGFzc3dvcmRcIixcbiAgICAgIGRhdGE6IHsgdXNlcm5hbWU6IG51bGwsIGlzU3VjY2VzczogZmFsc2UgfSxcbiAgICB9O1xuICB9XG59XG5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiK1NBZ1FzQiJ9
}}),
"[project]/src/components/settings/ChangePasswordForm.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ChangePasswordSection)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@fortawesome/free-solid-svg-icons/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@fortawesome/react-fontawesome/index.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$data$3a$b66ce9__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/utils/data:b66ce9 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSession$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSession.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function ChangePasswordSection({ setPasswordInputBoxOpen }) {
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [serverSuccessMessage, setServerSuccessMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [serverErrorMessage, setServerErrorMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [oldPassword, setOldPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [newPassword, setNewPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [confirmPassword, setConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [failure, setFailure] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [passwordFormatError, setPasswordFormatError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const { session } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSession$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSession"])();
    const wait = (s)=>{
        return new Promise((resolve)=>setTimeout(resolve, s * 1000));
    };
    const clearForm = ()=>{
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };
    const handleForgotPassword = async (e)=>{
        e.preventDefault();
        setFailure(false);
        setLoading(true);
        try {
            if (session.email === undefined) {
                throw new Error("user email is undefined");
            }
            const formData = new FormData();
            formData.append("email", session.email);
            formData.append("oldPassword", oldPassword);
            formData.append("newPassword", newPassword);
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$data$3a$b66ce9__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["resetPasswordByOldPassword"])(formData);
            if (result.data.username && result.data.isSuccess) {
                setFailure(false);
                setLoading(false);
                setSuccess(true);
                setServerSuccessMessage(result.message);
                clearForm();
                await wait(3);
                setServerSuccessMessage("");
                setPasswordInputBoxOpen(false);
                setSuccess(false);
                clearServerError();
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            } else {
                setServerErrorMessage(result.message);
                setErrors((prevErrors)=>[
                        result.message,
                        ...prevErrors
                    ]);
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
                setLoading(false);
                setFailure(true);
            }
        } catch  {}
    };
    const clearServerError = ()=>{
        if (serverErrorMessage) {
            setErrors((prevErrors)=>prevErrors.filter((error)=>error !== serverErrorMessage));
            setServerErrorMessage("");
        }
    };
    const handleOldPasswordChange = (e)=>{
        clearServerError();
        const newOldPassword = e.target.value;
        if (!newOldPassword) {
            setErrors((prevErrors)=>[
                    "Password is required",
                    ...prevErrors
                ]);
            setOldPassword(newOldPassword);
            return;
        } else {
            setErrors((prevErrors)=>prevErrors.filter((error)=>error !== "Password is required"));
        }
        setOldPassword(newOldPassword);
    };
    const handleNewPasswordChange = (e)=>{
        clearServerError();
        const newNewPassword = e.target.value;
        if (!newNewPassword) {
            setErrors((prevErrors)=>[
                    "Password is required",
                    ...prevErrors
                ]);
            setNewPassword(newNewPassword);
            return;
        } else {
            setErrors((prevErrors)=>prevErrors.filter((error)=>error !== "Password is required"));
        }
        if (newNewPassword.length > 50) {
            setErrors((prevErrors)=>[
                    "Password cannot exceed 50 characters",
                    ...prevErrors
                ]);
            return;
        } else {
            setErrors((prevErrors)=>prevErrors.filter((error)=>error !== "Password cannot exceed 50 characters"));
        }
        setNewPassword(newNewPassword);
        const passwordCriteria = /^(?=.*[A-Za-z])(?=.*\d)(?!.*\s).{8,}$/;
        if (!passwordCriteria.test(newNewPassword)) {
            setPasswordFormatError(true);
        } else {
            setPasswordFormatError(false);
        }
    };
    const handleConfirmPasswordChange = (e)=>{
        clearServerError();
        const newConfirmPassword = e.target.value;
        if (!newConfirmPassword) {
            setErrors((prevErrors)=>[
                    "Confirm password is required",
                    ...prevErrors
                ]);
            setConfirmPassword(newConfirmPassword);
            return;
        } else {
            setErrors((prevErrors)=>prevErrors.filter((error)=>error !== "Confirm password is required"));
        }
        if (newConfirmPassword !== newPassword) {
            setErrors((prevErrors)=>[
                    "Passwords do not match",
                    ...prevErrors
                ]);
        } else {
            setErrors((prevErrors)=>prevErrors.filter((error)=>error !== "Passwords do not match"));
        }
        setConfirmPassword(newConfirmPassword);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-gray-500/20 flex justify-center items-center z-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0",
                onClick: ()=>{
                    setPasswordInputBoxOpen(false);
                }
            }, void 0, false, {
                fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: `card w-fit min-w-sm lg:min-w-lg max-w-xl bg-base-100 shadow-xl`,
                onSubmit: handleForgotPassword,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `card-body gap-4"`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "card-title text-center text-bg",
                            children: "Change Your Password"
                        }, void 0, false, {
                            fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                            lineNumber: 148,
                            columnNumber: 11
                        }, this),
                        success && !errors.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            role: "alert",
                            className: "alert alert-success alert-soft",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faCheck"],
                                    className: "text-2xl text-success"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                                    lineNumber: 152,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: serverSuccessMessage
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                                    lineNumber: 153,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                            lineNumber: 151,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            role: "alert",
                            className: `alert alert-error alert-soft ${passwordFormatError || errors.length ? "" : "hidden"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faTriangleExclamation"],
                                    className: "text-2xl text-error"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                                    lineNumber: 160,
                                    columnNumber: 15
                                }, this),
                                passwordFormatError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        "Password must be at least 8 characters, with ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                                            lineNumber: 163,
                                            columnNumber: 64
                                        }, this),
                                        " At least one alphabet (a~z, A~Z)",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                                            lineNumber: 164,
                                            columnNumber: 19
                                        }, this),
                                        " At least one numerical character (0~9)"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                                    lineNumber: 162,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: errors[0]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                                    lineNumber: 167,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                            lineNumber: 156,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "divider my-0"
                        }, void 0, false, {
                            fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                            lineNumber: 172,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-control",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "label",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "label-text text-base-content",
                                        children: "Old Password"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                                        lineNumber: 176,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                                    lineNumber: 175,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    placeholder: "Old Password",
                                    className: "input input-bordered w-full my-1",
                                    value: oldPassword,
                                    onChange: handleOldPasswordChange
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                                    lineNumber: 178,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                            lineNumber: 174,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-control",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "label",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "label-text text-base-content",
                                        children: "New Password"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                                        lineNumber: 189,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                                    lineNumber: 188,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    placeholder: "New Password",
                                    className: "input input-bordered w-full my-1",
                                    value: newPassword,
                                    onChange: handleNewPasswordChange
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                                    lineNumber: 191,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                            lineNumber: 187,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-control",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "label",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "label-text text-base-content",
                                        children: "Confirm New Password"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                                        lineNumber: 202,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                                    lineNumber: 201,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    placeholder: "Confirm Password",
                                    className: "input input-bordered w-full my-1",
                                    value: confirmPassword,
                                    onChange: handleConfirmPasswordChange
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                                    lineNumber: 204,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                            lineNumber: 200,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-control",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: `btn btn-primary text-primary-content w-full `,
                                onClick: (e)=>{
                                    if (errors.length) {
                                        e.preventDefault();
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth"
                                        });
                                        return;
                                    }
                                    if (!oldPassword) {
                                        e.preventDefault();
                                        setErrors((prevErrors)=>[
                                                "Old Password is required",
                                                ...prevErrors
                                            ]);
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth"
                                        });
                                        return;
                                    }
                                    if (!newPassword) {
                                        e.preventDefault();
                                        setErrors((prevErrors)=>[
                                                "New Password is required",
                                                ...prevErrors
                                            ]);
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth"
                                        });
                                        return;
                                    }
                                    if (!confirmPassword) {
                                        e.preventDefault();
                                        setErrors((prevErrors)=>[
                                                "Confirm password is required",
                                                ...prevErrors
                                            ]);
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth"
                                        });
                                        return;
                                    }
                                    if (newPassword !== confirmPassword) {
                                        e.preventDefault();
                                        setErrors((prevErrors)=>[
                                                "Passwords do not match",
                                                ...prevErrors
                                            ]);
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth"
                                        });
                                        return;
                                    }
                                },
                                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "loading loading-dots loading-md bg-base-content"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                                    lineNumber: 250,
                                    columnNumber: 17
                                }, this) : failure ? "Retry" : "Reset Password"
                            }, void 0, false, {
                                fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                                lineNumber: 214,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                            lineNumber: 213,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `form-control mt-2`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "btn btn-secondary w-full bg-base-300 text-base-content border-none",
                                onClick: ()=>{
                                    setPasswordInputBoxOpen(false);
                                    clearForm();
                                    setFailure(false);
                                    setPasswordFormatError(false);
                                    clearServerError();
                                    setErrors([]);
                                },
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                                lineNumber: 260,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                            lineNumber: 259,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                    lineNumber: 146,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/settings/ChangePasswordForm.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/components/settings/ChangePasswordSection.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ChangePassword)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$settings$2f$ChangePasswordForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/settings/ChangePasswordForm.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function ChangePassword() {
    const [isPasswordInputBoxOpen, setPasswordInputBoxOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card-body p-0 gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-4 items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card-body p-0 gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xl font-bold",
                                children: "Change Password"
                            }, void 0, false, {
                                fileName: "[project]/src/components/settings/ChangePasswordSection.tsx",
                                lineNumber: 14,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-base-content/70",
                                children: "Strengthen your account by setting a stronger password."
                            }, void 0, false, {
                                fileName: "[project]/src/components/settings/ChangePasswordSection.tsx",
                                lineNumber: 15,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/settings/ChangePasswordSection.tsx",
                        lineNumber: 13,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-primary",
                                onClick: ()=>{
                                    setPasswordInputBoxOpen(true);
                                },
                                children: "Change Password"
                            }, void 0, false, {
                                fileName: "[project]/src/components/settings/ChangePasswordSection.tsx",
                                lineNumber: 19,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: isPasswordInputBoxOpen ? "" : "hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$settings$2f$ChangePasswordForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    setPasswordInputBoxOpen: setPasswordInputBoxOpen
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ChangePasswordSection.tsx",
                                    lineNumber: 27,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/settings/ChangePasswordSection.tsx",
                                lineNumber: 26,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/settings/ChangePasswordSection.tsx",
                        lineNumber: 18,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/settings/ChangePasswordSection.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "divider my-0"
            }, void 0, false, {
                fileName: "[project]/src/components/settings/ChangePasswordSection.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/settings/ChangePasswordSection.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/utils/data:f8f7bf [app-ssr] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"40430f2a71e67aa13cdbf0605769d18bb84a35bfd6":"deleteAccount"},"src/utils/authentication.ts",""] */ __turbopack_context__.s({
    "deleteAccount": (()=>deleteAccount)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var deleteAccount = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("40430f2a71e67aa13cdbf0605769d18bb84a35bfd6", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "deleteAccount"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYXV0aGVudGljYXRpb24udHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc2VydmVyXCI7XG5cbmltcG9ydCB7IGdldFNlc3Npb24gfSBmcm9tIFwiQC91dGlscy9zZXNzaW9uc1wiO1xuXG4vLyBBUEkgcmVzcG9uc2UgdHlwZXNcbmludGVyZmFjZSBBcGlSZXNwb25zZTxUPiB7XG4gIG1lc3NhZ2U6IHN0cmluZztcbiAgZGF0YTogVDtcbn1cblxuaW50ZXJmYWNlIExvZ2luRGF0YSB7XG4gIGlzUGFzc3dvcmRDb3JyZWN0OiBib29sZWFuIHwgbnVsbDtcbiAgaXNBY2NvdW50QWN0aXZlOiBib29sZWFuO1xuICB1c2VyOiB7XG4gICAgcm9sZXM6IHN0cmluZztcbiAgICBpZDogbnVtYmVyO1xuICAgIGF2YXRhcjogc3RyaW5nIHwgbnVsbDtcbiAgICBlbWFpbDogc3RyaW5nO1xuICAgIHRva2VuOiBzdHJpbmc7XG4gICAgdXNlcm5hbWU6IHN0cmluZztcbiAgfSB8IG51bGw7XG59XG5cbmludGVyZmFjZSBSZWdpc3RlckRhdGEge1xuICB1c2VyOiB7XG4gICAgcm9sZTogc3RyaW5nO1xuICAgIGlkOiBudW1iZXI7XG4gICAgdXNlcm5hbWU6IHN0cmluZztcbiAgfSB8IG51bGw7XG4gIGlzU3VjY2VzczogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIFJlcXVlc3REYXRhIHtcbiAgaXNTdWNjZXNzOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgRW1haWxDaGVja0RhdGEge1xuICBpc0VtYWlsVW5pcXVlOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgVXNlcm5hbWVDaGVja0RhdGEge1xuICBpc1VzZXJuYW1lVW5pcXVlOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgRGVsZXRlQWNjb3VudERhdGEge1xuICBpc1N1Y2Nlc3M6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBSZXNldFBhc3N3b3JkRGF0YSB7XG4gIHVzZXJuYW1lOiBzdHJpbmcgfCBudWxsO1xuICBpc1N1Y2Nlc3M6IGJvb2xlYW47XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbiBmb3IgQVBJIGNhbGxzIHRvIHJlZHVjZSByZXBldGl0aW9uXG5hc3luYyBmdW5jdGlvbiBhcGlGZXRjaDxUPihlbmRwb2ludDogc3RyaW5nLCBvcHRpb25zPzogUmVxdWVzdEluaXQpOiBQcm9taXNlPEFwaVJlc3BvbnNlPFQ+PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9mbG93Y2hhdGJhY2tlbmQuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpLyR7ZW5kcG9pbnR9YCwgb3B0aW9ucyk7XG4gICAgY29uc3QgcmVzdWx0OiBBcGlSZXNwb25zZTxUPiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoYEFQSSBlcnJvciAoJHtlbmRwb2ludH0pOmAsIGVycm9yKTtcbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZTogXCJBbiBlcnJvciBvY2N1cnJlZCBkdXJpbmcgdGhlIHJlcXVlc3RcIixcbiAgICAgIGRhdGE6IHt9IGFzIFQsXG4gICAgfTtcbiAgfVxufVxuXG4vLyBMb2dpbiBzZXJ2ZXIgYWN0aW9uXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9naW4oZm9ybURhdGE6IEZvcm1EYXRhKSB7XG4gIGNvbnN0IHVzZXJuYW1lID0gZm9ybURhdGEuZ2V0KFwidXNlcm5hbWVcIikgYXMgc3RyaW5nIHwgbnVsbDtcbiAgY29uc3QgZW1haWwgPSBmb3JtRGF0YS5nZXQoXCJlbWFpbFwiKSBhcyBzdHJpbmcgfCBudWxsO1xuICBjb25zdCBwYXNzd29yZCA9IGZvcm1EYXRhLmdldChcInBhc3N3b3JkXCIpIGFzIHN0cmluZztcblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGFwaUZldGNoPExvZ2luRGF0YT4oXCIvQWNjb3VudC9sb2dpblwiLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB1c2VybmFtZSwgZW1haWwsIHBhc3N3b3JkIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gU3VjY2Vzc2Z1bCBsb2dpblxuICAgIGlmIChyZXN1bHQuZGF0YS5pc1Bhc3N3b3JkQ29ycmVjdCAmJiByZXN1bHQuZGF0YS5pc0FjY291bnRBY3RpdmUgJiYgcmVzdWx0LmRhdGEudXNlcikge1xuICAgICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlc3Npb24oKTtcblxuICAgICAgLy8gU2F2ZSB1c2VyIGRhdGEgaW4gc2Vzc2lvblxuICAgICAgc2Vzc2lvbi51c2VySWQgPSByZXN1bHQuZGF0YS51c2VyLmlkO1xuICAgICAgc2Vzc2lvbi51c2VybmFtZSA9IHJlc3VsdC5kYXRhLnVzZXIudXNlcm5hbWU7XG4gICAgICBzZXNzaW9uLnJvbGVzID0gcmVzdWx0LmRhdGEudXNlci5yb2xlcztcbiAgICAgIHNlc3Npb24uaXNMb2dnZWRJbiA9IHRydWU7XG4gICAgICBzZXNzaW9uLnRva2VuID0gcmVzdWx0LmRhdGEudXNlci50b2tlbjtcbiAgICAgIHNlc3Npb24uYXZhdGFyID0gcmVzdWx0LmRhdGEudXNlci5hdmF0YXI7XG4gICAgICBzZXNzaW9uLmVtYWlsID0gcmVzdWx0LmRhdGEudXNlci5lbWFpbDtcbiAgICAgIGF3YWl0IHNlc3Npb24uc2F2ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiB7XG4gICAgICBtZXNzYWdlOiBcIkxvZ2luIGZhaWxlZFwiLFxuICAgICAgZGF0YToge1xuICAgICAgICBpc1Bhc3N3b3JkQ29ycmVjdDogZmFsc2UsXG4gICAgICAgIGlzQWNjb3VudEFjdGl2ZTogZmFsc2UsXG4gICAgICAgIHVzZXI6IG51bGwsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cblxuLy8gTG9nb3V0IHNlcnZlciBhY3Rpb25cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dvdXQoKSB7XG4gIHRyeSB7XG4gICAgLy8gY2xlYXIgc2Vzc2lvblxuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXNzaW9uKCk7XG4gICAgc2Vzc2lvbi5kZXN0cm95KCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkxvZ291dCBlcnJvcjpcIiwgZXJyb3IpO1xuICAgIHJldHVybiB7IGVycm9yOiBcIkZhaWxlZCB0byBsb2cgb3V0XCIgfTtcbiAgfVxufVxuXG4vLyBSZWdpc3RyYXRpb24gc2VydmVyIGFjdGlvblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlZ2lzdGVyKGZvcm1EYXRhOiBGb3JtRGF0YSkge1xuICBjb25zdCB1c2VybmFtZSA9IGZvcm1EYXRhLmdldChcInVzZXJuYW1lXCIpIGFzIHN0cmluZztcbiAgY29uc3QgZW1haWwgPSBmb3JtRGF0YS5nZXQoXCJlbWFpbFwiKSBhcyBzdHJpbmc7XG4gIGNvbnN0IHBhc3N3b3JkID0gZm9ybURhdGEuZ2V0KFwicGFzc3dvcmRcIikgYXMgc3RyaW5nO1xuICBjb25zdCBsaWNlbnNlS2V5ID0gZm9ybURhdGEuZ2V0KFwibGljZW5zZUtleVwiKSBhcyBzdHJpbmc7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBhcGlGZXRjaDxSZWdpc3RlckRhdGE+KFwiQWNjb3VudC9yZWdpc3RlckFjY291bnRcIiwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdXNlcm5hbWUsIGVtYWlsLCBwYXNzd29yZCwgbGljZW5zZUtleSB9KSxcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiB7XG4gICAgICBtZXNzYWdlOiBcIkFuIGVycm9yIG9jY3VycmVkIGR1cmluZyByZWdpc3RyYXRpb25cIixcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdXNlcjogbnVsbCxcbiAgICAgICAgaXNTdWNjZXNzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG4vLyBSZXF1ZXN0IGxpY2Vuc2Uga2V5IHNlcnZlciBhY3Rpb25cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXF1ZXN0TGljZW5zZUtleShlbWFpbDogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgYXBpRmV0Y2g8UmVxdWVzdERhdGE+KFwiQWNjb3VudC9yZXF1ZXN0TGljZW5zZUtleVwiLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBlbWFpbCB9KSxcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiB7XG4gICAgICBtZXNzYWdlOiBcIkZhaWxlZCB0byByZXF1ZXN0IGxpY2Vuc2Uga2V5XCIsXG4gICAgICBkYXRhOiB7IGlzU3VjY2VzczogZmFsc2UgfSxcbiAgICB9O1xuICB9XG59XG5cbi8vIFJlcXVlc3QgYXV0aGVudGljYXRpb24gY29kZSBzZXJ2ZXIgYWN0aW9uXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWVzdEF1dGhDb2RlKGVtYWlsOiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBhcGlGZXRjaDxSZXF1ZXN0RGF0YT4oXCJBY2NvdW50L3JlcXVlc3RBdXRoZW50aWNhdGlvbkNvZGVcIiwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgZW1haWwgfSksXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZTogXCJGYWlsZWQgdG8gcmVxdWVzdCBhdXRoZW50aWNhdGlvbiBjb2RlXCIsXG4gICAgICBkYXRhOiB7IGlzU3VjY2VzczogZmFsc2UgfSxcbiAgICB9O1xuICB9XG59XG5cbi8vIENoZWNrIGlmIGVtYWlsIGlzIHVuaXF1ZSBzZXJ2ZXIgYWN0aW9uXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2hlY2tFbWFpbFVuaXF1ZShlbWFpbDogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGFwaUZldGNoPEVtYWlsQ2hlY2tEYXRhPihgQWNjb3VudC9pc0VtYWlsVW5pcXVlP2VtYWlsPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGVtYWlsKX1gKTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIGNoZWNrIGVtYWlsIHVuaXF1ZW5lc3NcIixcbiAgICAgIGRhdGE6IHsgaXNFbWFpbFVuaXF1ZTogZmFsc2UgfSxcbiAgICB9O1xuICB9XG59XG5cbi8vIENoZWNrIGlmIHVzZXJuYW1lIGlzIHVuaXF1ZSBzZXJ2ZXIgYWN0aW9uXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2hlY2tVc2VybmFtZVVuaXF1ZSh1c2VybmFtZTogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGFwaUZldGNoPFVzZXJuYW1lQ2hlY2tEYXRhPihgQWNjb3VudC9pc1VzZXJuYW1lVW5pcXVlP3VzZXJuYW1lPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHVzZXJuYW1lKX1gKTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIGNoZWNrIHVzZXJuYW1lIHVuaXF1ZW5lc3NcIixcbiAgICAgIGRhdGE6IHsgaXNVc2VybmFtZVVuaXF1ZTogZmFsc2UgfSxcbiAgICB9O1xuICB9XG59XG5cbi8vIERlbGV0ZSBhY2NvdW50IHNlcnZlciBhY3Rpb25cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVBY2NvdW50KGZvcm1EYXRhOiBGb3JtRGF0YSkge1xuICBjb25zdCB1c2VybmFtZSA9IGZvcm1EYXRhLmdldChcInVzZXJuYW1lXCIpIGFzIHN0cmluZyB8IG51bGw7XG4gIGNvbnN0IGVtYWlsID0gZm9ybURhdGEuZ2V0KFwiZW1haWxcIikgYXMgc3RyaW5nIHwgbnVsbDtcbiAgY29uc3QgcGFzc3dvcmQgPSBmb3JtRGF0YS5nZXQoXCJwYXNzd29yZFwiKSBhcyBzdHJpbmc7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2Vzc2lvbigpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGFwaUZldGNoPERlbGV0ZUFjY291bnREYXRhPihcIkFjY291bnQvZGVsZXRlQWNjb3VudFwiLCB7XG4gICAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi50b2tlbn1gXG4gICAgICB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBlbWFpbCwgdXNlcm5hbWUsIHBhc3N3b3JkIH0pLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIGRlbGV0ZSBhY2NvdW50XCIsXG4gICAgICBkYXRhOiB7IGlzU3VjY2VzczogZmFsc2UgfSxcbiAgICB9O1xuICB9XG59XG5cbi8vIFJlc2V0IHBhc3N3b3JkIGJ5IGVtYWlsIHNlcnZlciBhY3Rpb25cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXNldFBhc3N3b3JkQnlFbWFpbChmb3JtRGF0YTogRm9ybURhdGEpIHtcbiAgY29uc3QgZW1haWwgPSBmb3JtRGF0YS5nZXQoXCJlbWFpbFwiKSBhcyBzdHJpbmc7XG4gIGNvbnN0IHBhc3N3b3JkID0gZm9ybURhdGEuZ2V0KFwicGFzc3dvcmRcIikgYXMgc3RyaW5nO1xuICBjb25zdCBhdXRoZW50aWNhdGlvbkNvZGUgPSBmb3JtRGF0YS5nZXQoXCJhdXRoZW50aWNhdGlvbkNvZGVcIikgYXMgc3RyaW5nO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgYXBpRmV0Y2g8UmVzZXRQYXNzd29yZERhdGE+KFwiQWNjb3VudC9yZXNldFBhc3N3b3JkQnlFbWFpbFwiLCB7XG4gICAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGVtYWlsLCBwYXNzd29yZCwgYXV0aGVudGljYXRpb25Db2RlIH0pLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIHJlc2V0IHBhc3N3b3JkXCIsXG4gICAgICBkYXRhOiB7IHVzZXJuYW1lOiBudWxsLCBpc1N1Y2Nlc3M6IGZhbHNlIH0sXG4gICAgfTtcbiAgfVxufVxuXG4vLyBSZXNldCBwYXNzd29yZCBieSBvbGQgcGFzc3dvcmQgc2VydmVyIGFjdGlvblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc2V0UGFzc3dvcmRCeU9sZFBhc3N3b3JkKGZvcm1EYXRhOiBGb3JtRGF0YSkge1xuICBjb25zdCBlbWFpbCA9IGZvcm1EYXRhLmdldChcImVtYWlsXCIpIGFzIHN0cmluZztcbiAgY29uc3Qgb2xkUGFzc3dvcmQgPSBmb3JtRGF0YS5nZXQoXCJvbGRQYXNzd29yZFwiKSBhcyBzdHJpbmc7XG4gIGNvbnN0IG5ld1Bhc3N3b3JkID0gZm9ybURhdGEuZ2V0KFwibmV3UGFzc3dvcmRcIikgYXMgc3RyaW5nO1xuXG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlc3Npb24oKTtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBhcGlGZXRjaDxSZXNldFBhc3N3b3JkRGF0YT4oXCJBY2NvdW50L3Jlc2V0UGFzc3dvcmRCeU9sZFBhc3N3b3JkXCIsIHtcbiAgICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnRva2VufWBcbiAgICAgIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGVtYWlsLCBvbGRQYXNzd29yZCwgbmV3UGFzc3dvcmQgfSksXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZTogXCJGYWlsZWQgdG8gcmVzZXQgcGFzc3dvcmRcIixcbiAgICAgIGRhdGE6IHsgdXNlcm5hbWU6IG51bGwsIGlzU3VjY2VzczogZmFsc2UgfSxcbiAgICB9O1xuICB9XG59XG5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoia1NBZ05zQiJ9
}}),
"[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ConfirmDialog)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSession$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSession.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$data$3a$f8f7bf__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/utils/data:f8f7bf [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$data$3a$d02c80__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/utils/data:d02c80 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@fortawesome/free-solid-svg-icons/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@fortawesome/react-fontawesome/index.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
function ConfirmDialog({ setConfirmDialogOpen }) {
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [UsernameOrEmail, setUserInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isAccountDeleted, setAccountDeleted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isPasswordCorrect, setPasswordCorrect] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isSubmitDisabled, setIsSubmitDisabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const { session, refresh } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSession$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSession"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const wait = (s)=>{
        return new Promise((resolve)=>setTimeout(resolve, s * 1000));
    };
    const clearForm = ()=>{
        setUserInput("");
        setPassword("");
    };
    const handleLogin = async (e)=>{
        setLoading(true);
        e.preventDefault();
        const formData = new FormData();
        if (UsernameOrEmail.includes("@")) {
            formData.append("email", UsernameOrEmail);
        } else {
            formData.append("username", UsernameOrEmail);
        }
        formData.append("password", password);
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$data$3a$f8f7bf__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["deleteAccount"])(formData);
            setLoading(false);
            if (result.data.isSuccess) {
                setPasswordCorrect(true);
                setAccountDeleted(true);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$data$3a$d02c80__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["logout"])();
                await wait(5);
                router.replace("/login");
                await refresh();
            } else {
                setPasswordCorrect(false);
                setPassword("");
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        } catch  {}
    };
    const handleInputChange = (e)=>{
        setUserInput(e.target.value);
        if ((e.target.value === session.username || e.target.value === session.email) && password) {
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    };
    const handlePasswordChange = (e)=>{
        setPassword(e.target.value);
        if (e.target.value && (UsernameOrEmail === session.username || UsernameOrEmail === session.email)) {
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-gray-500/20 flex justify-center items-center z-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0",
                onClick: ()=>{
                    setConfirmDialogOpen(false);
                    clearForm();
                }
            }, void 0, false, {
                fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: `card w-fit min-w-sm lg:min-w-lg max-w-xl bg-base-100 shadow-xl`,
                onSubmit: handleLogin,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `card-body gap-4"`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "card-title text-center text-bg",
                            children: isAccountDeleted ? 'Your Account has been deleted' : 'Delete Your Account'
                        }, void 0, false, {
                            fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                            lineNumber: 95,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            role: "alert",
                            className: `alert alert-error alert-soft`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faTriangleExclamation"],
                                    className: "text-2xl"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                                    lineNumber: 98,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "label-text text-base-content text-red-500 font-bold",
                                    children: " You CANNOT undo this operation. "
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                                    lineNumber: 99,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                            lineNumber: 97,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "card-body p-0 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-base-content",
                                    children: "We will immediately delete your account, meaning that you cannot use FlowChat services with this account afterward."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                                    lineNumber: 103,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-base-content",
                                    children: "However, all your posts, comments, chat records and user profile will still be anonymously visible to other users."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                                    lineNumber: 106,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: `text-base-content ${isAccountDeleted ? 'hidden' : ''}`,
                                    children: "Please input your login information to confirm to delete your account."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                                    lineNumber: 109,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                            lineNumber: 102,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "divider my-0"
                        }, void 0, false, {
                            fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `form-control ${isAccountDeleted ? 'hidden' : ''}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "label",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "label-text text-base-content",
                                        children: "Username / Email"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                                        lineNumber: 118,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                                    lineNumber: 117,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "input",
                                    placeholder: "Username or email",
                                    value: UsernameOrEmail,
                                    onChange: handleInputChange,
                                    className: "input input-bordered w-full my-1"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                                    lineNumber: 120,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                            lineNumber: 116,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `form-control ${isAccountDeleted ? 'hidden' : ''}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "label",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `label-text text-base-content ${isPasswordCorrect ? '' : 'text-red-500 font-bold'}`,
                                        children: "Password"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                                        lineNumber: 131,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                                    lineNumber: 130,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    placeholder: "Password",
                                    value: password,
                                    onChange: handlePasswordChange,
                                    className: "input input-bordered w-full my-1"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                                    lineNumber: 134,
                                    columnNumber: 13
                                }, this),
                                isPasswordCorrect ? '' : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "label",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "label-text text-base-content text-sm text-red-500 font-bold",
                                        children: "** Password is incorrect"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                                    lineNumber: 143,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                            lineNumber: 129,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `form-control ${isAccountDeleted ? 'hidden' : ''}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "btn btn-error w-full",
                                disabled: isSubmitDisabled,
                                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "loading loading-dots loading-md bg-base-content"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                                    lineNumber: 156,
                                    columnNumber: 26
                                }, this) : "Delete Account"
                            }, void 0, false, {
                                fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                                lineNumber: 151,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `form-control mt-2 ${isAccountDeleted ? 'hidden' : ''}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "btn btn-secondary w-full bg-base-300 text-base-content border-none",
                                onClick: ()=>{
                                    setConfirmDialogOpen(false);
                                    clearForm();
                                },
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                                lineNumber: 161,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                            lineNumber: 160,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx",
        lineNumber: 82,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/components/settings/DeleteAccountSection.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>DeleteAccount)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$settings$2f$ConfirmDeleteAccountDialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/settings/ConfirmDeleteAccountDialog.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function DeleteAccount() {
    const [isConfirmDialogOpen, setConfirmDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card-body p-0 gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-4 items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card-body p-0 gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xl text-red-500 font-bold",
                                children: "Delete Account"
                            }, void 0, false, {
                                fileName: "[project]/src/components/settings/DeleteAccountSection.tsx",
                                lineNumber: 14,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-base-content/70",
                                children: "Once you delete your account, you cannot retrieve it. Please be certain."
                            }, void 0, false, {
                                fileName: "[project]/src/components/settings/DeleteAccountSection.tsx",
                                lineNumber: 15,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/settings/DeleteAccountSection.tsx",
                        lineNumber: 13,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-error",
                                onClick: ()=>{
                                    setConfirmDialogOpen(true);
                                },
                                children: "Delete Account"
                            }, void 0, false, {
                                fileName: "[project]/src/components/settings/DeleteAccountSection.tsx",
                                lineNumber: 18,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: isConfirmDialogOpen ? "" : "hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$settings$2f$ConfirmDeleteAccountDialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    setConfirmDialogOpen: setConfirmDialogOpen
                                }, void 0, false, {
                                    fileName: "[project]/src/components/settings/DeleteAccountSection.tsx",
                                    lineNumber: 26,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/settings/DeleteAccountSection.tsx",
                                lineNumber: 25,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/settings/DeleteAccountSection.tsx",
                        lineNumber: 17,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/settings/DeleteAccountSection.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "divider my-0"
            }, void 0, false, {
                fileName: "[project]/src/components/settings/DeleteAccountSection.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/settings/DeleteAccountSection.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=src_9557d7fe._.js.map