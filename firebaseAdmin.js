import admin from 'firebase-admin';
import serviceAccount from './src/config/firebase-service-account-file.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;