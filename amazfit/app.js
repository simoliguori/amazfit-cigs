import { localStorage } from '@zos/storage'

function getEndHour() {
  try {
    var h = localStorage.getItem('sig_end_hour')
    if (h !== null && h !== undefined) return parseInt(h, 10)
  } catch(e) {}
  return 4
}

function getToday() {
  var endHour = getEndHour()
  var now = new Date()
  if (now.getHours() < endHour) {
    now = new Date(now.getTime() - 86400000)
  }
  return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
}

App({
  globalData: {
    count: 0,
    history: {},
    editKey: ''
  },

  onCreate() {
    var today = getToday()
    try {
      var raw = localStorage.getItem('sigarette_history')
      if (raw) {
        var history = JSON.parse(raw)
        // Migrate old format (number) to new format ({c, ts, avg})
        var keys = Object.keys(history)
        for (var i = 0; i < keys.length; i++) {
          var v = history[keys[i]]
          if (typeof v === 'number') {
            history[keys[i]] = { c: v, ts: [], avg: 0 }
          }
        }
        this.globalData.history = history
        var todayData = history[today]
        this.globalData.count = todayData ? todayData.c : 0
      }
    } catch (e) {
      this.globalData.count = 0
      this.globalData.history = {}
    }
    // Archive old days: compute avg from ts, then clear ts
    this._archiveOldDays()
  },

  onDestroy() {},

  getToday: getToday,

  _archiveOldDays() {
    var today = getToday()
    var history = this.globalData.history
    var keys = Object.keys(history)
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i]
      if (k === today) continue
      var day = history[k]
      if (day && day.ts && day.ts.length >= 2 && !day.avg) {
        var sorted = day.ts.slice().sort(function(a, b) { return a - b })
        day.avg = Math.round((sorted[sorted.length - 1] - sorted[0]) / (sorted.length - 1))
      }
      // Clear timestamps for old days to save space
      if (day && day.ts) {
        day.ts = []
      }
    }
    this._save()
  },

  _save() {
    try {
      localStorage.setItem('sigarette_history', JSON.stringify(this.globalData.history))
    } catch(e) {
      console.log('save error: ' + e.message)
    }
  },

  _ensureToday() {
    var today = getToday()
    if (!this.globalData.history[today]) {
      this.globalData.history[today] = { c: 0, ts: [], avg: 0 }
    }
    return today
  },

  addCigarette() {
    var today = this._ensureToday()
    this.globalData.count += 1
    this.globalData.history[today].c = this.globalData.count
    this.globalData.history[today].ts.push(Date.now())
    this._save()
  },

  removeCigarette() {
    if (this.globalData.count > 0) {
      var today = this._ensureToday()
      this.globalData.count -= 1
      this.globalData.history[today].c = this.globalData.count
      if (this.globalData.history[today].ts.length > 0) {
        this.globalData.history[today].ts.pop()
      }
      this._save()
    }
  },

  saveHistory() {
    this._save()
  },

  getLastTimestamp() {
    var today = getToday()
    var day = this.globalData.history[today]
    if (day && day.ts && day.ts.length > 0) {
      return day.ts[day.ts.length - 1]
    }
    return 0
  },

  getAverageInterval() {
    var today = getToday()
    var day = this.globalData.history[today]
    if (!day || !day.ts || day.ts.length < 2) return 0
    var ts = day.ts
    var total = ts[ts.length - 1] - ts[0]
    return Math.round(total / (ts.length - 1))
  },

  getDayAverageInterval(dayKey) {
    var day = this.globalData.history[dayKey]
    if (!day) return 0
    // For archived days, use pre-computed avg
    if (day.avg) return day.avg
    // For today, compute from timestamps
    if (day.ts && day.ts.length >= 2) {
      var total = day.ts[day.ts.length - 1] - day.ts[0]
      return Math.round(total / (day.ts.length - 1))
    }
    return 0
  },

  getDayCount(dayKey) {
    var day = this.globalData.history[dayKey]
    if (!day) return 0
    return day.c || 0
  },

  getEndHour: getEndHour,

  setEndHour: function(h) {
    try {
      localStorage.setItem('sig_end_hour', String(h))
    } catch(e) {}
  }
})
