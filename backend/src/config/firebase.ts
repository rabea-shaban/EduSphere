import admin from 'firebase-admin';

let isMock = true;

try {
  // Check if Firebase Admin private keys are configured
  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    isMock = false;
    console.log('[Firebase] SDK Initialized successfully.');
  } else {
    console.log('[Firebase] WARNING: Missing Firebase Admin keys. Running FCM in OFFLINE/SIMULATION mode.');
  }
} catch (error) {
  console.error('[Firebase] Initialization error. Running FCM in OFFLINE/SIMULATION mode.', error);
}

/**
 * Sends a push notification using Firebase Cloud Messaging (FCM).
 * Integrates an offline mock fallback.
 */
export const sendPushNotification = async (
  token: string,
  title: string,
  body: string,
  data: any = {}
): Promise<any> => {
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
    data: data ? Object.keys(data).reduce((acc: any, key) => {
      acc[key] = String(data[key]);
      return acc;
    }, {}) : {},
    token,
  };

  return await admin.messaging().send(message);
};
export default admin;
