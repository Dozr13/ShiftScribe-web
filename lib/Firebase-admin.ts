var admin = require('firebase-admin');

var serviceAccount = require('../secret/shiftscribe-db-firebase-adminsdk-4xwdo-3914fc2e55.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://shiftscribe-db-default-rtdb.firebaseio.com',
  });
}

export default admin;
