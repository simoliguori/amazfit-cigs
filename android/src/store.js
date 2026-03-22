// Local data store with Firebase sync

var history = {}
var endHour = 4
var listeners = []

function getEndHour() { return endHour }
function setEndHour(h) {
  endHour = h
  localStorage.setItem('sig_end_hour', String(h))
}

function getToday() {
  var now = new Date()
  if (now.getHours() < endHour) {
    now = new Date(now.getTime() - 86400000)
  }
  return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
}

function ensureDay(key) {
  if (!history[key]) history[key] = { c: 0, ts: [], avg: 0 }
  return history[key]
}

function save() {
  localStorage.setItem('sigarette_history', JSON.stringify(history))
  listeners.forEach(function(fn) { fn() })
}

function load() {
  try {
    var h = localStorage.getItem('sig_end_hour')
    if (h !== null) endHour = parseInt(h, 10)
  } catch(e) {}
  try {
    var raw = localStorage.getItem('sigarette_history')
    if (raw) {
      history = JSON.parse(raw)
      // Migrate old format
      var keys = Object.keys(history)
      for (var i = 0; i < keys.length; i++) {
        if (typeof history[keys[i]] === 'number') {
          history[keys[i]] = { c: history[keys[i]], ts: [], avg: 0 }
        }
      }
    }
  } catch(e) {
    history = {}
  }
}

function addCigarette() {
  var today = getToday()
  var day = ensureDay(today)
  day.c += 1
  day.ts.push(Date.now())
  save()
}

function removeCigarette() {
  var today = getToday()
  var day = ensureDay(today)
  if (day.c > 0) {
    day.c -= 1
    if (day.ts.length > 0) day.ts.pop()
    save()
  }
}

function getCount() {
  var today = getToday()
  var day = history[today]
  return day ? day.c : 0
}

function getDayCount(key) {
  var day = history[key]
  return day ? (day.c || 0) : 0
}

function getLastTimestamp() {
  var today = getToday()
  var day = history[today]
  if (day && day.ts && day.ts.length > 0) return day.ts[day.ts.length - 1]
  return 0
}

function getAverageInterval() {
  var today = getToday()
  var day = history[today]
  if (!day || !day.ts || day.ts.length < 2) return 0
  var ts = day.ts
  return Math.round((ts[ts.length - 1] - ts[0]) / (ts.length - 1))
}

function getDayAverageInterval(key) {
  var day = history[key]
  if (!day) return 0
  if (day.avg) return day.avg
  if (day.ts && day.ts.length >= 2) {
    return Math.round((day.ts[day.ts.length - 1] - day.ts[0]) / (day.ts.length - 1))
  }
  return 0
}

function setDayCount(key, count) {
  var day = ensureDay(key)
  day.c = count
  save()
}

function getHistory() { return history }

function onChange(fn) { listeners.push(fn) }

function setHistory(h) {
  history = h
  save()
}

load()

export default {
  getToday, getEndHour, setEndHour,
  addCigarette, removeCigarette, getCount,
  getDayCount, getLastTimestamp, getAverageInterval,
  getDayAverageInterval, setDayCount, getHistory,
  onChange, load, setHistory
}
