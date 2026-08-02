"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPushNotification = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
let isMock = true;
try {
    // Check if Firebase Admin private keys are configured
    if (process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PRIVATE_KEY) {
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
        });
        isMock = false;
        console.log('[Firebase] SDK Initialized successfully.');
    }
    else {
        console.log('[Firebase] WARNING: Missing Firebase Admin keys. Running FCM in OFFLINE/SIMULATION mode.');
    }
}
catch (error) {
    console.error('[Firebase] Initialization error. Running FCM in OFFLINE/SIMULATION mode.', error);
}
/**
 * Sends a push notification using Firebase Cloud Messaging (FCM).
 * Integrates an offline mock fallback.
 */
const sendPushNotification = async (token, title, body, data = {}) => {
    if (isMock) {
        console.log(`[FCM Mock] Push Notification Dispatched:
      To Token : ${token}
      Title    : ${title}
      Body     : ${body}
      Payload  :`, data);
        return { success: true, messageId: `mock-fcm-msg-id-${Date.now()}` };
    }
    const message = {
        notification: { title, body },
        data: data ? Object.keys(data).reduce((acc, key) => {
            acc[key] = String(data[key]);
            return acc;
        }, {}) : {},
        token,
    };
    return await firebase_admin_1.default.messaging().send(message);
};
exports.sendPushNotification = sendPushNotification;
exports.default = firebase_admin_1.default;
