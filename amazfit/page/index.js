import { createWidget, widget, align, prop, event } from '@zos/ui'
import { px } from '@zos/utils'
import { push, replace } from '@zos/router'
import { t } from '../lib/i18n'

var COLOR_BG     = 0x1a1a1a
var COLOR_ACCENT = 0xff6b35
var COLOR_WHITE  = 0xffffff
var COLOR_GRAY   = 0x888888
var COLOR_DIM    = 0x2a2a2a

function getQuote(count) {
  var quotes = t('quotes')
  var d = new Date()
  var seed = d.getFullYear() * 366 + d.getMonth() * 31 + d.getDate() + (count || 0)
  var idx = seed % quotes.length
  return quotes[idx]
}

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

Page({
  build() {
    var app = getApp()
    var W = px(194)
    var H = px(368)

    createWidget(widget.FILL_RECT, {
      x: 0, y: 0, w: W, h: px(400), color: COLOR_BG
    })

    // Cigarette icon
    createWidget(widget.FILL_RECT, {
      x: px(47), y: px(38), w: px(100), h: px(10),
      radius: px(5), color: 0xf5e6d0
    })
    createWidget(widget.FILL_RECT, {
      x: px(47), y: px(38), w: px(22), h: px(10),
      radius: px(5), color: 0xd4954a
    })

    // Title
    createWidget(widget.TEXT, {
      x: 0, y: px(54), w: W, h: px(18),
      text: t('cigarettes_today'),
      text_size: px(13),
      color: COLOR_GRAY,
      align_h: align.CENTER_H
    })

    // Quote
    createWidget(widget.TEXT, {
      x: px(10), y: px(73), w: W - px(20), h: px(30),
      text: '\u00AB ' + getQuote(app.globalData.count) + ' \u00BB',
      text_size: px(10),
      color: 0xccaa77,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    })

    // Big number
    createWidget(widget.TEXT, {
      x: 0, y: px(105), w: W, h: px(83),
      text: String(app.globalData.count),
      text_size: px(64),
      color: COLOR_WHITE,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    })

    // + button
    createWidget(widget.FILL_RECT, {
      x: px(24), y: px(192), w: px(146), h: px(56),
      radius: px(16), color: COLOR_ACCENT
    })
    var btnPlusText = createWidget(widget.TEXT, {
      x: px(24), y: px(192), w: px(146), h: px(56),
      text: t('add_cigarette'),
      text_size: px(20),
      color: COLOR_WHITE,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    })
    btnPlusText.addEventListener(event.CLICK_UP, function() {
      console.log('CLICK +')
      try {
        var a = getApp()
        a.addCigarette()
      } catch(e) {
        console.log('save error: ' + e.message)
      }
      push({ url: 'page/history' })
    })

    // Last cigarette
    var lastTs = app.getLastTimestamp()
    var elapsed = lastTs > 0 ? Date.now() - lastTs : 0
    createWidget(widget.TEXT, {
      x: 0, y: px(250), w: W, h: px(16),
      text: t('last_cigarette'),
      text_size: px(11),
      color: COLOR_GRAY,
      align_h: align.CENTER_H
    })
    createWidget(widget.TEXT, {
      x: 0, y: px(268), w: W, h: px(20),
      text: formatElapsed(elapsed),
      text_size: px(14),
      color: COLOR_ACCENT,
      align_h: align.CENTER_H
    })

    // Correct button
    createWidget(widget.FILL_RECT, {
      x: px(60), y: px(298), w: px(74), h: px(34),
      radius: px(10), color: COLOR_DIM
    })
    var btnMinusText = createWidget(widget.TEXT, {
      x: px(60), y: px(298), w: px(74), h: px(34),
      text: t('correct'),
      text_size: px(13),
      color: COLOR_GRAY,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    })
    btnMinusText.addEventListener(event.CLICK_UP, function() {
      var a = getApp()
      a.removeCigarette()
      replace({ url: 'page/index' })
    })

    // History button
    createWidget(widget.FILL_RECT, {
      x: px(16), y: px(340), w: px(78), h: px(28),
      radius: px(10), color: COLOR_DIM
    })
    var btnHistText = createWidget(widget.TEXT, {
      x: px(16), y: px(340), w: px(78), h: px(28),
      text: t('history'),
      text_size: px(12),
      color: COLOR_GRAY,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    })
    btnHistText.addEventListener(event.CLICK_UP, function() {
      push({ url: 'page/history' })
    })

    // Settings button
    createWidget(widget.FILL_RECT, {
      x: px(100), y: px(340), w: px(78), h: px(28),
      radius: px(10), color: COLOR_DIM
    })
    var btnSettText = createWidget(widget.TEXT, {
      x: px(100), y: px(340), w: px(78), h: px(28),
      text: t('settings'),
      text_size: px(12),
      color: COLOR_GRAY,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    })
    btnSettText.addEventListener(event.CLICK_UP, function() {
      push({ url: 'page/settings' })
    })
  }
})
