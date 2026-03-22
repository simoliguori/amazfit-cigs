import { createWidget, widget, align, event } from '@zos/ui'
import { px } from '@zos/utils'
import { back, replace } from '@zos/router'
import { t } from '../lib/i18n'

var COLOR_BG     = 0x1a1a1a
var COLOR_WHITE  = 0xffffff
var COLOR_GRAY   = 0x888888
var COLOR_ACCENT = 0xff6b35
var COLOR_DIM    = 0x2a2a2a

Page({
  build() {
    var app = getApp()
    var W = px(194)
    var H = px(368)
    var editKey = app.globalData.editKey || ''
    var history = app.globalData.history || {}
    var dayData = history[editKey]
    var count = dayData ? (dayData.c || 0) : 0

    createWidget(widget.FILL_RECT, {
      x: 0, y: 0, w: W, h: H, color: COLOR_BG
    })

    // Title
    createWidget(widget.TEXT, {
      x: 0, y: px(40), w: W, h: px(24),
      text: t('edit_day'),
      text_size: px(14),
      color: COLOR_GRAY,
      align_h: align.CENTER_H
    })

    createWidget(widget.TEXT, {
      x: 0, y: px(68), w: W, h: px(22),
      text: editKey,
      text_size: px(16),
      color: COLOR_ACCENT,
      align_h: align.CENTER_H
    })

    // Big number
    createWidget(widget.TEXT, {
      x: 0, y: px(100), w: W, h: px(80),
      text: String(count),
      text_size: px(64),
      color: COLOR_WHITE,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    })

    // Minus button
    createWidget(widget.FILL_RECT, {
      x: px(16), y: px(200), w: px(70), h: px(56),
      radius: px(16), color: COLOR_DIM
    })
    var btnMinus = createWidget(widget.TEXT, {
      x: px(16), y: px(200), w: px(70), h: px(56),
      text: '-',
      text_size: px(32),
      color: COLOR_WHITE,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    })
    btnMinus.addEventListener(event.CLICK_UP, function() {
      if (count > 0) {
        count -= 1
        var a = getApp()
        if (!a.globalData.history[editKey]) a.globalData.history[editKey] = { c: 0, ts: [], avg: 0 }
        a.globalData.history[editKey].c = count
        a.saveHistory()
        replace({ url: 'page/edit' })
      }
    })

    // Plus button
    createWidget(widget.FILL_RECT, {
      x: px(108), y: px(200), w: px(70), h: px(56),
      radius: px(16), color: COLOR_ACCENT
    })
    var btnPlus = createWidget(widget.TEXT, {
      x: px(108), y: px(200), w: px(70), h: px(56),
      text: '+',
      text_size: px(32),
      color: COLOR_WHITE,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    })
    btnPlus.addEventListener(event.CLICK_UP, function() {
      count += 1
      var a = getApp()
      if (!a.globalData.history[editKey]) a.globalData.history[editKey] = { c: 0, ts: [], avg: 0 }
      a.globalData.history[editKey].c = count
      a.saveHistory()
      replace({ url: 'page/edit' })
    })

    // Back button
    createWidget(widget.FILL_RECT, {
      x: px(54), y: px(280), w: px(86), h: px(40),
      radius: px(12), color: COLOR_DIM
    })
    var btnBack = createWidget(widget.TEXT, {
      x: px(54), y: px(280), w: px(86), h: px(40),
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
