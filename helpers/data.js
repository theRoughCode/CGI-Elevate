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
  var newPostRef = itemsRef.push();
  console.log(newPostRef.key);
  newPostRef.set(item);
  return callback(newPostRef.key);
}

// RETRIEVE DATA GIVEN UNIQUE ID.  RETURNS NULL IF DOESN"T EXIST
function retrieveItem (key, callback) {
  var retrieveRef = itemsRef.child(key);
  retrieveRef.on('value', data => callback(data.val()));
}

module.exports = {
  addItem,
  retrieveItem
}
