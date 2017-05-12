const admin = require('firebase-admin');

var serviceAccount = require('../public/resources/cgi-elevate-firebase-adminsdk-99kk1-817819ff25.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cgi-elevate.firebaseio.com"
});

var db = admin.database();
var ref = db.ref('db');
var itemsRef = ref.child('items');

/*
UPLOAD ITEM TO DATABASE
item = {
  name,
  desc,
  qty,
  price,
  bid,
  duration,
  photo,
  date_uploaded
}
*/
function addItem(item, callback) {
  // Get key
  var key = itemsRef.push().key;

  console.log(key);

  var updates = {};
  updates[`/items/${key}`] = item;

  return callback(ref.update(updates));
}

module.exports = {
  addItem
}
