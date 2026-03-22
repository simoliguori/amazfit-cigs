import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, onValue } from 'firebase/database'

var firebaseConfig = {
  apiKey: "AIzaSyBKLFwY0GzgtXVk12ouujZR7KNMCydSm2s",
  authDomain: "cigs-b6740.firebaseapp.com",
  databaseURL: "https://cigs-b6740-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cigs-b6740",
  storageBucket: "cigs-b6740.firebasestorage.app",
  messagingSenderId: "366056315232",
  appId: "1:366056315232:web:410294b1fbbfc16deba605",
  measurementId: "G-3Q61ZJSFHW"
}

var db = null
var userId = 'default'

export function initFirebase() {
  try {
    var app = initializeApp(firebaseConfig)
    db = getDatabase(app)
    console.log('Firebase connected')
    return true
  } catch(e) {
    console.log('Firebase init error:', e)
    return false
  }
}

export function syncToCloud(history) {
  if (!db) return
  try {
    set(ref(db, 'users/' + userId + '/history'), history)
  } catch(e) {
    console.log('Sync error:', e)
  }
}

export function listenFromCloud(callback) {
  if (!db) return
  try {
    onValue(ref(db, 'users/' + userId + '/history'), function(snapshot) {
      var data = snapshot.val()
      if (data) callback(data)
    })
  } catch(e) {
    console.log('Listen error:', e)
  }
}

export function setUserId(id) { userId = id }
