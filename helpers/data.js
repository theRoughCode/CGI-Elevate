const admin = require('firebase-admin');
const fs = require('fs');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('dotenv').config();

var serviceAccount = require('../public/resources/cgi-elevate-firebase-adminsdk-99kk1-817819ff25.json');

FIREBASE_EMAIL="firebase-adminsdk-99kk1@cgi-elevate.iam.gserviceaccount.com"
FIREBASE_CLIENT_ID="118370635715292571795",
FIREBASE_AUTH_URI="https://accounts.google.com/o/oauth2/auth",
FIREBASE_TOKEN_URI="https://accounts.google.com/o/oauth2/token",
FIREBASE_AUTH_CERT="https://www.googleapis.com/oauth2/v1/certs",
FIREBASE_CLIENT_CERT="https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-99kk1%40cgi-elevate.iam.gserviceaccount.com"
MONGOOSE="mongodb://admin:ICe2SwRQyADblIOqV8yf@ds137261.mlab.com:37261/cgi"

serviceAccount["private_key_id"] = process.env.FIREBASE_ID;
serviceAccount["private_key"] = process.env.FIREBASE_KEY;
serviceAccount["client_email"] = FIREBASE_EMAIL || process.env.FIREBASE_EMAIL;
serviceAccount["client_id"] = FIREBASE_CLIENT_ID || process.env.FIREBASE_CLIENT_ID;
serviceAccount["auth_uri"] = FIREBASE_AUTH_URI || process.env.FIREBASE_AUTH_URI;
serviceAccount["token_uri"] = FIREBASE_TOKEN_URI || process.env.FIREBASE_TOKEN_URI;
serviceAccount["auth_provider_x509_cert_url"] = FIREBASE_AUTH_CERT || process.env.FIREBASE_AUTH_CERT;
serviceAccount["client_x509_cert_url"] = FIREBASE_CLIENT_CERT || process.env.FIREBASE_CLIENT_CERT;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
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
function addItem(data, callback) {
  // Get key
  var newPostRef = itemsRef.push();
  newPostRef.set(data);
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



//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Storage  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

mongoose.connect(process.env.MONGOOSE);

var ImageSchema = new Schema({
  img: { data: Buffer, contentType: String }
});
var Image = mongoose.model('Image', ImageSchema);

// UPLOAD IMAGE
function uploadImage(img, callback) {
  var image = new Image();
  image.img.data = fs.readFileSync(img.path);
  image.img.contentType = img.type;
  image.save((err, saved) => callback(saved.id));
}

// RETRIEVE IMAGE
// returns Image Schema
function getImage(id, callback) {
  Image.findById(id, (err, img) => callback(img.img));
}

module.exports = {
  addItem,
  retrieveItem,
  updateItem,
  uploadImage,
  getImage
}
