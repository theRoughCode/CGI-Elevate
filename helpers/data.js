const admin = require('firebase-admin');
const fs = require('fs');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('dotenv').config();

var serviceAccount = require('../public/resources/cgi-elevate-firebase-adminsdk-99kk1-817819ff25.json');

serviceAccount["private_key_id"] = process.env.FIREBASE_ID;
serviceAccount["private_key"] = process.env.FIREBASE_KEY;
serviceAccount["client_email"] = process.env.FIREBASE_EMAIL;
serviceAccount["client_id"] = process.env.FIREBASE_CLIENT_ID;
serviceAccount["auth_uri"] = process.env.FIREBASE_AUTH_URI;
serviceAccount["token_uri"] = process.env.FIREBASE_TOKEN_URI;
serviceAccount["auth_provider_x509_cert_url"] = process.env.FIREBASE_AUTH_CERT;
serviceAccount["client_x509_cert_url"] = process.env.FIREBASE_CLIENT_CERT;

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
  return callback(newPostRef.key);
}

// RETRIEVE DATA GIVEN UNIQUE ID.  RETURNS NULL IF DOESN"T EXIST
function retrieveItem (key, callback) {
  var retrieveRef = itemsRef.child(key);
  retrieveRef.on('value', data => {
    callback(data.val());
  });
}

// UPDATE ITEM
function updateItem (key, data, callback) {
  var updates = {};
  updates[`/${key}`] = data;
  callback(itemsRef.update(updates));
}

// DELETE ITEM
function deleteItem (key, callback) {
  var itemRef = itemsRef.child(key);
  itemRef.on('value', data => {
    if (data.val() != null) {
      var img_id = data.val().img_id;
      if(img_id) deleteImage(img_id, err => {});
      itemRef.remove();
      callback(`${key} removed.`);
    } else callback('Item not found.');
  });
}

// RETRIEVE ALL ITEMS
function getAll (callback) {
  itemsRef.on('value', data => callback(data.val()));
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

// DELETE IMAGE
function deleteImage (id, callback) {
  return callback();
  Image.find({ _id: id }, (err, data) => {
    if (err) {
      console.error("Image not found.");
      return callback(1);
    }
    if(data.length === 0) return callback(1);
    data[0].remove((err, res) => {
      if (err) {
        console.error("Error deleting image.");
        return callback(1);
      }
      console.log("Successfully deleted image.");
      callback(0);
    });
  });
}

module.exports = {
  addItem,
  retrieveItem,
  updateItem,
  uploadImage,
  getImage,
  getAll,
  deleteItem
}
