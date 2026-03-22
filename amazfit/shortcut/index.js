import { createWidget, widget, align } from '@zos/ui'
import { localStorage } from '@zos/storage'
import { back } from '@zos/router'
import { px } from '@zos/utils'

function getToday() {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
}

function loadCount() {
  try {
    const raw = localStorage.getItem('sigarette')
    if (raw) {
      const data = JSON.parse(raw)
      if (data.date === getToday()) return data.count
    }
  } catch (e) {}
  return 0
}

function saveCount(count) {
  localStorage.setItem('sigarette', JSON.stringify({ date: getToday(), count }))
}

Page({
  build() {
    const W = px(194)
    const H = px(368)
    const count = loadCount() + 1
    saveCount(count)

    const app = getApp()
    if (app && app.globalData) app.globalData.count = count

    createWidget(widget.FILL_RECT, {
      x: 0, y: 0, w: W, h: H,
      color: 0x1a1a1a
    })

    createWidget(widget.TEXT, {
      x: 0, y: px(110), w: W, h: px(50),
      text: '+1',
      text_size: px(38),
      color: 0xff6b35,
      align_h: align.CENTER_H
    })

    createWidget(widget.TEXT, {
      x: 0, y: px(168), w: W, h: px(80),
      text: String(count),
      text_size: px(64),
      color: 0xffffff,
      align_h: align.CENTER_H
    })

    createWidget(widget.TEXT, {
      x: 0, y: px(254), w: W, h: px(24),
      text: 'sigarette oggi',
      text_size: px(15),
      color: 0x888888,
      align_h: align.CENTER_H
    })

    setTimeout(() => back(), 2000)
  }
})
