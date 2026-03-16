const { db } = require('../config/firebaseAdmin');

/**
 * Busca un usuario en Firestore por su idAuth (UID de Firebase)
 */
const getUserByAuthId = async (uid) => {
  const userSnapshot = await db.collection('usuarios')
    .where('idAuth', '==', uid)
    .limit(1)
    .get();

  if (userSnapshot.empty) {
    return null;
  }

  return {
    id: userSnapshot.docs[0].id,
    ...userSnapshot.docs[0].data()
  };
};

module.exports = {
  getUserByAuthId
};