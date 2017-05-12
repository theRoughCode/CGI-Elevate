const admin = require('firebase-admin');
const fs = require('fs');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('dotenv').config();

var serviceAccount = require('../public/resources/cgi-elevate-firebase-adminsdk-99kk1-817819ff25.json');

FIREBASE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDyHZ0gHSktosB2\n1i4gRqg6ANzzqGp4L/YeuQjpX2TeKHmAmGroEtaJSUhX/QGn53SJGMOYX40uLGNi\nhwi8I+/p/0oGf9qLk/xzUz0gisI3xAYmxevt7I5l+kKB6qNEOF6hwY72bZtQGQNV\nQwRUboMsJZtPNVwIeIMyUuj3lcc1u93+afNWUJS2ZNuIL7Mv+m00PtCFvvK7NOjH\nktJOQY3ibus2sDzjygA9njrVIwotsBqki7twV4dS6esEgbxzttA6GPMYlyDXOAjZ\no8UpQuHn3TU//AdWcg1egBLImOU6gwYNIEuhbnIf7fLmHZOoviy1pqT46MFfIYeX\n+wGXV5wLAgMBAAECggEAI9iclc+bdCU/h5ioVaEAcS4FiJGrycWYE+5jUmIMRhQK\nAS8PzPJVDxhpfJV59EkBaPbgpqOm/GoYANNrSKetcqCYbiPp0HaFjvGJAFNq8+Sy\n4HS3PI+keZa22BNMPuJ1qE9HAlcyAobhhnMYpgOCqjubJfwJdzuYeQ/rbBSh3ON8\n/xpXLYfoHsjG3biPQsxk7XMEA+GlgspxZuTp9sY7nZdo/dTVDV8ok+OsYUoT6oNd\n4bY37sjhV40viX+lw4S/U4H2keLaGEXqqpkpg30J7gSeSloFe5KgViNljXMUMbCZ\nfitfwChrOmsbCN/piAusOte7NauSPSs2dSpcy/nJgQKBgQD5reL2j3ccPeEM6+Yb\nUxa9IrE+P2OINAd6kOw0sm9e/Xjd9V7tJB5LOgK2+q8CiFgaBfVFC18+KfQRvYhP\naoMTHH9h+1Wv7I3F2rxlMJLAIukFUCgkveMrIKkJK8Aeeu/SbwXHkIOO7LamaKSX\ncTjwMaCLwi7NAdWRDxq8cZQ9SwKBgQD4PrWgTj9zzxvJKY91GzCurKMkEsJ8iVeW\nH3pLgtthefLYDzhGzJ6YhL+giIUlu+Tu4zw2rY5aMUHbhzanwu3aSgWvTRP0zhCh\nswCzP01kurqcMIMTmdkaax8L6YA3To2afknZo/Ll3n1PE4R6TiA00xHxfvGt2ROe\nFj58plCkQQKBgDJM0MOhZXqgEL28rI/mrlcOLS0AMjoXWUZc+ekn5X36jKYSr7wQ\nobXACxn36NgWxcEAYEg3oUlxxETqrRJqv9tSy2re6oVVn74zce7k2TuyDMXQPzYf\ntytSGhvJ35uEYto/Gaf5ujdKAwYFYNtNqQ3iwZhGV41fiDoAE//Q1e9/AoGALdY+\naSQpmTOjuMggwgnMOmSMFwwTtzUQ5BpZ1XmLEnuW+IgO5xu/KQBR9c1fcHE6O1Xf\n92SihUrVEzjrQZy/mG/UjuLXjXtDHOhVd8N3geLstAxNF6Bvsu4WpHdwAkZR5TXu\nYu5f2kvzrVc4PfERB0/13zaGX4hWk/kdfpyjBUECgYAY6Oh71CGP1aTXh5aQOV4f\noopQ/pxR6MolS+HCL06jnglVJKdMgiQqw7PReku6SMYxym++GbAtTCdWLhgfa+kW\nOcu8YfbHYWaT4oEnJaP8XECEzpBJ3uIYdLjNtbchSP8HDamsgMOcrfXkfecx426x\nD0YLVEnEalaNCgQ88sXFVA==\n-----END PRIVATE KEY-----\n"

serviceAccount["private_key_id"] = process.env.FIREBASE_ID;
serviceAccount["private_key"] = FIREBASE_KEY || process.env.FIREBASE_KEY;
serviceAccount["client_email"] = process.env.FIREBASE_EMAIL;
serviceAccount["client_id"] = process.env.FIREBASE_CLIENT_ID;
serviceAccount["auth_uri"] =| process.env.FIREBASE_AUTH_URI;
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
