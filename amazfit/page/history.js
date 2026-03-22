import { createWidget, widget, align, event } from '@zos/ui'
import { px } from '@zos/utils'
import { push } from '@zos/router'
import { t } from '../lib/i18n'

var COLOR_BG     = 0x1a1a1a
var COLOR_WHITE  = 0xffffff
var COLOR_GRAY   = 0x888888
var COLOR_ACCENT = 0xff6b35
var COLOR_DIM    = 0x2a2a2a
var COLOR_ROW_TODAY = 0x2a1a0a

function formatInterval(ms) {
  if (ms <= 0) return '--'
  var min = Math.floor(ms / 60000)
  var hrs = Math.floor(min / 60)
  min = min % 60
  if (hrs > 0) return hrs + 'h ' + min + 'm'
  return min + 'min'
}

Page({
  build() {
    var app = getApp()
    var W = px(194)
    var days_names = t('days')
    var months_names = t('months')
    var endHour = app.getEndHour()

    // Last 14 days
    var days = []
    for (var i = 0; i < 14; i++) {
      var d = new Date()
      if (d.getHours() < endHour) {
        d = new Date(d.getTime() - 86400000)
      }
      d.setDate(d.getDate() - i)
      var key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      var count = app.getDayCount(key)
      var avgMs = app.getDayAverageInterval(key)
      days.push({ key: key, date: d, count: count, avg: avgMs })
    }

    var maxCount = 1
    for (var i = 0; i < days.length; i++) {
      if (days[i].count > maxCount) maxCount = days[i].count
    }

    var ROW_H  = px(54)
    var ROW_GAP = px(6)

    // Global average (today)
    var avgInterval = app.getAverageInterval()

    // Title
    createWidget(widget.TEXT, {
      x: 0, y: px(10), w: W, h: px(22),
      text: t('history_14'),
      text_size: px(14),
      color: COLOR_GRAY,
      align_h: align.CENTER_H
    })

    // Global average
    createWidget(widget.TEXT, {
      x: 0, y: px(34), w: W, h: px(18),
      text: t('avg_every') + formatInterval(avgInterval),
      text_size: px(12),
      color: COLOR_ACCENT,
      align_h: align.CENTER_H
    })

    for (var i = 0; i < days.length; i++) {
      var day = days[i]
      var rowY = px(60) + i * (ROW_H + ROW_GAP)
      var isToday = i === 0
      var label = isToday ? t('today') : days_names[day.date.getDay()]
      var dateStr = day.date.getDate() + ' ' + months_names[day.date.getMonth()]

      // Row background
      createWidget(widget.FILL_RECT, {
        x: px(8), y: rowY,
        w: W - px(16), h: ROW_H,
        radius: px(8),
        color: isToday ? COLOR_ROW_TODAY : COLOR_DIM
      })

      // Day name
      createWidget(widget.TEXT, {
        x: px(16), y: rowY + px(4),
        w: px(40), h: px(18),
        text: label,
        text_size: px(14),
        color: isToday ? COLOR_ACCENT : COLOR_WHITE
      })

      // Date
      createWidget(widget.TEXT, {
        x: px(16), y: rowY + px(22),
        w: px(50), h: px(14),
        text: dateStr,
        text_size: px(10),
        color: COLOR_GRAY
      })

      // Bar
      var barMaxW = px(70)
      var barW = day.count > 0
        ? Math.max(Math.round(barMaxW * day.count / maxCount), px(4))
        : 0
      if (barW > 0) {
        createWidget(widget.FILL_RECT, {
          x: px(70), y: rowY + px(10),
          w: barW, h: px(12),
          radius: px(4),
          color: isToday ? COLOR_ACCENT : 0x774422
        })
      }

      // Avg time between cigs (under bar)
      if (day.avg > 0) {
        createWidget(widget.TEXT, {
          x: px(70), y: rowY + px(26),
          w: px(80), h: px(16),
          text: t('avg_every') + formatInterval(day.avg),
          text_size: px(10),
          color: 0xccaa77
        })
      }

      // Count
      createWidget(widget.TEXT, {
        x: W - px(44), y: rowY + px(8),
        w: px(36), h: px(26),
        text: String(day.count),
        text_size: px(20),
        color: isToday ? COLOR_ACCENT : COLOR_WHITE,
        align_h: align.CENTER_H
      })

      // Clickable overlay
      ;(function(dayKey) {
        var overlay = createWidget(widget.TEXT, {
          x: px(8), y: rowY,
          w: W - px(16), h: ROW_H,
          text: '',
          text_size: px(1),
          color: 0x000000
        })
        overlay.addEventListener(event.CLICK_UP, function() {
          var a = getApp()
          a.globalData.editKey = dayKey
          push({ url: 'page/edit' })
        })
      })(day.key)
    }
  }
})
