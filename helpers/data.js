const admin = require('firebase-admin');

var serviceAccount = require('../public/resources/cgi-elevate-firebase-adminsdk-99kk1-817819ff25.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cgi-elevate.firebaseio.com"
});

var db = admin.database();
var ref = db.ref('db');
var itemsRef = ref.child('items');

//var storageRef = admin.storage().ref();
//var imageRef = storageRef.child('images');

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
function addItem(data, callback) {
  // Get key
  var newPostRef = itemsRef.push();
  newPostRef.set(data);
  console.log(data.pic);
  return callback(data);
}

// RETRIEVE DATA GIVEN UNIQUE ID.  RETURNS NULL IF DOESN"T EXIST
function retrieveItem (key, callback) {
  var retrieveRef = itemsRef.child(key);
  retrieveRef.on('value', data => callback(data.val()));
}

// UPDATE ITEM
function updateItem (key, data, callback) {
  var updates = {};
  updates[`/${key}`] = data;
  callback(itemsRef.update(updates));
}

// UPLOAD IMAGE
function uploadImage(key, img, callback) {

}

module.exports = {
  addItem,
  retrieveItem,
  updateItem
}
