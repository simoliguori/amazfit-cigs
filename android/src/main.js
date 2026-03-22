import store from './store.js'
import { getLang, setLang, t } from './i18n.js'
import { initFirebase, syncToCloud, listenFromCloud } from './firebase.js'

// --- Navigation ---
var currentPage = 'home'
var editKey = ''

function showPage(name) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active') })
  document.getElementById('page-' + name).classList.add('active')
  currentPage = name
  if (name === 'home') renderHome()
  else if (name === 'history') renderHistory()
  else if (name === 'edit') renderEdit()
  else if (name === 'settings') renderSettings()
}

// --- Helpers ---
function formatElapsed(ms) {
  if (ms <= 0) return t('none_today')
  var sec = Math.floor(ms / 1000)
  var min = Math.floor(sec / 60)
  var hrs = Math.floor(min / 60)
  min = min % 60
  if (hrs > 0) return hrs + 'h ' + min + 'min ' + t('ago')
  if (min > 0) return min + 'min ' + t('ago')
  return t('now')
}

function formatInterval(ms) {
  if (ms <= 0) return '--'
  var min = Math.floor(ms / 60000)
  var hrs = Math.floor(min / 60)
  min = min % 60
  if (hrs > 0) return hrs + 'h ' + min + 'm'
  return min + 'min'
}

function getQuote(count) {
  var quotes = t('quotes')
  var d = new Date()
  var seed = d.getFullYear() * 366 + d.getMonth() * 31 + d.getDate() + (count || 0)
  return quotes[seed % quotes.length]
}

// --- Home ---
function renderHome() {
  var count = store.getCount()
  document.getElementById('homeSubtitle').textContent = t('cigarettes_today')
  document.getElementById('homeQuote').textContent = '\u00AB ' + getQuote(count) + ' \u00BB'
  document.getElementById('homeCount').textContent = count
  document.getElementById('btnAdd').textContent = t('add_cigarette')
  document.getElementById('elapsedLabel').textContent = t('last_cigarette')
  var lastTs = store.getLastTimestamp()
  var elapsed = lastTs > 0 ? Date.now() - lastTs : 0
  document.getElementById('elapsedValue').textContent = formatElapsed(elapsed)
  document.getElementById('btnCorrect').textContent = t('correct')
  document.getElementById('btnHistory').textContent = t('history')
  document.getElementById('btnSettings').textContent = t('settings')
}

// --- History ---
function renderHistory() {
  var container = document.getElementById('histDays')
  container.innerHTML = ''
  var endHour = store.getEndHour()
  var days_names = t('days')
  var months_names = t('months')

  document.getElementById('histTitle').textContent = t('history_14')
  var avgInterval = store.getAverageInterval()
  document.getElementById('histAvg').textContent = t('avg_every') + formatInterval(avgInterval)
  document.getElementById('btnHistBack').textContent = t('back')

  var days = []
  for (var i = 0; i < 14; i++) {
    var d = new Date()
    if (d.getHours() < endHour) d = new Date(d.getTime() - 86400000)
    d.setDate(d.getDate() - i)
    var key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    days.push({ key: key, date: d, count: store.getDayCount(key), avg: store.getDayAverageInterval(key) })
  }

  var maxCount = 1
  days.forEach(function(d) { if (d.count > maxCount) maxCount = d.count })

  days.forEach(function(day, i) {
    var isToday = i === 0
    var label = isToday ? t('today') : days_names[day.date.getDay()]
    var dateStr = day.date.getDate() + ' ' + months_names[day.date.getMonth()]
    var barPct = day.count > 0 ? Math.max(Math.round(100 * day.count / maxCount), 5) : 0

    var row = document.createElement('div')
    row.className = 'day-row' + (isToday ? ' today' : '')
    row.innerHTML =
      '<div class="day-info">' +
        '<div class="day-name">' + label + '</div>' +
        '<div class="day-date">' + dateStr + '</div>' +
        (day.avg > 0 ? '<div class="day-avg">' + t('avg_every') + formatInterval(day.avg) + '</div>' : '') +
      '</div>' +
      '<div class="day-bar-wrap"><div class="day-bar" style="width:' + barPct + '%"></div></div>' +
      '<div class="day-count">' + day.count + '</div>'

    row.addEventListener('click', function() {
      editKey = day.key
      showPage('edit')
    })
    container.appendChild(row)
  })
}

// --- Edit ---
function renderEdit() {
  document.getElementById('editTitle').textContent = t('edit_day')
  document.getElementById('editDate').textContent = editKey
  document.getElementById('editCount').textContent = store.getDayCount(editKey)
  document.getElementById('btnEditBack').textContent = t('back')
}

// --- Settings ---
function renderSettings() {
  var lang = getLang()
  document.getElementById('settTitle').textContent = t('settings').toUpperCase()
  document.getElementById('settLangLabel').textContent = t('language')
  document.getElementById('settEndLabel').textContent = t('end_day')
  document.getElementById('settCreditsLabel').textContent = t('credits')
  document.getElementById('btnSettBack').textContent = t('back')

  document.getElementById('btnLangEn').className = 'lang-btn ' + (lang === 'en' ? 'active' : 'inactive')
  document.getElementById('btnLangIt').className = 'lang-btn ' + (lang === 'it' ? 'active' : 'inactive')

  var h = store.getEndHour()
  document.getElementById('hourDisplay').textContent = (h < 10 ? '0' : '') + h + ':00'
}

// --- Event Listeners ---
document.getElementById('btnAdd').addEventListener('click', function() {
  store.addCigarette()
  showPage('history')
})

document.getElementById('btnCorrect').addEventListener('click', function() {
  store.removeCigarette()
  renderHome()
})

document.getElementById('btnHistory').addEventListener('click', function() { showPage('history') })
document.getElementById('btnSettings').addEventListener('click', function() { showPage('settings') })
document.getElementById('btnHistBack').addEventListener('click', function() { showPage('home') })
document.getElementById('btnEditBack').addEventListener('click', function() { showPage('history') })
document.getElementById('btnSettBack').addEventListener('click', function() { showPage('home') })

document.getElementById('btnEditMinus').addEventListener('click', function() {
  var c = store.getDayCount(editKey)
  if (c > 0) { store.setDayCount(editKey, c - 1); renderEdit() }
})
document.getElementById('btnEditPlus').addEventListener('click', function() {
  var c = store.getDayCount(editKey)
  store.setDayCount(editKey, c + 1)
  renderEdit()
})

document.getElementById('btnLangEn').addEventListener('click', function() { setLang('en'); renderSettings() })
document.getElementById('btnLangIt').addEventListener('click', function() { setLang('it'); renderSettings() })

document.getElementById('btnHourMinus').addEventListener('click', function() {
  var h = (store.getEndHour() - 1 + 24) % 24
  store.setEndHour(h)
  renderSettings()
})
document.getElementById('btnHourPlus').addEventListener('click', function() {
  var h = (store.getEndHour() + 1) % 24
  store.setEndHour(h)
  renderSettings()
})

// --- Firebase Sync ---
var syncStatus = document.getElementById('syncStatus')

if (initFirebase()) {
  syncStatus.textContent = 'synced'
  syncStatus.className = 'sync-status synced'

  // Sync local changes to cloud
  store.onChange(function() {
    syncStatus.textContent = 'syncing...'
    syncStatus.className = 'sync-status syncing'
    syncToCloud(store.getHistory())
    setTimeout(function() {
      syncStatus.textContent = 'synced'
      syncStatus.className = 'sync-status synced'
    }, 1000)
  })

  // Listen for cloud changes (from watch)
  listenFromCloud(function(cloudData) {
    store.setHistory(cloudData)
    if (currentPage === 'home') renderHome()
    else if (currentPage === 'history') renderHistory()
  })
}

// --- Init ---
renderHome()
