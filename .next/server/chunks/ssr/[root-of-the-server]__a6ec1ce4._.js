module.exports = {

"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/tty [external] (tty, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}}),
"[externals]/util [external] (util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/os [external] (os, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}}),
"[externals]/events [external] (events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[externals]/buffer [external] (buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/net [external] (net, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}}),
"[externals]/tls [external] (tls, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[project]/src/utils/messaging.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ConnectionStatus": (()=>ConnectionStatus),
    "MessagingService": (()=>MessagingService),
    "getContactsList": (()=>getContactsList),
    "getMessageHistory": (()=>getMessageHistory),
    "messagingService": (()=>messagingService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sockjs$2d$client$2f$lib$2f$entry$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sockjs-client/lib/entry.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stomp$2f$stompjs$2f$esm6$2f$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@stomp/stompjs/esm6/client.js [app-ssr] (ecmascript)");
"use client";
;
;
var ConnectionStatus = /*#__PURE__*/ function(ConnectionStatus) {
    ConnectionStatus["DISCONNECTED"] = "disconnected";
    ConnectionStatus["CONNECTING"] = "connecting";
    ConnectionStatus["CONNECTED"] = "connected";
    ConnectionStatus["ERROR"] = "error";
    return ConnectionStatus;
}({});
class MessagingService {
    client = null;
    subscriptions = new Map();
    status = "disconnected";
    statusListeners = [];
    // Get current connection status
    getStatus() {
        return this.status;
    }
    // Add status change listener
    onStatusChange(listener) {
        this.statusListeners.push(listener);
        // Return unsubscribe function
        return ()=>{
            this.statusListeners = this.statusListeners.filter((l)=>l !== listener);
        };
    }
    // Update connection status
    updateStatus(newStatus) {
        this.status = newStatus;
        this.statusListeners.forEach((listener)=>listener(newStatus));
    }
    // Connect to WebSocket server
    connect(token) {
        return new Promise((resolve, reject)=>{
            if (this.client) {
                this.disconnect();
            }
            this.updateStatus("connecting");
            try {
                const socket = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sockjs$2d$client$2f$lib$2f$entry$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]("https://flowchatbackend.azurewebsites.net/chat", null, {
                    // Specify preferred transports to avoid unnecessary fallback attempts
                    transports: [
                        "xhr-streaming",
                        "websocket",
                        "xhr-polling"
                    ]
                });
                this.client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stomp$2f$stompjs$2f$esm6$2f$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Client"]({
                    webSocketFactory: ()=>socket,
                    connectHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
                this.client.onConnect = ()=>{
                    this.updateStatus("connected");
                    resolve();
                };
                this.client.activate();
                // Add timeout to avoid hanging connections
                setTimeout(()=>{
                    if (this.status === "connecting") {
                        this.updateStatus("error");
                        reject(new Error("Connection timed out"));
                    }
                }, 1000);
            } catch (error) {
                console.error("Failed to connect:", error);
            }
        });
    }
    // Disconnect from WebSocket server
    disconnect() {
        if (this.client && this.client.connected) {
            // Unsubscribe from all topics
            this.subscriptions.forEach((sub)=>{
                if (this.client) {
                    this.client.unsubscribe(sub.id);
                }
            });
            this.subscriptions.clear();
            this.client.deactivate();
            this.client = null;
            this.updateStatus("disconnected");
        }
    }
    // Subscribe to user channel
    subscribe(channel, callback) {
        if (!this.client || !this.client.connected) {
            throw new Error("Not connected to WebSocket server");
        }
        // Unsubscribe if already subscribed
        this.unsubscribe(channel);
        // Subscribe to the channel
        const subscription = this.client.subscribe(`/channel/${channel}`, (message)=>{
            try {
                const parsedMessage = JSON.parse(message.body);
                callback(parsedMessage);
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        });
        // Store subscription
        this.subscriptions.set(channel, {
            id: subscription.id,
            callback
        });
    }
    // Unsubscribe from a topic
    unsubscribe(topic) {
        const subscription = this.subscriptions.get(topic);
        if (subscription && this.client) {
            this.client.unsubscribe(subscription.id);
            this.subscriptions.delete(topic);
        }
    }
    // Send a message
    sendMessage(channel, message) {
        if (!this.client || !this.client.connected) {
            throw new Error("Not connected to WebSocket server");
        }
        this.client.publish({
            destination: `/app/send/${channel}`,
            body: JSON.stringify(message)
        });
    }
}
async function getContactsList(count) {
    try {
        let apiUrl = `/api/Chat/getContactList?contactNum=${count}`;
        apiUrl += `&excludingUserIdList=0`;
        // Fetch data from the API
        const response = await fetch(apiUrl, {
            method: "GET"
        });
        if (!response.ok) {
            console.error(`API error: ${response.status} ${response.statusText}`);
            return [];
        }
        const data = await response.json();
        // Safer property access with detailed logging
        if (!data) {
            console.error("Empty response from API");
            return [];
        }
        if (!data.data) {
            console.error("Response missing data property:", data);
            return [];
        }
        return data.data.contactList;
    } catch (error) {
        console.error("Error fetching contact list:", error);
        return [];
    }
}
async function getMessageHistory(contactUserId, count, excludingMessageIdList) {
    try {
        let apiUrl = `/api/Chat/getMessageHistoryList?contactUserId=${contactUserId}&messageNum=${count || 15}`;
        // Filter out fetched messages
        if (excludingMessageIdList) {
            while(excludingMessageIdList.length > 0){
                //add all excludingMessageId to the URL
                apiUrl += `&excludingMessageIdList=${excludingMessageIdList.shift()}`;
            }
        } else {
            //default value = 0
            apiUrl += `&excludingMessageIdList=0`;
        }
        // Fetch data from the API
        const response = await fetch(apiUrl, {
            method: "GET"
        });
        if (!response.ok) {
            console.error(`API error: ${response.status} ${response.statusText}`);
            return [];
        }
        const data = await response.json();
        // Safer property access with detailed logging
        if (!data) {
            console.error("Empty response from API");
            return [];
        }
        if (!data.data) {
            console.error("Response missing data property:", data);
            return [];
        }
        return data.data.messageHistoryList;
    } catch (error) {
        console.error("Error fetching message history:", error);
        return [];
    }
}
const messagingService = new MessagingService();
}}),
"[project]/src/components/chats/ChatMessage.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ChatMessage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$images$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/images.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@fortawesome/free-solid-svg-icons/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$regular$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@fortawesome/free-regular-svg-icons/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@fortawesome/react-fontawesome/index.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
function ChatMessage({ myUserId, message, isSelected = false, onMessageClick, handleDeleteOption, handleSelectOption, isInSelectionMode, handleReplyOption, handleScrollToMessage, replyTo, contactUsername }) {
    const [isHovering, setIsHovering] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const hasImages = message.imageAPIList && message.imageAPIList.length > 0;
    const isOwner = message.userIdFrom === myUserId;
    const handleClick = ()=>{
        // Only allow selection of user's own messages
        if (isOwner && onMessageClick && isInSelectionMode && message.messageId !== -1 && message.isActive) {
            // Toggle selection state
            onMessageClick(message.messageId);
        }
    };
    const handleReplyPreviewClick = (e)=>{
        e.stopPropagation();
        if (message.attachTo) {
            handleScrollToMessage(message.attachTo);
        }
    };
    const handleReplyAction = (e)=>{
        e.stopPropagation();
        if (message.isActive && message.messageId !== -1) {
            handleReplyOption(message.messageId);
        }
    };
    const handleSelectAction = (e)=>{
        e.stopPropagation();
        if (isOwner && message.isActive && message.messageId !== -1) {
            handleSelectOption(message.messageId);
        }
    };
    const handleDeleteAction = (e)=>{
        e.stopPropagation();
        if (isOwner && message.isActive && message.messageId !== -1) {
            handleDeleteOption(message.messageId);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        id: message.messageId.toString(),
        className: `chat ${isOwner ? "chat-end" : "chat-start"} ${isSelected ? "bg-primary/20" : ""}`,
        onClick: handleClick,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `chat-bubble relative ${isOwner ? "bg-primary text-primary-content" : "bg-neutral text-neutral-content"} font-medium text-sm break-words max-w-[85%] lg:max-w-[60%] ${isOwner ? "flex-row" : "flex-row-reverse"}`,
                onMouseEnter: ()=>setIsHovering(true),
                onMouseLeave: ()=>setIsHovering(false),
                children: [
                    message.isActive && message.messageId !== -1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `
           absolute top-1/2 transform -translate-y-1/2
           ${isOwner ? "right-full mr-2" : "left-full ml-2"}
           z-10 flex items-center
           transition-opacity duration-150
           ${isHovering || isInSelectionMode ? "opacity-100" : "opacity-0"}
          `,
                        children: isInSelectionMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "checkbox",
                            className: "checkbox",
                            checked: isSelected,
                            readOnly: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/chats/ChatMessage.tsx",
                            lineNumber: 99,
                            columnNumber: 15
                        }, this) : /* Show Dropdown Trigger when NOT in selection mode */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `dropdown ${isOwner ? "dropdown-start" : "dropdown-end"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    tabIndex: 0,
                                    role: "button",
                                    className: "btn btn-circle btn-xs bg-base-100",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faAngleDown"]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chats/ChatMessage.tsx",
                                        lineNumber: 104,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chats/ChatMessage.tsx",
                                    lineNumber: 103,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    tabIndex: 0,
                                    className: "dropdown-content menu rounded-box w-26 shadow text-base-content bg-base-100",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                onClick: handleReplyAction,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faReply"]
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/chats/ChatMessage.tsx",
                                                        lineNumber: 112,
                                                        columnNumber: 23
                                                    }, this),
                                                    "Reply"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/chats/ChatMessage.tsx",
                                                lineNumber: 111,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chats/ChatMessage.tsx",
                                            lineNumber: 110,
                                            columnNumber: 19
                                        }, this),
                                        isOwner && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        onClick: handleSelectAction,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$regular$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faCheckSquare"]
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chats/ChatMessage.tsx",
                                                                lineNumber: 120,
                                                                columnNumber: 27
                                                            }, this),
                                                            "Select"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/chats/ChatMessage.tsx",
                                                        lineNumber: 119,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chats/ChatMessage.tsx",
                                                    lineNumber: 118,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        onClick: handleDeleteAction,
                                                        className: "text-error/80",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$regular$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faTrashAlt"]
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chats/ChatMessage.tsx",
                                                                lineNumber: 127,
                                                                columnNumber: 27
                                                            }, this),
                                                            "Delete"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/chats/ChatMessage.tsx",
                                                        lineNumber: 126,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chats/ChatMessage.tsx",
                                                    lineNumber: 125,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chats/ChatMessage.tsx",
                                    lineNumber: 106,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/chats/ChatMessage.tsx",
                            lineNumber: 102,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/chats/ChatMessage.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this),
                    message.isActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-1",
                        children: [
                            replyTo && message.attachTo !== 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `bg-base-100/50 p-2 rounded-md cursor-pointer border-l-4 text-base-content border-secondary " 
                `,
                                onClick: handleReplyPreviewClick,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-semibold text-xs opacity-90",
                                        children: replyTo.userIdFrom === myUserId ? "You" : contactUsername
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chats/ChatMessage.tsx",
                                        lineNumber: 147,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs opacity-80 truncate",
                                        children: replyTo.content ? replyTo.content : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "italic opacity-80",
                                            children: "Image"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chats/ChatMessage.tsx",
                                            lineNumber: 151,
                                            columnNumber: 56
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chats/ChatMessage.tsx",
                                        lineNumber: 150,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/chats/ChatMessage.tsx",
                                lineNumber: 142,
                                columnNumber: 15
                            }, this),
                            hasImages && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `grid gap-1 ${message.imageAPIList.length > 1 ? "grid-cols-2" : "grid-cols-1"}`,
                                children: message.imageAPIList.map((imageUrl, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: imageUrl.startsWith("blob:") ? imageUrl : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$images$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProxyImageUrl"])(imageUrl),
                                        alt: `Message image ${index + 1}`,
                                        className: "w-full h-full object-cover",
                                        loading: "lazy"
                                    }, index, false, {
                                        fileName: "[project]/src/components/chats/ChatMessage.tsx",
                                        lineNumber: 159,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/chats/ChatMessage.tsx",
                                lineNumber: 157,
                                columnNumber: 15
                            }, this),
                            message.content
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/chats/ChatMessage.tsx",
                        lineNumber: 139,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "opacity-50 italic font-bold",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faBan"],
                                className: "mr-2"
                            }, void 0, false, {
                                fileName: "[project]/src/components/chats/ChatMessage.tsx",
                                lineNumber: 173,
                                columnNumber: 13
                            }, this),
                            "Message has been deleted"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/chats/ChatMessage.tsx",
                        lineNumber: 172,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/chats/ChatMessage.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-footer opacity-50",
                children: [
                    isOwner && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "font-bold",
                        children: message.readAt ? "Seen" : message.messageId === -1 ? "Sending" : "Sent"
                    }, void 0, false, {
                        fileName: "[project]/src/components/chats/ChatMessage.tsx",
                        lineNumber: 180,
                        columnNumber: 11
                    }, this),
                    new Date(message.sentAt).toLocaleString(undefined, {
                        year: "2-digit",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/chats/ChatMessage.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/chats/ChatMessage.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/components/chats/LoadingContact.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>LoadingContact)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function LoadingContact() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        className: "flex items-center gap-3 p-4 border-b border-base-200",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "skeleton w-10 h-10 rounded-full bg-base-300"
            }, void 0, false, {
                fileName: "[project]/src/components/chats/LoadingContact.tsx",
                lineNumber: 4,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2 flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "skeleton h-4 w-24 bg-base-300"
                    }, void 0, false, {
                        fileName: "[project]/src/components/chats/LoadingContact.tsx",
                        lineNumber: 6,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "skeleton h-3 w-32 bg-base-300"
                    }, void 0, false, {
                        fileName: "[project]/src/components/chats/LoadingContact.tsx",
                        lineNumber: 7,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/chats/LoadingContact.tsx",
                lineNumber: 5,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/chats/LoadingContact.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/components/chats/Messenger.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Messenger)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@fortawesome/free-solid-svg-icons/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$regular$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@fortawesome/free-regular-svg-icons/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@fortawesome/react-fontawesome/index.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSession$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSession.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/messaging.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$chats$2f$ChatMessage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/chats/ChatMessage.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$chats$2f$LoadingContact$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/chats/LoadingContact.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$users$2f$UserAvatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/users/UserAvatar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$images$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/images.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
function Messenger() {
    const { session } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSession$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSession"])();
    const [contacts, setContacts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedContact, setSelectedContact] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])();
    const [conversation, setConversation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [messageText, setMessageText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [connectionStatus, setConnectionStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["messagingService"].getStatus());
    const [inSelection, setInSelection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedMessages, setSelectedMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [searchInput, setSearchInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedFiles, setSelectedFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filePreviews, setFilePreviews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const conversationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isLoadingMoreMessages, setIsLoadingMoreMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasMoreMessages, setHasMoreMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const messageLoaderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [excludedMessageIds, setExcludedMessageIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const connectRetryTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [replyTo, setReplyTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [scrollingToMessageId, setScrollingToMessageId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showConversation, setShowConversation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showScrollToBottom, setShowScrollToBottom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleImageSelect = (e)=>{
        const newFiles = Array.from(e.target.files || []);
        if (newFiles.length === 0) return; // Do nothing if no files selected
        // Append new files to the existing selection
        setSelectedFiles((prevFiles)=>[
                ...prevFiles,
                ...newFiles
            ]);
        // Create object URLs only for the newly added files and append them
        const newPreviews = newFiles.map((f)=>URL.createObjectURL(f));
        setFilePreviews((prevPreviews)=>[
                ...prevPreviews,
                ...newPreviews
            ]);
        // Clear the file input value to allow selecting the same file again if needed
        if (e.target) {
            e.target.value = "";
        }
    };
    const removeImagePreview = (indexToRemove)=>{
        setSelectedFiles((prevFiles)=>prevFiles.filter((_, index)=>index !== indexToRemove));
        setFilePreviews((prevPreviews)=>{
            const newPreviews = prevPreviews.filter((_, index)=>index !== indexToRemove);
            // Revoke the object URL for the removed preview to free memory
            URL.revokeObjectURL(prevPreviews[indexToRemove]);
            return newPreviews;
        });
    };
    // Cleanup object URLs on component unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            filePreviews.forEach((url)=>URL.revokeObjectURL(url));
        };
    }, [
        filePreviews
    ]);
    // Keep a ref of the selected contact such that it can be used in the message subscription callback
    const selectedContactRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        selectedContactRef.current = selectedContact;
    }, [
        selectedContact
    ]);
    const handleContactSelect = async (contact)=>{
        setSelectedContact(contact);
        setShowConversation(true); // Show conversation on mobile
        setConversation([]); // Clear previous conversation
        setIsLoadingMoreMessages(true); // Show loading indicator
        setHasMoreMessages(true); // Reset hasMore flag
        try {
            const messageHistory = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMessageHistory"])(contact.contactUserId, 15);
            setConversation(messageHistory);
            // Add fetched message IDs to excludedMessageIds
            const newExcludedIds = new Set();
            messageHistory.forEach((message)=>newExcludedIds.add(Number(message.messageId)));
            setExcludedMessageIds(newExcludedIds);
        } catch (error) {
            console.error("Error fetching message history:", error);
            setHasMoreMessages(false); // Assume no more messages on error
        } finally{
            setIsLoadingMoreMessages(false);
        }
    };
    // Function to load older messages
    const loadMoreMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (isLoadingMoreMessages || !hasMoreMessages || !selectedContact || conversation.length === 0) return;
        setIsLoadingMoreMessages(true);
        try {
            // Fetch older messages
            const olderMessages = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMessageHistory"])(selectedContact.contactUserId, 15, Array.from(excludedMessageIds));
            // Update excludedMessageIds with new messages
            setExcludedMessageIds((prevExcludedIds)=>{
                const newExcludedIds = new Set(prevExcludedIds);
                olderMessages.forEach((message)=>newExcludedIds.add(Number(message.messageId)));
                return newExcludedIds;
            });
            if (olderMessages.length > 0) {
                setConversation((prev)=>[
                        ...prev,
                        ...olderMessages
                    ]); // Append older messages
            } else {
                setHasMoreMessages(false); // No more messages to load
            }
        } catch (error) {
            console.error("Failed to load more messages:", error);
            setHasMoreMessages(false); // Stop trying on error
        } finally{
            setIsLoadingMoreMessages(false);
        }
    }, [
        isLoadingMoreMessages,
        hasMoreMessages,
        selectedContact,
        conversation
    ]);
    // Infinite scrolling setup for messages
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const observer = new IntersectionObserver((entries)=>{
            if (entries[0].isIntersecting && hasMoreMessages && !isLoadingMoreMessages) {
                loadMoreMessages();
            }
        }, {
            root: conversationRef.current,
            threshold: 0.1
        });
        const currentLoaderRef = messageLoaderRef.current;
        if (currentLoaderRef) {
            observer.observe(currentLoaderRef);
        }
        return ()=>{
            if (currentLoaderRef) {
                observer.unobserve(currentLoaderRef);
            }
        };
    }, [
        hasMoreMessages,
        isLoadingMoreMessages,
        loadMoreMessages
    ]);
    // Connect to the messaging service with retry logic
    const connectWithRetry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (attempt = 1)=>{
        // Clear any existing retry timeout
        if (connectRetryTimeoutRef.current) {
            clearTimeout(connectRetryTimeoutRef.current);
            connectRetryTimeoutRef.current = null;
        }
        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["messagingService"].getStatus() === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConnectionStatus"].CONNECTED) {
            console.log("Already connected.");
            return;
        }
        if (attempt > 20) {
            // Limit retries
            console.error("WebSocket connection failed after multiple attempts.");
            setConnectionStatus(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConnectionStatus"].ERROR); // Set error state explicitly
            return;
        }
        setConnectionStatus(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConnectionStatus"].CONNECTING); // Ensure status is connecting
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["messagingService"].connect(session.token);
        } catch (error) {
            connectRetryTimeoutRef.current = setTimeout(()=>connectWithRetry(attempt + 1), 500);
        }
    }, [
        session.token
    ]);
    const fetchContacts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        // Don't fetch if not connected or already loading
        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["messagingService"].getStatus() !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConnectionStatus"].CONNECTED) {
            console.log("Skipping fetchContacts:", {
                status: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["messagingService"].getStatus()
            });
            return;
        }
        try {
            const fetchedContacts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getContactsList"])(20);
            setContacts(fetchedContacts.filter((contact)=>!contact.isContactUserBlocked));
        } catch (error) {
            console.error("Error fetching contacts:", error);
            setContacts([]); // Clear contacts on error
        }
    }, [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConnectionStatus"]
    ]);
    // Connect to websocket
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!session.isLoggedIn || !session.token || !session.userId) {
            // If session is lost, disconnect and clear state
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["messagingService"].disconnect();
            setContacts([]);
            setSelectedContact(undefined);
            setConversation([]);
            return;
        }
        // Subscribe to status changes
        const unsubscribeStatus = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["messagingService"].onStatusChange(setConnectionStatus);
        // Attempt initial connection if disconnected
        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["messagingService"].getStatus() === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConnectionStatus"].DISCONNECTED) {
            connectWithRetry();
        }
        // Cleanup function
        return ()=>{
            unsubscribeStatus();
            // Clear any pending retry timeout on component unmount or session change
            if (connectRetryTimeoutRef.current) {
                clearTimeout(connectRetryTimeoutRef.current);
            }
        };
    }, [
        session.isLoggedIn,
        session.token,
        session.userId,
        connectWithRetry
    ]);
    // Subscribe to user channel and fetch contacts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (connectionStatus === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConnectionStatus"].CONNECTED && session.userId) {
            // Subscribe to user channel
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["messagingService"].subscribe(`${session.userId}`, (message)=>{
                const messageDetail = message.messageDetail;
                const currentContact = selectedContactRef.current;
                console.log("Received message:", message);
                // Update contacts list
                fetchContacts();
                if (currentContact) {
                    switch(message.action){
                        case "send":
                            // Message from self (replace temp)
                            if (messageDetail.userIdFrom === session.userId) {
                                setConversation((prev)=>prev.map((m)=>m.messageId === -1 && m.content === messageDetail.content // More specific check
                                         ? messageDetail : m));
                            } else if (messageDetail.userIdFrom === currentContact.contactUserId) {
                                setConversation((prev)=>[
                                        messageDetail,
                                        ...prev
                                    ]); // Prepend for flex-reverse
                                readMessages([
                                    messageDetail
                                ]); // Mark as read
                            } else {
                                console.log("Message from another contact, fetching updated contacts list...");
                                fetchContacts(); // Fetch contacts if message is from someone else
                            }
                            break;
                        case "read":
                            setConversation((prev)=>prev.map((m)=>message.readOrDeleteMessageIdList?.includes(m.messageId) ? {
                                        ...m,
                                        readAt: message.time
                                    } : m));
                            break;
                        case "delete":
                            setConversation((prev)=>prev.map((m)=>message.readOrDeleteMessageIdList?.includes(m.messageId) ? {
                                        ...m,
                                        isActive: false
                                    } : m));
                            break;
                    }
                } else {
                    // Message received, but no contact selected. Update contacts list.
                    fetchContacts();
                }
            });
            // Fetch initial contacts after successful connection and subscription setup
            fetchContacts();
            // Cleanup for this effect: Unsubscribe when status is no longer CONNECTED or userId changes
            return ()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["messagingService"].unsubscribe(`/channel/${session.userId}`);
            };
        }
    }, [
        connectionStatus,
        session.userId,
        fetchContacts
    ]);
    // Mark messages as read when contact is selected or when new messages arrive
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (selectedContact && conversation.length > 0 && connectionStatus === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConnectionStatus"].CONNECTED) {
            readMessages(conversation);
        }
    }, [
        selectedContact,
        conversation
    ]);
    const scrollToBottom = (behavior = "smooth")=>{
        if (conversationRef.current) {
            // Scroll the container itself to the bottom
            conversationRef.current.scrollTo({
                top: conversationRef.current.scrollHeight,
                behavior: behavior
            });
        }
    };
    const handleScroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const currentDiv = conversationRef.current;
        if (currentDiv) {
            const { scrollTop } = currentDiv;
            const threshold = -100; // Pixels from bottom
            if (scrollTop < threshold) {
                setShowScrollToBottom(true);
            } else {
                setShowScrollToBottom(false);
            }
        }
    }, [
        setShowScrollToBottom
    ]);
    // Handle scroll events for showing/hiding the button
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const conversationDiv = conversationRef.current;
        // Only add listener if the div exists
        if (conversationDiv) {
            conversationDiv.addEventListener("scroll", handleScroll, {
                passive: true
            });
            // Initial check right after attaching
            handleScroll();
            // Cleanup function specific to this effect run
            return ()=>{
                conversationDiv.removeEventListener("scroll", handleScroll);
                // Reset button state when contact changes or unmounts
                setShowScrollToBottom(false);
            };
        } else {
            // No cleanup needed if listener wasn't attached
            return ()=>{
                // Reset button state if effect re-runs and div is no longer there
                setShowScrollToBottom(false);
            };
        }
    }, [
        selectedContact
    ]);
    // Send message function
    const sendMessage = async ()=>{
        // Allow sending only images without text
        if (!messageText.trim() && selectedFiles.length === 0) return;
        if (!session.userId || !selectedContact) return;
        let uploadedImageIds = [];
        let tempImageUrls = [
            ...filePreviews
        ];
        // Upload images if selected
        if (selectedFiles.length > 0) {
            try {
                // Show loading state for images
                const uploadPromises = selectedFiles.map((file)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$images$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["uploadImage"])(file));
                const uploadResults = await Promise.all(uploadPromises);
                // Filter out failed uploads and get IDs
                uploadedImageIds = uploadResults.filter((result)=>result.imageId !== 0).map((result)=>result.imageId);
                if (uploadedImageIds.length !== selectedFiles.length) {
                    console.warn("Some images failed to upload.");
                // Handle failed uploads (e.g., show error message)
                // For now, we'll just send the successfully uploaded ones
                }
            } catch (error) {
                console.error("Error during image upload process:", error);
                // Handle upload errors (e.g., show error message to user)
                return; // Stop message sending if uploads fail critically
            }
        }
        // No message text and no successfully uploaded images
        if (!messageText.trim() && uploadedImageIds.length === 0) {
            console.log("No text or successfully uploaded images to send.");
            // Clear potentially failed previews if only images were selected and all failed
            if (selectedFiles.length > 0) {
                setSelectedFiles([]);
                setFilePreviews([]);
            }
            return;
        }
        try {
            // Create a temporary message object for immediate display
            const tempMessage = {
                messageId: -1,
                userIdFrom: session.userId,
                userIdTo: selectedContact.contactUserId,
                content: messageText,
                isActive: true,
                attachTo: replyTo ? replyTo.messageId : 0,
                sentAt: new Date().toISOString(),
                readAt: null,
                imageAPIList: tempImageUrls.length > 0 ? tempImageUrls : null
            };
            // Add to UI immediately
            setConversation((prev)=>[
                    tempMessage,
                    ...prev
                ]);
            // Scroll to the bottom of the conversation
            scrollToBottom("smooth");
            // Send to server
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["messagingService"].sendMessage(`${session.userId}`, {
                userIdFrom: session.userId,
                userIdTo: selectedContact.contactUserId,
                content: messageText,
                attachTo: replyTo ? replyTo.messageId : 0,
                imageIdList: uploadedImageIds.length > 0 ? uploadedImageIds : [],
                action: "send",
                messageIdList: []
            });
            setMessageText("");
            setSelectedFiles([]);
            setFilePreviews([]);
            setReplyTo(null);
            // Revoke object URLs for previews that were just sent
            tempImageUrls.forEach((url)=>URL.revokeObjectURL(url));
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };
    const readMessages = (messages)=>{
        if (!session.userId || !selectedContact) return;
        // Filter unread messages received from the other user
        const unreadMessages = messages.filter((msg)=>!msg.readAt && msg.userIdFrom === selectedContact.contactUserId && msg.userIdTo === session.userId);
        if (unreadMessages.length === 0) return;
        // Extract message IDs
        const messageIds = unreadMessages.map((msg)=>msg.messageId);
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["messagingService"].sendMessage(`${session.userId}`, {
                userIdFrom: session.userId,
                userIdTo: selectedContact.contactUserId,
                content: null,
                attachTo: null,
                imageIdList: null,
                action: "read",
                messageIdList: messageIds
            });
        } catch (error) {
            console.error("Failed to mark messages as read:", error);
        }
    };
    const deleteMessages = (messageId)=>{
        if (!session.userId || !selectedContact) return;
        // If messageId is provided (from using delete dropdown option), delete that specific message
        const messageIds = messageId ? [
            messageId
        ] : Array.from(selectedMessages);
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["messagingService"].sendMessage(`${session.userId}`, {
                userIdFrom: session.userId,
                userIdTo: selectedContact.contactUserId,
                content: null,
                attachTo: null,
                imageIdList: null,
                action: "delete",
                messageIdList: messageIds
            });
            // Exit selection mode
            setInSelection(false);
            setSelectedMessages(new Set());
        } catch (error) {
            console.error("Failed to delete messages:", error);
        }
    };
    const toggleSelection = (messageId)=>{
        if (!inSelection) return;
        setSelectedMessages((prev)=>{
            const newSelection = new Set(prev);
            if (newSelection.has(messageId)) {
                newSelection.delete(messageId);
            } else {
                newSelection.add(messageId);
            }
            return newSelection;
        });
    };
    const handleSelectionButton = (messageId)=>{
        setInSelection(!inSelection);
        if (messageId) {
            // If a message ID is provided, select that message
            setSelectedMessages(new Set([
                messageId
            ]));
        } else {
            // If no message ID is provided, clear the selection
            setSelectedMessages(new Set());
        }
    };
    const handleScrollToMessage = (messageId)=>{
        const element = document.getElementById(`${messageId}`);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            // Highlight
            element.classList.add("bg-info/20", "transition-colors", "duration-1000");
            setTimeout(()=>{
                element.classList.remove("bg-info/20", "transition-colors", "duration-1000");
            }, 1000);
        } else {
            // If not found, set the target ID to trigger the useEffect loader
            setScrollingToMessageId(messageId);
        }
    };
    // handle loading and scrolling when target is set
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Only run if we have a target ID and are not currently loading messages
        if (scrollingToMessageId === null || isLoadingMoreMessages) {
            return;
        }
        const targetElement = document.getElementById(`${scrollingToMessageId}`);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            // Highlight the message
            targetElement.classList.add("bg-primary/20", "transition-colors", "duration-1000");
            setTimeout(()=>{
                targetElement.classList.remove("bg-primary/20", "transition-colors", "duration-1000");
            }, 1000);
            // Reset the target ID
            setScrollingToMessageId(null);
        } else {
            // Message still not found, check if more messages can be loaded
            if (hasMoreMessages) {
                // Trigger loading more messages
                loadMoreMessages();
            } else {
                // No more messages to load, and the target wasn't found
                setScrollingToMessageId(null); // Reset the target ID
            }
        }
    }, [
        scrollingToMessageId,
        isLoadingMoreMessages,
        conversation,
        hasMoreMessages,
        loadMoreMessages
    ]);
    // Function to go back to contact list on mobile
    const handleBackButton = ()=>{
        setShowConversation(false);
        setSelectedContact(undefined);
        setConversation([]);
    };
    const searchUser = async (uid)=>{
        if (!session.userId || !session.token) return;
        const userId = parseInt(uid, 10);
        try {
            // Check if we already have a conversation with this user
            const existingContact = contacts.find((contact)=>contact.contactUserId === userId);
            if (existingContact) {
                // If we already have a conversation, just select it
                setSelectedContact(existingContact);
                setSearchInput("");
                return;
            }
            // Create a new temporary contact
            const newContact = {
                messageId: -1,
                contactUserId: userId,
                contactUsername: "Unknown User",
                contactUserAvatar: null,
                isContactUserBlocked: false,
                latestMessage: "This is a temp contact, a real contact can be created using the Get Search User Result API. Reload the page after sending a message to get a real contact for now",
                userIdFrom: userId,
                usernameFrom: "",
                userIdTo: -1,
                usernameTo: "",
                sentAt: "",
                readAt: "",
                unreadMessageCount: 0
            };
            // Update the contacts list and select the new contact
            setContacts((prev)=>[
                    newContact,
                    ...prev
                ]);
            setSelectedContact(newContact);
            setConversation([]);
            setSearchInput("");
        } catch (error) {
            console.error("Error searching for user:", error);
        }
    };
    const handleSearchKeyDown = (e)=>{
        if (e.key === "Enter") {
            searchUser(searchInput);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden lg:block w-1/8"
            }, void 0, false, {
                fileName: "[project]/src/components/chats/Messenger.tsx",
                lineNumber: 638,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-base-200 min-h-full flex flex-grow w-6/8 shadow-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `w-full lg:w-1/3 flex flex-col bg-base-100 shadow-md ${showConversation ? "hidden md:flex" : "flex"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col p-2 gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-3xl font-bold mt-6",
                                        children: "Contacts"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chats/Messenger.tsx",
                                        lineNumber: 648,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "my-2 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium",
                                                children: "Status:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chats/Messenger.tsx",
                                                lineNumber: 650,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `badge ${connectionStatus === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConnectionStatus"].CONNECTED ? "badge-success" : connectionStatus === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConnectionStatus"].CONNECTING ? "badge-warning" : "badge-error"} badge-sm`,
                                                children: connectionStatus.toLowerCase()
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chats/Messenger.tsx",
                                                lineNumber: 651,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/chats/Messenger.tsx",
                                        lineNumber: 649,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative bg-base-200 rounded-full p-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faMagnifyingGlass"],
                                                className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chats/Messenger.tsx",
                                                lineNumber: 665,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "Enter user ID to create a new chat for now",
                                                // placeholder="Search Contacts"
                                                className: "w-full h-full rounded-full text-sm pl-8 pr-3",
                                                onChange: (e)=>setSearchInput(e.target.value),
                                                onKeyDown: handleSearchKeyDown
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chats/Messenger.tsx",
                                                lineNumber: 669,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/chats/Messenger.tsx",
                                        lineNumber: 664,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/chats/Messenger.tsx",
                                lineNumber: 647,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "list overflow-y-auto",
                                children: connectionStatus !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConnectionStatus"].CONNECTED ? [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$chats$2f$LoadingContact$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, item, false, {
                                        fileName: "[project]/src/components/chats/Messenger.tsx",
                                        lineNumber: 682,
                                        columnNumber: 48
                                    }, this)) : contacts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-base-content/50 text-center mt-4 break-words text-wrap mx-16",
                                    children: "Start a new conversation with someone to get started"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chats/Messenger.tsx",
                                    lineNumber: 684,
                                    columnNumber: 15
                                }, this) : contacts.map((contact)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: `cursor-pointer p-2 hover:bg-base-200 ${selectedContact?.contactUserId === contact.contactUserId ? "bg-base-200" : ""}`,
                                        onClick: ()=>handleContactSelect(contact),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$users$2f$UserAvatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                src: contact.contactUserAvatar,
                                                username: contact.contactUsername,
                                                size: "lg"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chats/Messenger.tsx",
                                                lineNumber: 696,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center text-md",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "truncate",
                                                        children: [
                                                            contact.userIdFrom === session.userId ? "You: " : "",
                                                            contact.latestMessage ? contact.latestMessage : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "italic opacity-80",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faFileImage"]
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/chats/Messenger.tsx",
                                                                        lineNumber: 705,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    " Image"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/chats/Messenger.tsx",
                                                                lineNumber: 704,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/chats/Messenger.tsx",
                                                        lineNumber: 698,
                                                        columnNumber: 21
                                                    }, this),
                                                    contact.unreadMessageCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "badge badge-info badge-sm text-info-content",
                                                        children: contact.unreadMessageCount
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/chats/Messenger.tsx",
                                                        lineNumber: 710,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/chats/Messenger.tsx",
                                                lineNumber: 697,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, contact.contactUserId, true, {
                                        fileName: "[project]/src/components/chats/Messenger.tsx",
                                        lineNumber: 689,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/chats/Messenger.tsx",
                                lineNumber: 679,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/chats/Messenger.tsx",
                        lineNumber: 642,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `w-full lg:w-2/3 flex flex-col ${showConversation ? "flex" : "hidden md:flex"}`,
                        children: selectedContact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative overflow-y-auto flex flex-col flex-grow",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex h-14 justify-between items-center bg-base-100 shadow-md p-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "btn btn-ghost btn-circle btn-sm",
                                                    onClick: handleBackButton,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faArrowLeft"],
                                                        size: "xl"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/chats/Messenger.tsx",
                                                        lineNumber: 727,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chats/Messenger.tsx",
                                                    lineNumber: 726,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/profile/${selectedContact.contactUserId}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "avatar items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "bg-neutral text-neutral-content place-content-center rounded-full w-10"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chats/Messenger.tsx",
                                                                lineNumber: 732,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-md",
                                                                children: selectedContact.contactUsername
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chats/Messenger.tsx",
                                                                lineNumber: 735,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/chats/Messenger.tsx",
                                                        lineNumber: 731,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chats/Messenger.tsx",
                                                    lineNumber: 730,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/chats/Messenger.tsx",
                                            lineNumber: 724,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2 items-center",
                                            children: inSelection ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-medium mr-2",
                                                        children: [
                                                            selectedMessages.size,
                                                            " selected"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/chats/Messenger.tsx",
                                                        lineNumber: 744,
                                                        columnNumber: 23
                                                    }, this),
                                                    selectedMessages.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "btn btn-soft btn-error btn-sm",
                                                        onClick: ()=>deleteMessages(),
                                                        "aria-label": "Delete selected messages",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faTrashAlt"]
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chats/Messenger.tsx",
                                                                lineNumber: 751,
                                                                columnNumber: 27
                                                            }, this),
                                                            "Delete"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/chats/Messenger.tsx",
                                                        lineNumber: 746,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "btn btn-sm",
                                                        onClick: ()=>handleSelectionButton(),
                                                        "aria-label": "Cancel selection",
                                                        children: "Cancel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/chats/Messenger.tsx",
                                                        lineNumber: 755,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "btn btn-sm btn-ghost",
                                                    onClick: ()=>handleSelectionButton(),
                                                    "aria-label": "Select messages",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$regular$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faCheckSquare"],
                                                        size: "xl"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/chats/Messenger.tsx",
                                                        lineNumber: 771,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chats/Messenger.tsx",
                                                    lineNumber: 766,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chats/Messenger.tsx",
                                            lineNumber: 740,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chats/Messenger.tsx",
                                    lineNumber: 723,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: conversationRef,
                                    className: "flex flex-col-reverse flex-grow overflow-y-auto",
                                    children: [
                                        conversation.map((message)=>{
                                            // Find the original message if this is a reply
                                            let originalMessage = undefined;
                                            if (message.attachTo && message.attachTo !== 0) {
                                                originalMessage = conversation.find((m)=>m.messageId === message.attachTo) ?? {
                                                    messageId: message.attachTo,
                                                    userIdFrom: 0,
                                                    userIdTo: 0,
                                                    content: "[Tap to load and jump to original message]",
                                                    isActive: true,
                                                    attachTo: 0,
                                                    sentAt: new Date().toISOString(),
                                                    readAt: null,
                                                    imageAPIList: null
                                                };
                                            }
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$chats$2f$ChatMessage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                myUserId: session.userId,
                                                message: message,
                                                isSelected: selectedMessages.has(message.messageId),
                                                onMessageClick: toggleSelection,
                                                handleSelectOption: handleSelectionButton,
                                                handleDeleteOption: deleteMessages,
                                                isInSelectionMode: inSelection,
                                                handleReplyOption: (messageId)=>setReplyTo(conversation.find((msg)=>msg.messageId === messageId) || null),
                                                handleScrollToMessage: handleScrollToMessage,
                                                replyTo: originalMessage,
                                                contactUsername: selectedContact.contactUsername
                                            }, message.messageId, false, {
                                                fileName: "[project]/src/components/chats/Messenger.tsx",
                                                lineNumber: 799,
                                                columnNumber: 21
                                            }, this);
                                        }),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            ref: messageLoaderRef,
                                            className: "py-2 text-center",
                                            children: isLoadingMoreMessages ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "loading loading-spinner loading-md"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chats/Messenger.tsx",
                                                lineNumber: 820,
                                                columnNumber: 21
                                            }, this) : !hasMoreMessages && conversation.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-base-content/50",
                                                children: "This is the begining of the conversation"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chats/Messenger.tsx",
                                                lineNumber: 822,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chats/Messenger.tsx",
                                                lineNumber: 824,
                                                columnNumber: 21
                                            }, this) // Placeholder for observer
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chats/Messenger.tsx",
                                            lineNumber: 818,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chats/Messenger.tsx",
                                    lineNumber: 779,
                                    columnNumber: 15
                                }, this),
                                showScrollToBottom && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>scrollToBottom(),
                                    className: "absolute bottom-20 right-4 btn btn-circle btn-sm z-40 shadow-lg" // Positioned button
                                    ,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faAngleDown"]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chats/Messenger.tsx",
                                        lineNumber: 835,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chats/Messenger.tsx",
                                    lineNumber: 831,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col p-2 bg-base-100 border border-base-300",
                                    children: [
                                        replyTo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-center p-2 mb-2 rounded-md bg-base-200 border-l-4 border-primary",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs overflow-hidden",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold flex items-center gap-1",
                                                            children: replyTo.userIdFrom === session.userId ? "You" : selectedContact.contactUsername
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/chats/Messenger.tsx",
                                                            lineNumber: 845,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "truncate opacity-70",
                                                            children: replyTo.content || (replyTo.imageAPIList ? "[Image]" : "[Original message]")
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/chats/Messenger.tsx",
                                                            lineNumber: 848,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/chats/Messenger.tsx",
                                                    lineNumber: 844,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setReplyTo(null),
                                                    className: "btn btn-xs btn-circle bg-base-100",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faXmark"]
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/chats/Messenger.tsx",
                                                        lineNumber: 854,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chats/Messenger.tsx",
                                                    lineNumber: 853,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/chats/Messenger.tsx",
                                            lineNumber: 843,
                                            columnNumber: 19
                                        }, this),
                                        filePreviews.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2 mb-2 p-2",
                                            children: filePreviews.map((previewUrl, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "indicator",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: previewUrl,
                                                            alt: `Preview ${index}`,
                                                            className: "h-16 w-16 object-cover rounded"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/chats/Messenger.tsx",
                                                            lineNumber: 863,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "indicator-item",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>removeImagePreview(index),
                                                                className: "btn btn-circle btn-soft btn-xs",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faMinus"],
                                                                    size: "lg"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chats/Messenger.tsx",
                                                                    lineNumber: 866,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chats/Messenger.tsx",
                                                                lineNumber: 865,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/chats/Messenger.tsx",
                                                            lineNumber: 864,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, index, true, {
                                                    fileName: "[project]/src/components/chats/Messenger.tsx",
                                                    lineNumber: 862,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chats/Messenger.tsx",
                                            lineNumber: 860,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2 items-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    ref: fileInputRef,
                                                    type: "file",
                                                    accept: "image/*",
                                                    multiple: true,
                                                    hidden: true,
                                                    onChange: handleImageSelect
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chats/Messenger.tsx",
                                                    lineNumber: 876,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "btn btn-ghost btn-circle",
                                                    onClick: ()=>fileInputRef.current?.click(),
                                                    "aria-label": "Attach image",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faImages"],
                                                        size: "lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/chats/Messenger.tsx",
                                                        lineNumber: 883,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chats/Messenger.tsx",
                                                    lineNumber: 878,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    className: "input input-ghost flex-grow",
                                                    placeholder: "Type here",
                                                    value: messageText,
                                                    onChange: (e)=>setMessageText(e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chats/Messenger.tsx",
                                                    lineNumber: 885,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "btn btn-primary",
                                                    onClick: sendMessage,
                                                    children: "Send"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chats/Messenger.tsx",
                                                    lineNumber: 893,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/chats/Messenger.tsx",
                                            lineNumber: 874,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chats/Messenger.tsx",
                                    lineNumber: 840,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/chats/Messenger.tsx",
                            lineNumber: 721,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex h-full items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center text-base-content/50",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: connectionStatus !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConnectionStatus"].CONNECTED ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1",
                                        children: [
                                            "Connecting",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "loading loading-dots loading-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chats/Messenger.tsx",
                                                lineNumber: 906,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/chats/Messenger.tsx",
                                        lineNumber: 904,
                                        columnNumber: 21
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Send direct messages to users on FlowChat"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chats/Messenger.tsx",
                                        lineNumber: 909,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chats/Messenger.tsx",
                                    lineNumber: 902,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/chats/Messenger.tsx",
                                lineNumber: 901,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/chats/Messenger.tsx",
                            lineNumber: 900,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/chats/Messenger.tsx",
                        lineNumber: 719,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/chats/Messenger.tsx",
                lineNumber: 640,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden lg:block w-1/8"
            }, void 0, false, {
                fileName: "[project]/src/components/chats/Messenger.tsx",
                lineNumber: 919,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/chats/Messenger.tsx",
        lineNumber: 636,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__a6ec1ce4._.js.map