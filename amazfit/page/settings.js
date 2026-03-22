import { createWidget, widget, align, event } from '@zos/ui'
import { px } from '@zos/utils'
import { back, replace } from '@zos/router'
import { getLang, setLang, t } from '../lib/i18n'

var COLOR_BG     = 0x1a1a1a
var COLOR_WHITE  = 0xffffff
var COLOR_GRAY   = 0x888888
var COLOR_ACCENT = 0xff6b35
var COLOR_DIM    = 0x2a2a2a

Page({
  build() {
    var app = getApp()
    var W = px(194)
    var lang = getLang()
    var endHour = app.getEndHour()

    createWidget(widget.FILL_RECT, {
      x: 0, y: 0, w: W, h: px(320), color: COLOR_BG
    })

    // Titolo
    createWidget(widget.TEXT, {
      x: 0, y: px(10), w: W, h: px(22),
      text: t('settings').toUpperCase(),
      text_size: px(14),
      color: COLOR_GRAY,
      align_h: align.CENTER_H
    })

    // --- LANGUAGE ---
    createWidget(widget.TEXT, {
      x: px(16), y: px(40), w: W, h: px(18),
      text: t('language'),
      text_size: px(12),
      color: COLOR_GRAY
    })

    // English button
    createWidget(widget.FILL_RECT, {
      x: px(16), y: px(60), w: px(74), h: px(36),
      radius: px(10), color: lang === 'en' ? COLOR_ACCENT : COLOR_DIM
    })
    var btnEn = createWidget(widget.TEXT, {
      x: px(16), y: px(60), w: px(74), h: px(36),
      text: 'English',
      text_size: px(13),
      color: lang === 'en' ? COLOR_WHITE : COLOR_GRAY,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    })
    btnEn.addEventListener(event.CLICK_UP, function() {
      setLang('en')
      replace({ url: 'page/settings' })
    })

    // Italiano button
    createWidget(widget.FILL_RECT, {
      x: px(104), y: px(60), w: px(74), h: px(36),
      radius: px(10), color: lang === 'it' ? COLOR_ACCENT : COLOR_DIM
    })
    var btnIt = createWidget(widget.TEXT, {
      x: px(104), y: px(60), w: px(74), h: px(36),
      text: 'Italiano',
      text_size: px(13),
      color: lang === 'it' ? COLOR_WHITE : COLOR_GRAY,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    })
    btnIt.addEventListener(event.CLICK_UP, function() {
      setLang('it')
      replace({ url: 'page/settings' })
    })

    // --- END DAY AT ---
    createWidget(widget.TEXT, {
      x: px(16), y: px(112), w: W, h: px(18),
      text: t('end_day'),
      text_size: px(12),
      color: COLOR_GRAY
    })

    // Hour display
    createWidget(widget.TEXT, {
      x: 0, y: px(134), w: W, h: px(40),
      text: (endHour < 10 ? '0' : '') + endHour + ':00',
      text_size: px(28),
      color: COLOR_WHITE,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    })

    // Minus hour
    createWidget(widget.FILL_RECT, {
      x: px(16), y: px(136), w: px(40), h: px(36),
      radius: px(10), color: COLOR_DIM
    })
    var btnHMinus = createWidget(widget.TEXT, {
      x: px(16), y: px(136), w: px(40), h: px(36),
      text: '-',
      text_size: px(24),
      color: COLOR_WHITE,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    })
    btnHMinus.addEventListener(event.CLICK_UP, function() {
      var a = getApp()
      var h = a.getEndHour()
      h = (h - 1 + 24) % 24
      a.setEndHour(h)
      replace({ url: 'page/settings' })
    })

    // Plus hour
    createWidget(widget.FILL_RECT, {
      x: px(138), y: px(136), w: px(40), h: px(36),
      radius: px(10), color: COLOR_DIM
    })
    var btnHPlus = createWidget(widget.TEXT, {
      x: px(138), y: px(136), w: px(40), h: px(36),
      text: '+',
      text_size: px(24),
      color: COLOR_WHITE,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    })
    btnHPlus.addEventListener(event.CLICK_UP, function() {
      var a = getApp()
      var h = a.getEndHour()
      h = (h + 1) % 24
      a.setEndHour(h)
      replace({ url: 'page/settings' })
    })

    // --- CREDITS ---
    createWidget(widget.FILL_RECT, {
      x: px(16), y: px(190), w: W - px(32), h: px(1),
      color: COLOR_DIM
    })

    createWidget(widget.TEXT, {
      x: 0, y: px(200), w: W, h: px(16),
      text: t('credits'),
      text_size: px(11),
      color: COLOR_GRAY,
      align_h: align.CENTER_H
    })

    createWidget(widget.TEXT, {
      x: 0, y: px(218), w: W, h: px(20),
      text: 'eccerobot.xyz',
      text_size: px(14),
      color: COLOR_ACCENT,
      align_h: align.CENTER_H
    })

    // Back button
    createWidget(widget.FILL_RECT, {
      x: px(54), y: px(252), w: px(86), h: px(36),
      radius: px(12), color: COLOR_DIM
    })
    var btnBack = createWidget(widget.TEXT, {
      x: px(54), y: px(252), w: px(86), h: px(36),
      text: t('back'),
      text_size: px(14),
      color: COLOR_GRAY,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    })
    btnBack.addEventListener(event.CLICK_UP, function() {
      back()
    })
  }
})
