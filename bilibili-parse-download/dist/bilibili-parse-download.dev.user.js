// ==UserScript==
// @name          bilibili视频下载(dev)
// @namespace     https://github.com/injahow
// @version       0.0.1
// @description   bilibili视频下载(dev)
// @author        injahow
// @copyright     2021, injahow (https://github.com/injahow)
// @license       MIT
// @source        https://github.com/injahow/user.js
// @supportURL    https://github.com/injahow/user.js/issues
// @downloadURL   https://update.greasyfork.org/scripts/413228/bilibili%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL     https://update.greasyfork.org/scripts/413228/bilibili%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// @match         *://www.bilibili.com/video/av*
// @match         *://www.bilibili.com/video/BV*
// @match         *://www.bilibili.com/list/*
// @match         *://www.bilibili.com/festival/*
// @match         *://www.bilibili.com/bangumi/play/ep*
// @match         *://www.bilibili.com/bangumi/play/ss*
// @match         *://www.bilibili.com/cheese/play/ep*
// @match         *://www.bilibili.com/cheese/play/ss*
// @match         *://space.bilibili.com/*/upload/video
// @require       https://static.hdslb.com/js/jquery.min.js
// @icon          https://static.hdslb.com/images/favicon.ico
// @grant         none
// ==/UserScript==
// @[ source codes in local repo ]
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/*!**************************************!*\
  !*** ./src/js/index.js + 23 modules ***!
  \**************************************/

;// ./src/js/user.js

class User {
  constructor() {
    this.is_login = false;
    this.vip_status = 0;
    this.mid = '';
    this.uname = '';
    this.has_init = false;
    this.lazyInit();
  }
  needReplace() {
    return !this.is_login || !this.vip_status && video.base().needVip();
  }
  isVIP() {
    return this.vip_status === 1;
  }
  lazyInit(last_init) {
    if (!this.has_init) {
      if (window.__BILI_USER_INFO__) {
        this.is_login = window.__BILI_USER_INFO__.isLogin;
        this.vip_status = window.__BILI_USER_INFO__.vipStatus;
        this.mid = window.__BILI_USER_INFO__.mid || '';
        this.uname = window.__BILI_USER_INFO__.uname || '';
      } else if (window.__BiliUser__) {
        this.is_login = window.__BiliUser__.isLogin;
        if (window.__BiliUser__.cache) {
          this.vip_status = window.__BiliUser__.cache.data.vipStatus;
          this.mid = window.__BiliUser__.cache.data.mid || '';
          this.uname = window.__BiliUser__.cache.data.uname || '';
        } else {
          this.vip_status = 0;
          this.mid = '';
          this.uname = '';
        }
      }
      this.has_init = last_init;
    }
  }
}
const user = new User();
;// ./src/js/utils/cache.js
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class CacheFactory {
  static get() {
    let name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
    let cache = CacheFactory.map[name];
    if (cache instanceof Cache) {
      return cache;
    }
    cache = new Cache();
    CacheFactory.map[name] = cache;
    return cache;
  }
  static setValue() {
    let key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let value = arguments.length > 1 ? arguments[1] : undefined;
    let [cacheName, cacheKey] = key.split('.', 2);
    if (!cacheName || !cacheKey) {
      return;
    }
    const cache = CacheFactory.get(cacheName);
    if (cache instanceof Cache) {
      cache.set(cacheKey, value);
    }
  }
  static clear(name) {
    if (name) {
      CacheFactory.get(name).clear();
      return;
    }
    CacheFactory.map = {};
  }
}
_defineProperty(CacheFactory, "map", {});
class Cache {
  constructor() {
    this.data = {};
  }
  get() {
    let key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return this.data[key];
  }
  set() {
    let key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let value = arguments.length > 1 ? arguments[1] : undefined;
    this.data[key] = value;
  }
  clear() {
    this.data = {};
  }
}
/* harmony default export */ var cache = (CacheFactory);
;// ./src/js/ui/scroll.js
function show_scroll() {
  if ($('div#bp_config').is(':hidden') && $('div#message_box').is(':hidden')) {
    $('body').css('overflow', 'auto');
  }
}
function hide_scroll() {
  $('body').css('overflow', 'hidden');
}
const scroll_scroll = {
  show: show_scroll,
  hide: hide_scroll
};
;// ./src/html/message.html
// Module
var code = "<div class=\"message-bg\"></div> <div id=\"message_box\"> <div class=\"message-box-mark\"></div> <div class=\"message-box-bg\"> <span style=\"font-size:20px\"><b>提示：</b></span> <div id=\"message_box_context\" style=\"margin:2% 0\">...</div><br/><br/> <div class=\"message-box-btn\"> <button name=\"affirm\">确定</button> <button name=\"cancel\">取消</button> </div> </div> </div> <style>.message-bg{position:fixed;float:right;right:0;top:2%;z-index:30000}.message{margin-bottom:15px;padding:2% 2%;width:300px;display:flex;margin-top:-70px;opacity:0}.message-success{background-color:#dfd;border-left:6px solid #4caf50}.message-error{background-color:#fdd;border-left:6px solid #f44336}.message-info{background-color:#e7f3fe;border-left:6px solid #0c86de}.message-warning{background-color:#ffc;border-left:6px solid #ffeb3b}.message-context{font-size:21px;word-wrap:break-word;word-break:break-all}.message-context p{margin:0}#message_box{opacity:0;display:none;position:fixed;inset:0px;top:0;left:0;width:100%;height:100%;z-index:20000}.message-box-bg{position:absolute;background:#fff;border-radius:10px;padding:20px;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;z-index:20001}.message-box-mark{width:100%;height:100%;position:fixed;top:0;left:0;background:rgba(0,0,0,.5);z-index:20000}.message-box-btn{text-align:right}.message-box-btn button{margin:0 5px;width:120px;height:40px;border-width:0;border-radius:3px;background:#1e90ff;cursor:pointer;outline:0;color:#fff;font-size:17px}.message-box-btn button:hover{background:#59f}</style> ";
// Exports
/* harmony default export */ var message = (code);
;// ./src/js/ui/message.js


function initMessage(el) {
  if (el && !!$(el)[0]) {
    $(el).append(message);
    return;
  }
  $('body').append(message);
}
function messageBox(ctx, type) {
  if (type === 'confirm') {
    $('.message-box-btn button[name="cancel"]').show();
  } else if (type === 'alert') {
    $('.message-box-btn button[name="cancel"]').hide();
  }
  if (ctx.html) {
    $('#message_box_context').html(`<div style="font-size:18px">${ctx.html}</div>`);
  } else {
    $('#message_box_context').html('<div style="font-size:18px">╰(￣▽￣)╮</div>');
  }
  scroll_scroll.hide();
  $('#message_box').show();
  $('#message_box').animate({
    'opacity': '1'
  }, 300);
  const option = {
    affirm: () => {
      $('#message_box').hide();
      $('#message_box').css('opacity', 0);
      scroll_scroll.show();
      if (ctx.callback && ctx.callback.affirm) {
        ctx.callback.affirm();
      }
    },
    cancel: () => {
      $('#message_box').hide();
      $('#message_box').css('opacity', 0);
      scroll_scroll.show();
      if (ctx.callback && ctx.callback.cancel) {
        ctx.callback.cancel();
      }
    }
  };
  $('.message-box-btn button[name="affirm"]')[0].onclick = option.affirm;
  $('.message-box-btn button[name="cancel"]')[0].onclick = option.cancel;
  return option;
}
let id = 0;
function message_message(html, type) {
  id += 1;
  messageEnQueue(`<div id="message_${id}" class="message message-${type}"><div class="message-context"><p><strong>${type}：</strong></p><p>${html}</p></div></div>`, id);
  messageDeQueue(id, 3);
}
function messageEnQueue(message, id) {
  $('.message-bg').append(message);
  $(`#message_${id}`).animate({
    'margin-top': '+=70px',
    'opacity': '1'
  }, 300);
}
function messageDeQueue(id) {
  let time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  setTimeout(() => {
    const e = `div#message_${id}`;
    $(e).animate({
      'margin-top': '-=70px',
      'opacity': '0'
    }, 300, () => {
      $(e).remove();
    });
  }, time * 1000);
}
const message_Message = {
  success: html => message_message(html, 'success'),
  warning: html => message_message(html, 'warning'),
  error: html => message_message(html, 'error'),
  info: html => message_message(html, 'info'),
  miaow: () => message_message('(^・ω・^)~喵喵喵~', 'info')
};
const MessageBox = {
  alert: (html, affirm) => messageBox({
    html,
    callback: {
      affirm
    }
  }, 'alert'),
  confirm: (html, affirm, cancel) => messageBox({
    html,
    callback: {
      affirm,
      cancel
    }
  }, 'confirm')
};

;// ./src/js/utils/ajax.js

function ajax(obj) {
  return new Promise((resolve, reject) => {
    // set obj.success & obj.error
    obj.success = res => {
      if (res && res.code) {
        message_Message.warning(`${res.message || `CODE:${res.code}`}`);
        // todo
      }
      resolve(res);
    };
    obj.error = err => {
      message_Message.error('网络异常');
      reject(err);
    };
    $.ajax(obj);
  });
}
function _ajax(obj) {
  return new Promise((resolve, reject) => {
    const _success = obj.success;
    obj.success = res => {
      resolve(_success ? _success(res) : res);
    };
    const _error = obj.error;
    obj.error = res => {
      reject(_error ? _error(res) : res);
    };
    $.ajax(obj);
  });
}

;// ./src/js/utils/logger.js
// @ts-nocheck

const levels = {
  log: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4
};
let currentLevel = levels['warn']; // 默认日志级别

function setLogLevel(level) {
  if (levels[level] !== undefined) {
    currentLevel = levels[level];
  } else {
    console.warn(`Unknown log level: ${level}`);
  }
}
function getCallerLocation() {
  console.trace();
  const error = new Error();
  const stackLines = error.stack.split('\n');
  for (let i = 2; i < stackLines.length; i++) {
    if (!stackLines[i].includes('umi.js') && !stackLines[i].includes('<anonymous>')) {
      const urlMatch = /at (.*) \((.*):(\d+):(\d+)\)/.exec(stackLines[i]);
      if (urlMatch) {
        const [, func, file, line, column] = urlMatch;
        return `${file}:${line}:${func}:${column}`;
      }
      const simpleMatch = /at (.*):(\d+):(\d+)/.exec(stackLines[i]);
      if (simpleMatch) {
        const [, file, line, column] = simpleMatch;
        return `${file}:${line}:${column}`;
      }
    }
  }
  return 'unknown location';
}
function logMessage(level) {
  if (levels[level] >= currentLevel) {
    const timestamp = new Date().toISOString();
    for (var _len = arguments.length, messages = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      messages[_key - 1] = arguments[_key];
    }
    const formattedMessages = messages.map(message => typeof message === 'object' ? message : message);
    // const location = getCallerLocation();
    console[level](`[${timestamp}] [${level.toUpperCase()}]`, ...formattedMessages);
    if (level === 'error' && messages[0] instanceof Error && messages[0].stack) {
      console[level](messages[0].stack);
    }
  }
}
const Logger = {
  setLogLevel,
  log: function () {
    for (var _len2 = arguments.length, messages = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      messages[_key2] = arguments[_key2];
    }
    return logMessage('log', ...messages);
  },
  debug: function () {
    for (var _len3 = arguments.length, messages = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      messages[_key3] = arguments[_key3];
    }
    return logMessage('debug', ...messages);
  },
  info: function () {
    for (var _len4 = arguments.length, messages = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      messages[_key4] = arguments[_key4];
    }
    return logMessage('info', ...messages);
  },
  warn: function () {
    for (var _len5 = arguments.length, messages = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      messages[_key5] = arguments[_key5];
    }
    return logMessage('warn', ...messages);
  },
  error: function () {
    for (var _len6 = arguments.length, messages = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      messages[_key6] = arguments[_key6];
    }
    return logMessage('error', ...messages);
  }
};
/* harmony default export */ var logger = (Logger);
;// ./src/js/utils/video-base.js



const clazzMap = {};
class VideoBase {
  constructor(video_type, main_title, state) {
    if (!(this.constructor.name in clazzMap)) {
      clazzMap[this.constructor.name] = this.constructor;
    }
    this.video_type = video_type || 'video';
    this.main_title = main_title || '';
    this.state = state;
    // ! state.p
    this.page = state && parseInt(state.p) || 1;
    this.data = {};
  }
  getVideo(p) {
    let prop = {
      p: p,
      id: 0,
      title: '',
      filename: '',
      aid: 0,
      bvid: '',
      cid: 0,
      epid: 0,
      needVip: false,
      vipNeedPay: false,
      isLimited: false
    };
    const clazz = clazzMap[this.constructor.name];
    prop = {
      ...prop,
      ...Object.fromEntries(Object.getOwnPropertyNames(VideoBase.prototype).filter(key => key in prop).map(key => [key, clazz.prototype[key].call(this, p)]))
    };
    return prop;
  }
  type() {
    return this.video_type;
  }
  getName() {
    return this.main_title || '';
  }
  getFilename() {
    return this.getName().replace(/[\/\\:*?"<>|]+/g, '');
  }
  p(p) {
    p = parseInt(p) || 0;
    return p > 0 && p <= this.total() ? p : this.page;
  }
  id(p) {
    return this.p(p) - 1;
  }
  total() {
    return 0;
  }
  title() {
    return '';
  }
  filename() {
    return '';
  }
  aid() {
    return 0;
  }
  bvid() {
    return '';
  }
  cid() {
    return 0;
  }
  epid() {
    return '';
  }
  needVip() {
    return false;
  }
  vipNeedPay() {
    return false;
  }
  isLimited() {
    return false;
  }
  pupdate() {
    return '';
  }
}
class VideoCard extends VideoBase {
  constructor(main_title, state, data) {
    super('video', main_title, state);
    this.state = state;
    // ! state.p
    this.page = state && parseInt(state.p) || 1;
    this.data = data;
  }
  type() {
    return this.video_type;
  }
  getName() {
    return this.main_title || '';
  }
  getFilename() {
    return this.getName().replace(/[\/\\:*?"<>|]+/g, '');
  }
  p(p) {
    p = parseInt(p) || 0;
    return p > 0 && p <= this.total() ? p : this.page;
  }
  id(p) {
    return this.p(p) - 1;
  }
  total() {
    return 0;
  }
  title() {
    return this.main_title;
  }
  filename() {
    return this.main_title;
  }
  aid() {
    var _this$data;
    return (_this$data = this.data) === null || _this$data === void 0 ? void 0 : _this$data.aid;
  }
  bvid() {
    var _this$data2;
    return (_this$data2 = this.data) === null || _this$data2 === void 0 ? void 0 : _this$data2.bvid;
  }
  cid() {
    var _this$data3;
    return (_this$data3 = this.data) === null || _this$data3 === void 0 ? void 0 : _this$data3.cid;
  }
  epid() {
    return '';
  }
  needVip() {
    return false;
  }
  vipNeedPay() {
    return false;
  }
  isLimited() {
    return false;
  }
  pupdate() {
    const date = new Date(this.data.pubdate * 1000); // 转换为毫秒

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 月份是0索引
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  }
}
class Video extends VideoBase {
  constructor(main_title, state) {
    var _state$sectionsInfo;
    super('video', main_title, state);
    this.video_list = []; // todo
    const sections = state.sections || ((_state$sectionsInfo = state.sectionsInfo) === null || _state$sectionsInfo === void 0 ? void 0 : _state$sectionsInfo.sections) || [];
    if (!sections.length) {
      return;
    }
    // ? 集合视频 pageSize = 1
    let new_page = 0,
      i = 1;
    for (const section of sections) {
      const eplist = section.episodes || [];
      for (const ep of eplist) {
        this.video_list.push(ep);
        if (state.videoData.bvid == ep.bvid) {
          new_page = i;
        }
        i++;
      }
    }
    // 处理集合残留
    if (new_page < 1) {
      this.video_list = [];
    } else {
      super.page = new_page;
    }
  }
  total() {
    if (this.video_list.length > 0) {
      return this.video_list.length;
    }
    return this.state.videoData.pages.length;
  }
  title(p) {
    const id = this.id(p);
    if (this.video_list.length > 0) {
      return this.video_list[id].title;
    }
    return this.state.videoData.pages[id].part;
  }
  filename(p) {
    if (this.video_list.length > 0) {
      return this.title(p).replace(/[\/\\:*?"<>|]+/g, '');
    }
    const id = this.id(p);
    let prefix = this.pupdate();
    if (prefix) {
      prefix = `${prefix}-`;
    }
    const title = prefix + this.main_title + (this.total() > 1 ? ` P${id + 1} ${this.state.videoData.pages[id].part || ''}` : '');
    return title.replace(/[\/\\:*?"<>|]+/g, '');
  }
  aid(p) {
    if (this.video_list.length > 0) {
      return this.video_list[this.id(p)].aid;
    }
    return this.state.videoData.aid;
  }
  bvid(p) {
    if (this.video_list.length > 0) {
      return this.video_list[this.id(p)].bvid;
    }
    return this.state.videoData.bvid;
  }
  cid(p) {
    if (this.video_list.length > 0) {
      return this.video_list[this.id(p)].cid;
    }
    return this.state.videoData.pages[this.id(p)].cid;
  }
  pupdate() {
    try {
      var _this$state;
      const date = new Date(((_this$state = this.state) === null || _this$state === void 0 || (_this$state = _this$state.videoData) === null || _this$state === void 0 ? void 0 : _this$state.pubdate) * 1000); // 转换为毫秒

      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0'); // 月份是0索引
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}${mm}${dd}`;
    } catch (error) {
      return "";
    }
  }
}
class VideoList extends VideoBase {
  constructor(main_title, state) {
    super('video', main_title, state);
    this.video = new Video(state.videoData.title, state);
    const resourceList = state.resourceList || [];
    const video_list = [];
    for (const video of resourceList) {
      let i = 0,
        length = video.pages && video.pages.length || 0;
      while (i < length) {
        const _video = Object.assign({}, video);
        _video.title = video.title + (length > 1 ? ` P${i + 1} ${video.pages[i].title}` : '');
        _video.cid = video.pages[i].cid || 0;
        video_list.push(_video);
        i++;
      }
    }
    this.video_list = video_list;
  }
  total() {
    return this.video_list.length;
  }
  title(p) {
    return !p ? this.video.title() : this.video_list[this.id(p)].title;
  }
  filename(p) {
    if (!p) {
      return this.video.filename();
    }
    const id = this.id(p);
    const title = this.main_title + (this.total() > 1 ? ` P${id + 1} ${this.video_list[id].title}` : '');
    return title.replace(/[\/\\:*?"<>|]+/g, '');
  }
  aid(p) {
    return !p ? this.video.aid() : this.video_list[this.id(p)].aid;
  }
  bvid(p) {
    return !p ? this.video.bvid() : this.video_list[this.id(p)].bvid;
  }
  cid(p) {
    return !p ? this.video.cid() : this.video_list[this.id(p)].cid;
  }
}
class VideoFestival extends VideoBase {
  constructor(main_title, state) {
    super('video', main_title, state);
    this.video_info = state.videoInfo;
    this.video_list = state.sectionEpisodes || [];
  }
  total() {
    return this.video_list.length;
  }
  title(p) {
    return !p ? this.video_info.title : this.video_list[this.id(p)].title;
  }
  filename(p) {
    let title;
    if (!p) {
      title = this.video_info.title;
    } else {
      const id = this.id(p);
      title = this.main_title + (this.total() > 1 ? ` P${id + 1} ${this.video_list[id].title}` : '');
    }
    return title.replace(/[\/\\:*?"<>|]+/g, '');
  }
  aid(p) {
    return !p ? this.video_info.aid : this.video_list[this.id(p)].id;
  }
  bvid(p) {
    return !p ? this.video_info.bvid : this.video_list[this.id(p)].bvid;
  }
  cid(p) {
    return !p ? this.video_info.cid : this.video_list[this.id(p)].cid;
  }
}
class Bangumi extends VideoBase {
  constructor(main_title, state) {
    super('bangumi', main_title, state);
    this.epInfo = state.epInfo;
    this.epList = state.epList;
    this.epId = state.epId;
    this.epMap = state.epMap;
    this.isEpMap = state.isEpMap;
    // this.mediaInfo = state.mediaInfo
  }
  static build() {
    // ! state: {p, mediaInfo, epList, epId, epMap, epInfo}
    const bangumiCache = cache.get('Bangumi');
    if (location.href == bangumiCache.get('href') && !!bangumiCache.get('build')) {
      return bangumiCache.get('build');
    }
    bangumiCache.set('build', null);
    let main_title,
      sid,
      epid,
      epMap = {};
    const pathname = location.pathname.toLowerCase();
    if (pathname.startsWith('/bangumi/play/ss')) {
      sid = pathname.match(/ss(\d+)/);
      sid = parseInt(sid[1]);
    } else if (pathname.startsWith('/bangumi/play/ep')) {
      epid = pathname.match(/ep(\d+)/);
      epid = parseInt(epid[1]);
    }
    try {
      logger.debug('location sid:', sid, 'epid:', epid);
      const page_data = JSON.parse($('.toolbar').attr('mr-show'));
      main_title = page_data.msg.title;
      sid = sid || page_data.msg.season_id;
      epid = epid || page_data.msg.ep_id;
      logger.debug('mr-show get sid:', sid, 'epid:', epid);
    } catch {
      console.warn('mr-show get err');
    }
    if (sid != bangumiCache.get('sid')) {
      bangumiCache.set('sid', sid);
      bangumiCache.set('epid', '');
      bangumiCache.set('hasData', false);
    }
    if (!!sid && !epid) {
      _ajax({
        type: 'GET',
        url: `https://api.bilibili.com/pgc/player/web/v2/playurl?support_multi_audio=true&qn=80&fnver=0&fnval=4048&fourk=1&gaia_source=&from_client=BROWSER&is_main_page=true&need_fragment=true&season_id=${sid}&isGaiaAvoided=false&voice_balance=1&drm_tech_type=2`,
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        }
      }).then(res => {
        if (res && !res.code) {
          bangumiCache.set('epid', res.result.view_info.report.ep_id);
        }
      });
    }
    if (bangumiCache.get('lock')) {
      throw 'bangumiCache request waiting !';
    }
    bangumiCache.set('lock', true);
    sid = sid || '';
    epid = epid || '';
    _ajax({
      type: 'GET',
      url: `https://api.bilibili.com/pgc/view/web/ep/list?season_id=${sid}&ep_id=${epid}`,
      dataType: 'json',
      cache: true
    }).then(res => {
      if (res && !res.code) {
        bangumiCache.set('hasData', true);
        bangumiCache.set('episodes', res.result.episodes || []);
        bangumiCache.set('section', res.result.section || []);
      }
    }).finally(() => {
      bangumiCache.set('lock', false);
    });
    bangumiCache.set('href', location.href);
    if (!epid && !bangumiCache.get('epid')) {
      throw 'epid not found !';
    }
    if (!bangumiCache.get('hasData')) {
      throw 'bangumiCache no data !';
    }
    let episodes = bangumiCache.get('episodes') || [];
    // 预告移后
    episodes = [...episodes.filter(a => a.badge_type != 1), ...episodes.filter(a => a.badge_type == 1)];
    // 标记正片
    const isEpMap = {};
    for (const ep of episodes) {
      if ([0, 2, 3].includes(ep.badge_type)) {
        isEpMap[ep.id] = true;
      }
    }
    // 追加 section
    const section = bangumiCache.get('section') || [];
    for (const item of section) {
      if (!item.episodes) {
        continue;
      }
      for (const ep of item.episodes) {
        episodes.push(ep);
      }
    }
    epid = epid || bangumiCache.get('epid');
    let _id = 0;
    for (let i = 0; i < episodes.length; i++) {
      epMap[episodes[i].id] = episodes[i];
      if (episodes[i].id == epid) {
        _id = i;
      }
    }
    const state = {
      p: _id + 1,
      epId: epid,
      epList: episodes,
      isEpMap,
      epMap,
      epInfo: epMap[epid]
    };
    const bangumi = new Bangumi(main_title, state);
    bangumiCache.set('build', bangumi);
    return bangumi;
  }
  total() {
    return this.epList.length;
  }
  getEpisode(p) {
    return p ? this.epList[this.id(p)] : this.epMap[this.epId] || this.epInfo || {};
  }
  getEpPadLen() {
    let n = Object.keys(this.isEpMap).length,
      len = n < 10 ? 1 : 0;
    while (n >= 1) {
      n = n / 10;
      len++;
    }
    return len;
  }
  title(p) {
    const ep = this.getEpisode(p);
    let title = '';
    if (this.isEpMap[ep.id]) {
      const epNum = Object.keys(this.isEpMap).length > 1 ? `EP${('' + this.p(p)).padStart(this.getEpPadLen(), '0')}` : '';
      title = `${this.main_title} ${epNum} ${ep.long_title}`;
    } else {
      // title long_title 可能不准确
      if (ep.share_copy) {
        title = ep.share_copy.split('》', 2);
        if (title.length > 1) {
          title = `${this.main_title} ${title[1]}`;
        } else {
          title = `${this.main_title} ${ep.title} ${ep.long_title}`;
        }
      } else {
        title = `${ep.title} ${ep.long_title}`;
      }
    }
    return title.replaceAll('undefined', '').replaceAll('  ', ' ').trim();
  }
  filename(p) {
    return this.title(p).replace(/[\/\\:*?"<>|]+/g, '');
  }
  aid(p) {
    const ep = this.getEpisode(p);
    return ep.aid;
  }
  bvid(p) {
    const ep = this.getEpisode(p);
    return ep.bvid;
  }
  cid(p) {
    const ep = this.getEpisode(p);
    return ep.cid;
  }
  epid(p) {
    const ep = this.getEpisode(p);
    return ep.id;
  }
  needVip(p) {
    const ep = this.getEpisode(p);
    return ep.badge === '会员';
  }
  vipNeedPay(p) {
    const ep = this.getEpisode(p);
    return ep.badge === '付费';
  }
  isLimited() {
    // todo
    return false;
  }
}
class Cheese extends VideoBase {
  constructor(main_title, state) {
    super('cheese', main_title, state);
    this.episodes = state.episodes;
  }
  static build() {
    const cheeseCache = cache.get('Cheese');
    const sid = (location.href.match(/\/cheese\/play\/ss(\d+)/i) || ['', ''])[1];
    let epid;
    if (!sid) {
      epid = (location.href.match(/\/cheese\/play\/ep(\d+)/i) || ['', ''])[1];
    }
    if (!epid) {
      epid = parseInt($('.bpx-state-active').eq(0).attr('data-episodeid'));
    }
    if (!!sid && sid != cheeseCache.get('sid')) {
      cheeseCache.set('sid', sid);
      cheeseCache.set('episodes', null);
    }
    if (!cheeseCache.get('episodes')) {
      if (cheeseCache.get('lock')) {
        throw 'cheese request waiting !';
      }
      cheeseCache.set('lock', true);
      if (!sid && !epid) {
        logger.error('get_season error');
        return;
      }
      _ajax({
        url: `https://api.bilibili.com/pugv/view/web/season?season_id=${sid || ''}&ep_id=${epid || ''}`,
        xhrFields: {
          withCredentials: true
        },
        dataType: 'json'
      }).then(res => {
        if (res.code) {
          Message.warning('获取剧集信息失败');
          return;
        }
        cheeseCache.set('episodes', res.data.episodes);
      }).finally(() => {
        cheeseCache.set('lock', false);
      });
    }
    const episodes = cheeseCache.get('episodes');
    if (!episodes) {
      throw 'cheese has not data !';
    }
    let _id = -1;
    for (let i = 0; i < episodes.length; i++) {
      if (!epid) {
        epid = episodes[i].id;
        _id = 0;
        break;
      }
      if (episodes[i].id == epid) {
        _id = i;
        break;
      }
    }
    if (_id < 0) {
      cheeseCache.set('episodes', null);
      throw 'episodes need reload !';
    }
    const main_title = ($('div.archive-title-box').text() || 'unknown').replace(/[\/\\:*?"<>|]+/g, '');
    const state = {
      p: _id + 1,
      episodes
    };
    return new Cheese(main_title, state);
  }
  total() {
    return this.episodes.length;
  }
  title(p) {
    return this.episodes[this.id(p)].title;
  }
  filename(p) {
    return `${this.main_title} EP${this.p(p)} ${this.title(p)}`.replace(/[\/\\:*?"<>|]+/g, '');
  }
  aid(p) {
    return this.episodes[this.id(p)].aid;
  }
  cid(p) {
    return this.episodes[this.id(p)].cid;
  }
  epid(p) {
    return this.episodes[this.id(p)].id;
  }
}

;// ./src/js/utils/video.js



function type() {
  const routerMap = {
    video: /^\/video\//,
    list: /^\/list\//,
    festival: /^\/festival\//,
    bangumi: /^\/bangumi\/play\//,
    cheese: /^\/cheese\/play\//,
    card: /\/upload\/video/
  };
  for (const key in routerMap) {
    if (routerMap[key].test(location.pathname)) {
      return key;
    }
  }
  return '?';
}
function base() {
  const _type = type();
  let vb = new VideoBase();
  if (_type === 'card') {
    vb = new VideoCard('video');
  } else if (_type === 'video') {
    const state = window.__INITIAL_STATE__;
    const main_title = state.videoData && state.videoData.title;
    vb = new Video(main_title, state);
  } else if (_type === 'list') {
    const state = window.__INITIAL_STATE__;
    const main_title = state.mediaListInfo && state.mediaListInfo.upper.name + '-' + state.mediaListInfo.title;
    vb = new VideoList(main_title, state);
  } else if (_type === 'festival') {
    const state = window.__INITIAL_STATE__;
    const main_title = state.title;
    vb = new VideoFestival(main_title, state);
  } else if (_type === 'bangumi') {
    vb = Bangumi.build();
  } else if (_type === 'cheese') {
    // todo

    vb = Cheese.build();
  }
  return vb;
}
async function card() {
  let bvid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  const res = await $.ajax({
    type: 'GET',
    url: `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
    dataType: 'json',
    xhrFields: {
      withCredentials: true
    }
  });
  const data = res.code ? {} : res.data;
  return new VideoCard(data.title, data, data);
}
const q_map = {
  '8K 超高清': 127,
  '4K 超清': 120,
  '1080P 60帧': 116,
  '1080P 高码率': 112,
  '1080P 高清': 80,
  '720P 高清': 64,
  '480P 清晰': 32,
  '360P 流畅': 16,
  '自动': 32
};
function get_quality() {
  let _q = 0,
    _q_max = 0;
  const _type = type();
  if (_type === 'cheese') {
    const q = $('div.edu-player-quality-item.active span').text();
    const q_max = $($('div.edu-player-quality-item span').get(0)).text();
    _q = q in q_map ? q_map[q] : 0;
    _q_max = q_max in q_map ? q_map[q_max] : 0;
  } else {
    const keys = Object.keys(videoQualityMap);
    const q = parseInt((_type === 'video' ? $('li.bpx-player-ctrl-quality-menu-item.bpx-state-active') : $('li.squirtle-select-item.active')).attr('data-value'));
    const q_max = parseInt($((_type === 'video' ? $('li.bpx-player-ctrl-quality-menu-item') : $('li.squirtle-select-item')).get(0)).attr('data-value'));
    _q = keys.indexOf(`${q}`) > -1 ? q : 0;
    _q_max = keys.indexOf(`${q_max}`) > -1 ? q_max : 0;
  }
  !_q && (_q = 80);
  !_q_max && (_q_max = 80);
  if (!user.isVIP()) {
    _q = _q > 80 ? 80 : _q;
  }
  return {
    q: _q,
    q_max: _q_max
  };
}
function get_quality_support() {
  let list,
    quality_list = [];
  const _type = type();
  if (_type === 'cheese') {
    list = $('div.edu-player-quality-item span');
    list.each(function () {
      const k = $(this).text();
      if (q_map[k]) {
        quality_list.push(q_map[k]);
      }
    });
  } else {
    const keys = Object.keys(videoQualityMap);
    list = ['video', 'list'].includes(_type) ? $('li.bpx-player-ctrl-quality-menu-item') : $('li.squirtle-select-item');
    if (list && list.length) {
      list.each(function () {
        const q = `${parseInt($(this).attr('data-value'))}`;
        if (keys.indexOf(q) > -1) {
          quality_list.push(q);
        }
      });
    }
  }
  return quality_list.length ? quality_list : ['80', '64', '32', '16'];
}
const video = {
  type,
  base,
  card,
  get_quality,
  get_quality_support
};
;// ./src/js/store.js
class Store {
  constructor() {
    this.prefix = 'bp_';
  }
  get() {
    let key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return localStorage.getItem(this.prefix + key) || '';
  }
  set() {
    let key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let value = arguments.length > 1 ? arguments[1] : undefined;
    localStorage.setItem(this.prefix + key, value);
  }
}
const store = new Store();
;// ./src/js/utils/api.js







function get_url_base(page, quality, video_format, success, error, request_type) {
  let _success, _error;
  if ('function' === typeof success) {
    _success = e => {
      // todo
      success(e);
    };
  } else {
    _success = res => logger.debug(res);
  }
  if ('function' === typeof error) {
    _error = e => {
      message_Message.error('请求失败');
      error(e);
    };
  } else {
    _error = err => console.error(err);
  }
  const vb = video.base();
  const [aid, bvid, cid, epid, q, type] = [vb.aid(page), vb.bvid(page), vb.cid(page), vb.epid(page), quality || video.get_quality().q, vb.type()];

  // 参数预处理
  let format = video_format || config_config.format;
  if (request_type === 'auto' && user.needReplace()) request_type = 'remote';
  const url_replace_cdn = url => {
    if (config_config.host_key === '0') {
      return url;
    }
    // 全部切换CDN
    const url_tmp = url.split('/');
    const mapping = hostMap[config_config.host_key];
    if ('string' === typeof mapping && mapping.length) {
      if (mapping.at(0).match(/[a-z]/)) {
        url_tmp[2] = mapping;
      }
    } else if ('function' === typeof mapping) {
      url_tmp[2] = mapping();
    }
    url = url_tmp.join('/');
    return url;
  };
  let base_api;
  const ajax_obj = {
    type: 'GET',
    dataType: 'json'
  };
  if (request_type === 'auto' || request_type === 'local') {
    let fnver, fnval;
    if (type === 'cheese') {
      base_api = 'https://api.bilibili.com/pugv/player/web/playurl';
      fnver = format === 'mp4' ? 1 : 0;
      fnval = 80;
    } else {
      base_api = type === 'video' ? 'https://api.bilibili.com/x/player/playurl' : 'https://api.bilibili.com/pgc/player/web/playurl';
      fnver = 0;
      fnval = {
        dash: 4048,
        flv: 4049,
        mp4: 0
      }[format] || 0;
    }
    base_api += `?avid=${aid}&bvid=${bvid}&cid=${cid}&qn=${q}&fnver=${fnver}&fnval=${fnval}&fourk=1&ep_id=${epid}&type=${format}&otype=json`;
    base_api += format === 'mp4' ? '&platform=html5&high_quality=1' : '';
    ajax_obj.xhrFields = {
      withCredentials: true
    };
  } else {
    base_api = config_config.base_api;
    base_api += `?av=${aid}&bv=${bvid}&cid=${cid}&ep=${epid}&q=${q}&type=${type}&format=${format}&otype=json`;
    !!page && (base_api += '&s');
    const [auth_id, auth_sec] = [store.get('auth_id'), store.get('auth_sec')];
    if (auth_id && auth_sec) {
      base_api += `&auth_id=${auth_id}&auth_sec=${auth_sec}`;
    }
  }
  const resultConvertor = (data, _success) => {
    // 判断地址有效性
    const checkTask = (key, backup_key) => {
      if (!data[backup_key]) {
        return Promise.resolve(key);
      }
      return _ajax({
        type: 'GET',
        url: data[key],
        cache: false,
        timeout: 1000,
        success: function (res) {
          return key;
        },
        error: function (res) {
          if (res.statusText == 'timeout') {
            return key;
          } else {
            // back_url
            return backup_key;
          }
        }
      });
    };
    new Promise((resolve, reject) => {
      const promiseList = [];
      const valueList = [];
      if (data.url) {
        promiseList.push(checkTask('url', 'backup_url'));
      } else {
        promiseList.push(checkTask('video', 'backup_video'));
        promiseList.push(checkTask('audio', 'backup_audio'));
      }
      const timer = setTimeout(() => {
        resolve(valueList);
      }, 1500);
      let index = 0;
      promiseList.forEach(async promise => {
        let result;
        try {
          result = await promise;
        } catch (error) {
          result = error;
        }
        logger.info('use ' + result);
        valueList[index++] = result;
        if (index == promiseList.length) {
          clearInterval(timer);
          resolve(valueList);
        }
      });
    }).then(resList => {
      logger.info('use data key: ', resList);
      if (!resList) {
        return;
      }
      resList = [...resList];
      for (const key of resList) {
        if (!data[key]) continue;
        if (['url', 'backup_url'].includes(key)) {
          data.url = data[key];
        } else if (['video', 'backup_video'].includes(key)) {
          data.video = data[key];
        } else if (['audio', 'backup_audio'].includes(key)) {
          data.audio = data[key];
        }
      }
    }).finally(() => {
      _success(data);
    });
  };
  ajax_obj.url = base_api;
  ajax(ajax_obj).then(res => {
    let data;
    if (!res.code) {
      data = res.result || res.data;
    }
    if (!data) {
      if (request_type === 'auto') {
        get_url_base(page, quality, video_format, success, error, 'remote');
        return;
      }
      // remote
      res.url && (res.url = url_replace_cdn(res.url));
      res.video && (res.video = url_replace_cdn(res.video));
      res.audio && (res.audio = url_replace_cdn(res.audio));
      // _success(res)
      resultConvertor(res, _success);
      return;
    }

    // local
    if (data.dash) {
      const result = {
        code: 0,
        quality: data.quality,
        accept_quality: data.accept_quality,
        video: '',
        audio: ''
      };
      const videos = data.dash.video;
      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        if (video.id <= q) {
          result.video = url_replace_cdn(video.base_url);
          result.audio = url_replace_cdn(data.dash.audio[0].base_url);
          result.backup_video = video.backup_url && url_replace_cdn(video.backup_url[0]);
          result.backup_audio = data.dash.audio[0].backup_url && url_replace_cdn(data.dash.audio[0].backup_url[0]);
          break;
        }
      }
      resultConvertor(result, _success);
      return;
    }

    // durl
    resultConvertor({
      code: 0,
      quality: data.quality,
      accept_quality: data.accept_quality,
      url: url_replace_cdn(data.durl[0].url),
      backup_url: data.durl[0].backup_url && url_replace_cdn(data.durl[0].backup_url[0])
    }, _success);
  }).catch(err => _error(err));
}
function _get_subtitle(p, callback) {
  let to_blob_url = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  const vb = video.base();
  const [aid, cid, epid] = [vb.aid(p), vb.cid(p), vb.epid(p)];
  ajax({
    url: `https://api.bilibili.com/x/player/v2?aid=${aid}&cid=${cid}&ep_id=${epid}`,
    dataType: 'json'
  }).then(res => {
    // todo
    if (!res.code && res.data.subtitle.subtitles[0]) {
      ajax({
        url: `${res.data.subtitle.subtitles[0].subtitle_url}`,
        dataType: 'json'
      }).then(res => {
        // json -> webvtt -> blob_url
        const datas = res.body || [{
          from: 0,
          to: 0,
          content: ''
        }];
        let webvtt = 'WEBVTT\n\n';
        for (let data of datas) {
          const a = new Date((parseInt(data.from) - 8 * 60 * 60) * 1000).toTimeString().split(' ')[0] + '.' + (data.from.toString().split('.')[1] || '000').padEnd(3, '0');
          const b = new Date((parseInt(data.to) - 8 * 60 * 60) * 1000).toTimeString().split(' ')[0] + '.' + (data.to.toString().split('.')[1] || '000').padEnd(3, '0');
          webvtt += `${a} --> ${b}\n${data.content.trim()}\n\n`;
        }
        if (to_blob_url) {
          callback(URL.createObjectURL(new Blob([webvtt], {
            type: 'text/vtt'
          })));
        } else {
          callback(webvtt);
        }
      }).catch(callback);
    } else {
      callback();
    }
  }).catch(callback);
}
function get_subtitle_data(p, callback) {
  _get_subtitle(p, callback, false);
}
function get_subtitle_url(p, callback) {
  _get_subtitle(p, callback, true);
}
function get_card_url_base(vb, page, quality, video_format, success, error, request_type) {
  let _success, _error;
  if ('function' === typeof success) {
    _success = e => {
      // todo
      success(e);
    };
  } else {
    _success = res => logger.debug(res);
  }
  if ('function' === typeof error) {
    _error = e => {
      message_Message.error('请求失败');
      error(e);
    };
  } else {
    _error = err => console.error(err);
  }
  const [aid, bvid, cid, epid, q, type] = [vb.aid(page), vb.bvid(page), vb.cid(page), vb.epid(page), quality || video.get_quality().q || 80, vb.type()];

  // 参数预处理
  let format = video_format || config_config.format;
  if (request_type === 'auto' && user.needReplace()) request_type = 'remote';
  const url_replace_cdn = url => {
    if (config_config.host_key === '0') {
      return url;
    }
    // 全部切换CDN
    const url_tmp = url.split('/');
    const mapping = hostMap[config_config.host_key];
    if ('string' === typeof mapping && mapping.length) {
      if (mapping.at(0).match(/[a-z]/)) {
        url_tmp[2] = mapping;
      }
    } else if ('function' === typeof mapping) {
      url_tmp[2] = mapping();
    }
    url = url_tmp.join('/');
    return url;
  };
  let base_api;
  const ajax_obj = {
    type: 'GET',
    dataType: 'json'
  };
  if (request_type === 'auto' || request_type === 'local') {
    let fnver, fnval;
    if (type === 'cheese') {
      base_api = 'https://api.bilibili.com/pugv/player/web/playurl';
      fnver = format === 'mp4' ? 1 : 0;
      fnval = 80;
    } else {
      base_api = type === 'video' ? 'https://api.bilibili.com/x/player/playurl' : 'https://api.bilibili.com/pgc/player/web/playurl';
      fnver = 0;
      fnval = {
        dash: 4048,
        flv: 4049,
        mp4: 0
      }[format] || 0;
    }
    base_api += `?avid=${aid}&bvid=${bvid}&cid=${cid}&qn=${q}&fnver=${fnver}&fnval=${fnval}&fourk=1&ep_id=${epid}&type=${format}&otype=json`;
    base_api += format === 'mp4' ? '&platform=html5&high_quality=1' : '';
    ajax_obj.xhrFields = {
      withCredentials: true
    };
  } else {
    base_api = config_config.base_api;
    base_api += `?av=${aid}&bv=${bvid}&cid=${cid}&ep=${epid}&q=${q}&type=${type}&format=${format}&otype=json`;
    !!page && (base_api += '&s');
    const [auth_id, auth_sec] = [store.get('auth_id'), store.get('auth_sec')];
    if (auth_id && auth_sec) {
      base_api += `&auth_id=${auth_id}&auth_sec=${auth_sec}`;
    }
  }
  const resultConvertor = (data, _success) => {
    // 判断地址有效性
    const checkTask = (key, backup_key) => {
      if (!data[backup_key]) {
        return Promise.resolve(key);
      }
      return _ajax({
        type: 'GET',
        url: data[key],
        cache: false,
        timeout: 1000,
        success: function (res) {
          return key;
        },
        error: function (res) {
          if (res.statusText == 'timeout') {
            return key;
          } else {
            // back_url
            return backup_key;
          }
        }
      });
    };
    new Promise((resolve, reject) => {
      const promiseList = [];
      const valueList = [];
      if (data.url) {
        promiseList.push(checkTask('url', 'backup_url'));
      } else {
        promiseList.push(checkTask('video', 'backup_video'));
        promiseList.push(checkTask('audio', 'backup_audio'));
      }
      const timer = setTimeout(() => {
        resolve(valueList);
      }, 1500);
      let index = 0;
      promiseList.forEach(async promise => {
        let result;
        try {
          result = await promise;
        } catch (error) {
          result = error;
        }
        logger.debug('use ' + result);
        valueList[index++] = result;
        if (index == promiseList.length) {
          clearInterval(timer);
          resolve(valueList);
        }
      });
    }).then(resList => {
      logger.debug('use data key: ', resList);
      if (!resList) {
        return;
      }
      resList = [...resList];
      for (const key of resList) {
        if (!data[key]) continue;
        if (['url', 'backup_url'].includes(key)) {
          data.url = data[key];
        } else if (['video', 'backup_video'].includes(key)) {
          data.video = data[key];
        } else if (['audio', 'backup_audio'].includes(key)) {
          data.audio = data[key];
        }
      }
    }).finally(() => {
      _success(data);
    });
  };
  ajax_obj.url = base_api;
  ajax(ajax_obj).then(res => {
    let data;
    if (!res.code) {
      data = res.result || res.data;
    }
    if (!data) {
      if (request_type === 'auto') {
        get_url_base(page, quality, video_format, success, error, 'remote');
        return;
      }
      // remote
      res.url && (res.url = url_replace_cdn(res.url));
      res.video && (res.video = url_replace_cdn(res.video));
      res.audio && (res.audio = url_replace_cdn(res.audio));
      // _success(res)
      resultConvertor(res, _success);
      return;
    }

    // local
    if (data.dash) {
      const result = {
        code: 0,
        quality: data.quality,
        accept_quality: data.accept_quality,
        video: '',
        audio: ''
      };
      const videos = data.dash.video;
      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        if (video.id <= q) {
          result.video = url_replace_cdn(video.base_url);
          result.audio = url_replace_cdn(data.dash.audio[0].base_url);
          result.backup_video = video.backup_url && url_replace_cdn(video.backup_url[0]);
          result.backup_audio = data.dash.audio[0].backup_url && url_replace_cdn(data.dash.audio[0].backup_url[0]);
          break;
        }
      }
      resultConvertor(result, _success);
      return;
    }

    // durl
    resultConvertor({
      code: 0,
      quality: data.quality,
      accept_quality: data.accept_quality,
      url: url_replace_cdn(data.durl[0].url),
      backup_url: data.durl[0].backup_url && url_replace_cdn(data.durl[0].backup_url[0])
    }, _success);
  }).catch(err => _error(err));
}
const api = {
  get_url(success, error) {
    const request_type = config_config.request_type;
    const format = config_config.format;
    const quality = parseInt(config_config.video_quality);
    get_url_base(0, quality, format, success, error, request_type);
  },
  get_urls(page, quality, format, success, error) {
    const request_type = config_config.request_type;
    get_url_base(page, quality, format, success, error, request_type);
  },
  get_card_url(vb, success, error) {
    const request_type = config_config.request_type;
    const format = config_config.format;
    const quality = parseInt(config_config.video_quality);
    get_card_url_base(vb, 0, quality, format, success, error, request_type);
  },
  get_subtitle_url,
  get_subtitle_data
};
;// ./src/js/utils/runtime-lib.js


class RuntimeLib {
  constructor(config) {
    this.config = config;
    this.moduleAsync;
    this.anyResolved = false;
  }
  getModulePromise() {
    const {
      urls,
      getModule
    } = this.config;
    const errs = [];
    return new Promise((resolve, reject) => {
      let i = 0;
      urls.forEach(url => {
        // 延时并发
        setTimeout(async () => {
          try {
            if (this.anyResolved) return;
            logger.debug(`[Runtime Library] Start download from ${url}`);
            const code = await _ajax({
              url,
              type: 'GET',
              dataType: 'text',
              cache: true
            });
            if (this.anyResolved) return;
            logger.debug(`[Runtime Library] Downloaded from ${url} , length = ${code.length}`);
            this.anyResolved = true;
            resolve(code);
          } catch (err) {
            if (this.anyResolved) return;
            errs.push({
              url,
              err
            });
            if (--i === 0) {
              console.error(errs);
              reject(errs);
            }
          }
        }, i++ * 1000);
      });
    });
  }
}
const cdn_map = {
  cloudflare: (name, ver, filename) => `https://cdnjs.cloudflare.com/ajax/libs/${name}/${ver}/${filename}`,
  bootcdn: (name, ver, filename) => `https://cdn.bootcdn.net/ajax/libs/${name}/${ver}/${filename}`,
  jsdelivr: (name, ver, filename) => `https://cdn.jsdelivr.net/npm/${name}@${ver}/${filename}`,
  staticfile: (name, ver, filename) => `https://cdn.staticfile.org/${name}/${ver}/${filename}`
};
const urls = _ref => {
  let {
    name,
    ver,
    filename,
    cdn_keys
  } = _ref;
  cdn_keys = cdn_keys ? cdn_keys.filter(key => key in cdn_map) : Object.keys(cdn_map);
  return cdn_keys.map(k => cdn_map[k](name, ver, filename));
};

// 使用iframe异步加载，隔离window
const runtime_div = document.createElement('div');
runtime_div.id = 'bp_runtime_div';
runtime_div.style.display = 'none';
if (!document.getElementById(runtime_div.id)) {
  document.body.appendChild(runtime_div);
}
const iframeInvoke = (scripts, getModules) => {
  logger.debug('[Runtime Library] iframe invoke scripts, size =', scripts.length);
  // ! html
  const scriptTags = scripts.map(code => `<script>${code}</script>`).join('');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Runtime Library</title></head><body>${scriptTags}</body></html>`;
  const blobUrl = URL.createObjectURL(new Blob([html], {
    type: 'text/html'
  }));
  const iframe = document.createElement('iframe');
  const clearIframe = () => {
    clearTimeout(timeoutId);
    URL.revokeObjectURL(blobUrl);
    iframe.remove();
  };
  const timeoutId = setTimeout(() => {
    // 超时处理
    console.error('[Runtime Library] Script loading timed out');
    clearIframe();
  }, 10000);
  iframe.src = blobUrl;
  iframe.onload = () => {
    logger.debug('[Runtime Library] Script loaded in iframe');
    for (const getModule of getModules) {
      try {
        getModule(iframe.contentWindow);
      } catch (err) {
        console.error('[Runtime Library] Error in getModule:', err);
      }
    }
    clearIframe();
  };
  iframe.onerror = () => {
    console.error('[Runtime Library] Failed to load script in iframe');
    clearIframe();
  };
  runtime_div.appendChild(iframe);
};
let count = 0;
const scripts = [],
  getModules = [];
const initIframe = (name, ver, filename, getModule) => {
  count++;
  new RuntimeLib({
    urls: urls({
      name,
      ver,
      filename
    }),
    getModule
  }).getModulePromise().then(script => {
    scripts.push(script);
    getModules.push(getModule);
  }).catch(err => {
    console.error(`[Runtime Library] Failed to load ${name} from CDN`, err);
  }).finally(() => {
    if (--count === 0) {
      iframeInvoke(scripts, getModules);
      logger.debug('[Runtime Library] iframe invoke complete');
    }
  });
};
const initLocal = (name, ver, filename, getModule, handleScript) => {
  handleScript = handleScript || (script => script);
  new RuntimeLib({
    urls: urls({
      name,
      ver,
      filename
    }),
    getModule
  }).getModulePromise().then(script => {
    const blob = new Blob([handleScript(script)], {
      type: 'text/javascript'
    });
    const blob_url = URL.createObjectURL(blob);
    const script_tag = document.createElement('script');
    script_tag.src = blob_url;
    script_tag.onload = () => {
      logger.debug(`[Runtime Library] Loaded ${name} from local`);
      getModule(window);
      URL.revokeObjectURL(blob_url);
    };
    script_tag.onerror = () => {
      console.error(`[Runtime Library] Failed to load ${name} from local`);
      URL.revokeObjectURL(blob_url);
    };
    runtime_div.appendChild(script_tag);
  }).catch(err => {
    console.error(`[Runtime Library] Failed to load ${name} from local`, err);
  });
};
let JSZip;
initIframe('jszip', '3.10.0', 'jszip.min.js', w => JSZip = w.JSZip);
let flvjs;
initIframe('flv.js', '1.6.2', 'flv.min.js', w => flvjs = w.flvjs);
let DPlayer;
initLocal('dplayer', '1.26.0', 'DPlayer.min.js', w => DPlayer = w.DPlayer, script => script.replace('"About author"', '"About DIYgod"'));
let QRCode;
initIframe('qrcodejs', '1.0.0', 'qrcode.min.js', w => QRCode = w.QRCode);
let md5;
initIframe('blueimp-md5', '2.19.0', 'js/md5.min.js', w => md5 = w.md5);
;// ./src/js/utils/player.js






function get_bili_player_id() {
  if (!!$('#bilibiliPlayer')[0]) {
    return '#bilibiliPlayer';
  } else if (!!$('#bilibili-player')[0]) {
    return '#bilibili-player';
  } else if (!!$('#edu-player')[0]) {
    return 'div.bpx-player-primary-area';
  }
}
function request_danmaku(options, cid) {
  if (!cid) {
    options.error('cid未知，无法获取弹幕');
    return;
  }
  ajax({
    url: `https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}`,
    dataType: 'text'
  }).then(result => {
    const result_dom = $(result.replace(/[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f]/g, ''));
    if (!result_dom) {
      options.error('弹幕获取失败');
      return;
    }
    if (!result_dom.find('d')[0]) {
      options.error('未发现弹幕');
    } else {
      const danmaku_data = result_dom.find('d').map((i, el) => {
        const item = $(el);
        const p = item.attr('p').split(',');
        let type = 0;
        if (p[1] === '4') {
          type = 2;
        } else if (p[1] === '5') {
          type = 1;
        }
        return [{
          author: '',
          time: parseFloat(p[0]),
          type: type,
          color: parseInt(p[3]),
          id: '',
          text: item.text()
        }];
      }).get();
      options.success(danmaku_data);
      // 加载弹幕设置
      setTimeout(() => {
        danmaku_config();
      }, 100);
    }
  }).catch(() => {
    options.error('弹幕请求异常');
  });
}
function replace_player(url, url_2) {
  // 恢复原视频
  recover_player();
  // 暂停原视频
  const bili_video = $(bili_video_tag())[0];
  bili_video_stop();
  !!bili_video && bili_video.addEventListener('play', bili_video_stop, false);
  let bili_player_id = get_bili_player_id();
  if (!!$('#bilibiliPlayer')[0]) {
    $(bili_player_id).before('<div id="bp_dplayer" class="bilibili-player relative bilibili-player-no-cursor">');
    $(bili_player_id).hide();
  } else if (!!$('#bilibili-player')[0]) {
    $(bili_player_id).before('<div id="bp_dplayer" class="bilibili-player relative bilibili-player-no-cursor" style="width:100%;height:100%;z-index:1000;"></div>');
    $(bili_player_id).hide();
  } else if (!!$('#edu-player')[0]) {
    $(bili_player_id).before('<div id="bp_dplayer" style="width:100%;height:100%;z-index:1000;"></div>');
    $(bili_player_id).hide();
  } else {
    MessageBox.alert('<div id="bp_dplayer" style="width:100%;height:100%;"></div>', () => {
      recover_player();
    });
  }
  const dplayer_init = function () {
    let subtitle_url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    window.bp_dplayer = new DPlayer({
      container: $('#bp_dplayer')[0],
      mutex: false,
      volume: 1,
      autoplay: true,
      video: {
        url: url,
        type: 'auto'
      },
      subtitle: {
        url: subtitle_url,
        type: 'webvtt',
        fontSize: '35px',
        bottom: '5%',
        color: '#fff'
      },
      danmaku: true,
      apiBackend: {
        read: options => {
          request_danmaku(options, video.base().cid());
        },
        send: options => {
          // ?
          options.error('此脚本无法将弹幕同步到云端');
        }
      },
      contextmenu: [{
        text: '脚本信息',
        link: 'https://github.com/injahow/user.js'
      }, {
        text: '脚本作者',
        link: 'https://injahow.com'
      }, {
        text: '恢复播放器',
        click: () => {
          recover_player();
        }
      }]
    });
    // subtitle_blob save
    if (url_2 && url_2 !== '#') {
      $('body').append('<div id="bp_dplayer_2" style="display:none;"></div>');
      window.bp_dplayer_2 = new DPlayer({
        container: $('#bp_dplayer_2')[0],
        mutex: false,
        volume: 1,
        autoplay: false,
        video: {
          url: url_2,
          type: 'auto'
        }
      });
      const [bp_dplayer, bp_dplayer_2] = [window.bp_dplayer, window.bp_dplayer_2];
      bp_dplayer.on('play', () => {
        !bp_dplayer.paused && bp_dplayer_2.play();
      });
      bp_dplayer.on('playing', () => {
        !bp_dplayer.paused && bp_dplayer_2.play();
      });
      bp_dplayer.on('timeupdate', () => {
        if (Math.abs(bp_dplayer.video.currentTime - bp_dplayer_2.video.currentTime) > 1) {
          bp_dplayer_2.pause();
          bp_dplayer_2.seek(bp_dplayer.video.currentTime);
        }
        !bp_dplayer.paused && bp_dplayer_2.play();
      });
      bp_dplayer.on('seeking', () => {
        bp_dplayer_2.pause();
        bp_dplayer_2.seek(bp_dplayer.video.currentTime);
      });
      bp_dplayer.on('waiting', () => {
        bp_dplayer_2.pause();
        bp_dplayer_2.seek(bp_dplayer.video.currentTime);
      });
      bp_dplayer.on('pause', () => {
        bp_dplayer_2.pause();
        bp_dplayer_2.seek(bp_dplayer.video.currentTime);
      });
      bp_dplayer.on('suspend', () => {
        bp_dplayer_2.speed(bp_dplayer.video.playbackRate);
      });
      bp_dplayer.on('volumechange', () => {
        bp_dplayer_2.volume(bp_dplayer.video.volume);
        bp_dplayer_2.video.muted = bp_dplayer.video.muted;
      });
    }
  };
  // 默认请求字幕
  api.get_subtitle_url(0, dplayer_init);
}
function bili_video_tag() {
  if (!!$('bwp-video')[0]) {
    return 'bwp-video';
  } else if (!!$('video[class!="dplayer-video dplayer-video-current"]')[0]) {
    return 'video[class!="dplayer-video dplayer-video-current"]';
  }
}
function bili_video_stop() {
  // listener
  const bili_video = $(bili_video_tag())[0];
  if (bili_video) {
    bili_video.pause();
    bili_video.currentTime = 0;
  }
}
function recover_player() {
  if (window.bp_dplayer) {
    const bili_video = $(bili_video_tag())[0];
    !!bili_video && bili_video.removeEventListener('play', bili_video_stop, false);
    window.bp_dplayer.destroy();
    window.bp_dplayer = null;
    $('#bp_dplayer').remove();
    if (window.bp_dplayer_2) {
      window.bp_dplayer_2.destroy();
      window.bp_dplayer_2 = null;
      $('#bp_dplayer_2').remove();
    }
    $(get_bili_player_id()).show();
  }
}

// DPlayer 弹幕设置
function danmaku_config() {
  const style = '' + `<style id="dplayer_danmaku_style">
        .dplayer-danmaku .dplayer-danmaku-right.dplayer-danmaku-move {
            animation-duration: ${parseFloat(config_config.danmaku_speed)}s;
            font-size: ${parseInt(config_config.danmaku_fontsize)}px;
        }
        </style>`;
  if (!!$('#dplayer_danmaku_style')[0]) {
    $('#dplayer_danmaku_style').remove();
  }
  $('body').append(style);
}
const player = {
  bili_video_tag,
  recover_player,
  replace_player,
  danmaku: {
    config: danmaku_config
  }
};
;// ./src/js/check.js




class Check {
  constructor() {
    this.href = '';
    this.aid = '';
    this.cid = '';
    this.q = '';
    this.epid = '';
    this.locked = false;
  }
  refresh() {
    if (this.locked) {
      return;
    }
    this.lock = true;
    logger.debug('refresh...');
    $('#video_download').hide();
    $('#video_download_2').hide();
    player.recover_player();
    try {
      // 更新check
      this.href = location.href;
      const vb = video.base();
      this.aid = vb.aid();
      this.cid = vb.cid();
      this.epid = vb.epid();
      this.q = video.get_quality().q;
    } catch (err) {
      logger.error(err);
    } finally {
      this.lock = false;
    }
  }
}
const check = new Check();
;// ./src/js/utils/download.js






function rpc_type() {
  if (config_config.rpc_domain.match('https://') || config_config.rpc_domain.match(/localhost|127\.0\.0\.1/)) {
    return 'post';
  } else {
    return 'ariang';
  }
}
function download_all() {
  const vb = video.base();
  const [q, total] = [video.get_quality().q, vb.total()];
  $('body').on('click', 'input[name="option_video"]', function (event) {
    if ($(this).is(':checked')) {
      $(this).parent().css('color', 'rgba(0,0,0,1)');
    } else {
      $(this).parent().css('color', 'rgba(0,0,0,0.5)');
    }
    function get_option_index(element) {
      return element && parseInt(element.id.split('_')[1]) || 0;
    }
    if (event.ctrlKey || event.altKey) {
      // 记录当前点击option的index
      const current_select_option_index = get_option_index(event.target);
      // 获取所有复选框
      const option_videos = [...document.getElementsByName('option_video')];
      if (event.target.checked) {
        // checked = true: 选中`上一个被选中`到`这次被选中`的所有option
        const previous_selected_option_index = get_option_index(option_videos.filter(e => e.checked && get_option_index(e) < current_select_option_index).slice(-1)[0]);
        for (let i = previous_selected_option_index; i < current_select_option_index; i++) {
          option_videos[i].checked = true;
          option_videos[i].parentNode.style.color = 'rgba(0,0,0,1)';
        }
      } else {
        //checked = false，取消选中`上一个未被选中`到`这次被取消选中`的所有option
        const previous_not_selected_option_index = get_option_index(option_videos.filter(e => !e.checked && get_option_index(e) < current_select_option_index).slice(-1)[0]);
        for (let i = previous_not_selected_option_index; i < current_select_option_index; i++) {
          option_videos[i].checked = false;
          option_videos[i].parentNode.style.color = 'rgba(0,0,0,0.5)';
        }
      }
    }
  });
  let video_html = '';
  for (let i = 0; i < total; i++) {
    video_html += '' + `<label for="option_${i}"><div style="color:rgba(0,0,0,0.5);">
                <input type="checkbox" id="option_${i}" name="option_video" value="${i}">
                P${i + 1} ${vb.title(i + 1)}
            </div></label><hr>`;
  }
  let all_checked = false;
  $('body').on('click', 'button#checkbox_btn', () => {
    if (all_checked) {
      all_checked = false;
      $('input[name="option_video"]').prop('checked', all_checked);
      $('input[name="option_video"]').parent().css('color', 'rgba(0,0,0,0.5)');
    } else {
      all_checked = true;
      $('input[name="option_video"]').prop('checked', all_checked);
      $('input[name="option_video"]').parent().css('color', 'rgb(0,0,0)');
    }
  });
  const quality_support = video.get_quality_support();
  let option_support_html = '';
  for (const item of quality_support) {
    option_support_html += `<option value="${item}">${videoQualityMap[item]}</option>`;
  }
  const msg = '' + `<div style="margin:2% 0;">
            <label>视频格式:</label>
            <select id="dl_format">
                <option value="mp4" selected>MP4</option>
                <option value="flv">FLV</option>
                <option value="dash">DASH</option>
            </select>
            &nbsp;&nbsp;无法设置MP4清晰度
        </div>
        <div style="margin:2% 0;">
            <label>视频质量:</label>
            <select id="dl_quality">
                ${option_support_html}
            </select>
        </div>
        <div style="margin:2% 0;">
            <label>下载选择:</label>
            <label style="color:rgba(0,0,0,1);">
                <input type="checkbox" id="dl_video" name="dl_option" checked="checked">
                <label for="dl_video">视频</label>
            </label>
            <label style="color:rgba(0,0,0,0.5);">
                <input type="checkbox" id="dl_subtitle" name="dl_option">
                <label for="dl_subtitle">字幕</label>
            </label>
            <label style="color:rgba(0,0,0,0.5);">
                <input type="checkbox" id="dl_danmaku" name="dl_option">
                <label for="dl_danmaku">弹幕</label>
            </label>
        </div>
        <div style="margin:2% 0;">
            <label>保存目录:</label>
            <input id="dl_rpc_dir" placeholder="${config_config.rpc_dir || '为空使用默认目录'}"/>
        </div>
        <b>
            <span style="color:red;">为避免请求被拦截，设置了延时且不支持下载无法播放的视频；请勿频繁下载过多视频，可能触发风控导致不可再下载！</span>
        </b><br />
        <div style="height:240px;width:100%;overflow:auto;background:rgba(0,0,0,0.1);">
            ${video_html}
        </div>
        <div style="margin:2% 0;">
            <button id="checkbox_btn">全选</button>
        </div>`;
  MessageBox.confirm(msg, () => {
    // 获取参数
    const [dl_video, dl_subtitle, dl_danmaku, dl_format, dl_quality, dl_rpc_dir] = [$('#dl_video').is(':checked'), $('#dl_subtitle').is(':checked'), $('#dl_danmaku').is(':checked'), $('#dl_format').val(), $('#dl_quality').val() || q, $('#dl_rpc_dir').val()];
    const videos = [];
    for (let i = 0; i < total; i++) {
      if (!$(`input#option_${i}`).is(':checked')) {
        continue;
      }
      const p = i + 1;
      videos.push({
        cid: vb.cid(p),
        p: p,
        q: dl_quality,
        format: dl_format,
        filename: vb.filename(p),
        rpc_dir: dl_rpc_dir
      });
    }
    if (dl_video) {
      // 下载视频
      download_videos(videos, 0, []);
    }
    if (dl_subtitle) {
      // 下载字幕
      if (videos.length === 1) {
        download_subtitle_vtt(videos[0].p, videos[0].filename);
      } else {
        download_subtitle_vtt_zip([...videos], new JSZip());
      }
    }
    if (dl_danmaku) {
      // 下载弹幕
      if (videos.length === 1) {
        download_danmaku_ass(videos[0].cid, videos[0].filename);
      } else {
        download_danmaku_ass_zip([...videos], new JSZip());
      }
    }
  });
  $('#dl_quality').val(q);

  // 处理input颜色
  $('body').on('click', 'input[name="dl_option"]', function () {
    if ($(this).is(':checked')) {
      $(this).parent().css('color', 'rgba(0,0,0,1)');
    } else {
      $(this).parent().css('color', 'rgba(0,0,0,0.5)');
    }
  });
  function download_videos(video_tasks, i, videos) {
    // 递归请求下载

    if (!video_tasks.length) {
      return;
    }
    if (i >= video_tasks.length) {
      MessageBox.alert('视频地址请求完成！');
      if (rpc_type() === 'post') {
        if (videos.length > 0) {
          download_rpc_post_all(videos);
          videos.length = 0;
        }
      }
      // one by one -> null
      return;
    }
    const task = video_tasks[i];
    const msg = `第${i + 1}（${i + 1}/${video_tasks.length}）个视频`;
    MessageBox.alert(`${msg}：获取中...`);
    const success = res => {
      setTimeout(() => {
        download_videos(video_tasks, ++i, videos);
      }, 4000);
      if (res.code) {
        return;
      }
      message_Message.success('请求成功' + (res.times ? `<br/>今日剩余请求次数${res.times}` : ''));
      MessageBox.alert(`${msg}：获取成功！`);
      const [url, type, video_url, audio_url] = [res.url, rpc_type(), res.video, res.audio];
      if (type === 'post') {
        if (task.format === 'dash') {
          // 处理dash
          videos.push({
            url: video_url,
            filename: task.filename + format(video_url),
            rpc_dir: task.rpc_dir
          }, {
            url: audio_url,
            filename: task.filename + '.m4a',
            rpc_dir: task.rpc_dir
          });
        } else {
          videos.push({
            url: url,
            filename: task.filename + format(url),
            rpc_dir: task.rpc_dir
          });
        }
        if (videos.length > 3) {
          download_rpc_post_all(videos);
          videos.length = 0;
        }
      } else if (type === 'ariang') {
        if (task.format === 'dash') {
          // 处理dash
          download_rpc_ariang({
            url: video_url,
            filename: task.filename + format(video_url)
          }, {
            url: audio_url,
            filename: task.filename + '.m4a'
          });
        } else {
          download_rpc_ariang({
            url: url,
            filename: task.filename + format(url)
          });
        }
      }
    };
    const error = () => {
      download_videos(video_tasks, ++i, videos);
    };
    api.get_urls(task.p, task.q, task.format, success, error);
  }
}

/**
 * rpc
 */
function get_rpc_post(data) {
  // [...{ url, filename, rpc_dir }]
  if (!(data instanceof Array)) {
    data = data instanceof Object ? [data] : [];
  }
  const rpc = {
    domain: config_config.rpc_domain,
    port: config_config.rpc_port,
    token: config_config.rpc_token,
    dir: config_config.rpc_dir
  };
  return {
    url: `${rpc.domain}:${rpc.port}/jsonrpc`,
    type: 'POST',
    dataType: 'json',
    data: JSON.stringify(data.map(_ref => {
      let {
        url,
        filename,
        rpc_dir
      } = _ref;
      const param = {
        out: filename,
        header: [`User-Agent: ${window.navigator.userAgent}`, `Referer: ${window.location.href}`]
      };
      if (rpc_dir || rpc.dir) {
        param.dir = rpc_dir || rpc.dir;
      }
      return {
        id: window.btoa(`BParse_${Date.now()}_${Math.random()}`),
        jsonrpc: '2.0',
        method: 'aria2.addUri',
        params: [`token:${rpc.token}`, [url], param]
      };
    }))
  };
}
function download_rpc(url, filename) {
  let type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'post';
  if (type === 'post') {
    download_rpc_post({
      url,
      filename
    });
  } else if (type === 'ariang') {
    download_rpc_ariang({
      url,
      filename
    });
  }
}
let download_rpc_clicked = false;
function download_rpc_post(video) {
  download_rpc_post_all([video]);
}
function download_rpc_post_all(videos) {
  if (download_rpc_clicked) {
    message_Message.miaow();
    return;
  }
  download_rpc_clicked = true;
  const data = [...videos];
  ajax(get_rpc_post(data)).then(res => {
    if (res.length === data.length) {
      message_Message.success('RPC请求成功');
    } else {
      message_Message.warning('请检查RPC参数');
    }
  }).catch(() => {
    message_Message.error('请检查RPC服务配置');
  }).finally(() => download_rpc_clicked = false);
  message_Message.info('发送RPC下载请求');
}
function open_ariang(rpc) {
  const hash_tag = rpc ? `#!/settings/rpc/set/${rpc.domain.replace('://', '/')}/${rpc.port}/jsonrpc/${window.btoa(rpc.token)}` : '';
  const url = config_config.ariang_host + hash_tag;
  const a = document.createElement('a');
  a.setAttribute('target', '_blank');
  a.setAttribute('onclick', `window.bp_aria2_window=window.open('${url}');`);
  a.click();
}
function download_rpc_ariang_send(video) {
  const bp_aria2_window = window.bp_aria2_window;
  let time = 100;
  if (!bp_aria2_window || bp_aria2_window.closed) {
    open_ariang();
    time = 3000;
  }
  setTimeout(() => {
    const bp_aria2_window = window.bp_aria2_window;
    const task_hash = '#!/new/task?' + [`url=${encodeURIComponent(window.btoa(video.url))}`, `out=${encodeURIComponent(video.filename)}`, `header=User-Agent:${window.navigator.userAgent}`, `header=Referer:${window.location.href}`].join('&');
    if (bp_aria2_window && !bp_aria2_window.closed) {
      bp_aria2_window.location.href = config_config.ariang_host + task_hash;
      message_Message.success('发送RPC请求');
    } else {
      message_Message.warning('AriaNG页面未打开');
    }
  }, time);
}
function download_rpc_ariang() {
  for (var _len = arguments.length, videos = new Array(_len), _key = 0; _key < _len; _key++) {
    videos[_key] = arguments[_key];
  }
  if (videos.length == 0) {
    return;
  }
  if (videos.length == 1 && videos[0] instanceof Array) {
    download_rpc_ariang(...videos[0]);
    return;
  }
  download_rpc_ariang_send(videos.pop());
  setTimeout(() => {
    download_rpc_ariang(...videos);
  }, 100);
}

/**
 * blob
 */
let download_blob_clicked = false,
  need_show_progress = true;
function show_progress(_ref2) {
  let {
    total,
    loaded,
    percent
  } = _ref2;
  if (need_show_progress) {
    MessageBox.alert(`文件大小：${Math.floor(total / (1024 * 1024))}MB(${total}Byte)<br/>` + `已经下载：${Math.floor(loaded / (1024 * 1024))}MB(${loaded}Byte)<br/>` + `当前进度：${percent}%<br/>下载中请勿操作浏览器，刷新或离开页面会导致下载取消！<br/>再次点击下载按钮可查看下载进度。`, () => {
      need_show_progress = false;
    });
  }
  if (total === loaded) {
    MessageBox.alert('下载完成，请等待浏览器保存！');
    download_blob_clicked = false;
  }
}
function download_blob(url, filename) {
  if (download_blob_clicked) {
    message_Message.miaow();
    need_show_progress = true;
    return;
  }
  const xhr = new XMLHttpRequest();
  xhr.open('get', url);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    if (this.status === 200 || this.status === 304) {
      if ('msSaveOrOpenBlob' in navigator) {
        navigator.msSaveOrOpenBlob(this.response, filename);
        return;
      }
      const blob_url = URL.createObjectURL(this.response);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blob_url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(blob_url);
    }
  };
  need_show_progress = true;
  xhr.onprogress = function (evt) {
    if (this.state != 4) {
      const loaded = evt.loaded;
      const tot = evt.total;
      show_progress({
        total: tot,
        loaded: loaded,
        percent: Math.floor(100 * loaded / tot)
      });
    }
  };
  xhr.send();
  download_blob_clicked = true; // locked
  message_Message.info('准备开始下载');
}

/**
 * danmaku & subtitle
 */
function _download_danmaku_ass(cid, title) {
  let return_type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  let callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  // todo: 暂时使用随机弹幕
  ajax({
    url: `https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}`,
    dataType: 'text'
  }).then(result => {
    const result_dom = $(result.replace(/[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f]/g, ''));
    if (!result_dom || !result_dom.find('d')[0]) {
      if (return_type === 'callback' && callback) {
        callback();
        return;
      }
      message_Message.warning('未发现弹幕');
      return;
    } else {
      // 1.json
      const danmaku_data = result_dom.find('d').map((i, el) => {
        const item = $(el);
        const p = item.attr('p').split(',');
        let type = 0;
        if (p[1] === '4') {
          type = 2;
        } else if (p[1] === '5') {
          type = 1;
        }
        return [{
          time: parseFloat(p[0]),
          type: type,
          color: parseInt(p[3]),
          text: item.text()
        }];
      }).get().sort((a, b) => a.time - b.time);
      // 2.dialogue
      const dialogue = (danmaku, scroll_id, fix_id) => {
        const encode = text => text.replace(/\{/g, '｛').replace(/\}/g, '｝').replace(/\r|\n/g, '');
        const colorCommand = color => {
          const [r, g, b] = [color >> 16 & 0xff, color >> 8 & 0xff, color & 0xff];
          return `\\c&H${(b << 16 | g << 8 | r).toString(16)}&`;
        };
        //const borderColorCommand = color => `\\3c&H${color.toString(16)}&`
        const isWhite = color => color === 16777215;
        const scrollCommand = (top, left_a, left_b) => `\\move(${left_a},${top},${left_b},${top})`;
        const fixCommand = (top, left) => `\\pos(${left},${top})`;
        const [scrollTime, fixTime] = [8, 4];
        const {
          text,
          time
        } = danmaku;
        const commands = [danmaku.type === 0 ? scrollCommand(50 * (1 + Math.floor(Math.random() * 15)), 1920 + 50 * danmaku.text.length / 2, 0 - 50 * danmaku.text.length / 2) : fixCommand(50 * (1 + fix_id % 15), 960), isWhite(danmaku.color) ? '' : colorCommand(danmaku.color)
        //isWhite(danmaku.color) ? '' : borderColorCommand(danmaku.color)
        ];
        const formatTime = seconds => {
          const div = (i, j) => Math.floor(i / j);
          const pad = n => n < 10 ? '0' + n : '' + n;
          const integer = Math.floor(seconds);
          const hour = div(integer, 60 * 60);
          const minute = div(integer, 60) % 60;
          const second = integer % 60;
          const minorSecond = Math.floor((seconds - integer) * 100); // 取小数部分2位
          return `${hour}:${pad(minute)}:${pad(second)}.${minorSecond}`;
        };
        const fields = [0,
        // Layer,
        formatTime(time),
        // Start
        formatTime(time + (danmaku.type === 0 ? scrollTime : fixTime)),
        // End
        'Medium',
        // Style
        '',
        // Name
        '0',
        // MarginL
        '0',
        // MarginR
        '0',
        // MarginV
        '',
        // Effect
        '{' + commands.join('') + '}' + encode(text) // Text
        ];
        return 'Dialogue: ' + fields.join(',');
      };
      // todo 3. make
      const content = ['[Script Info]', '; Script generated by injahow/user.js', '; https://github.com/injahow/user.js', `Title: ${title}`, 'ScriptType: v4.00+', `PlayResX: ${1920}`, `PlayResY: ${1080}`, 'Timer: 10.0000', 'WrapStyle: 2', 'ScaledBorderAndShadow: no', '', '[V4+ Styles]', 'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding', 'Style: Small,微软雅黑,36,&H66FFFFFF,&H66FFFFFF,&H66000000,&H66000000,0,0,0,0,100,100,0,0,1,1.2,0,5,0,0,0,0', 'Style: Medium,微软雅黑,52,&H66FFFFFF,&H66FFFFFF,&H66000000,&H66000000,0,0,0,0,100,100,0,0,1,1.2,0,5,0,0,0,0', 'Style: Large,微软雅黑,64,&H66FFFFFF,&H66FFFFFF,&H66000000,&H66000000,0,0,0,0,100,100,0,0,1,1.2,0,5,0,0,0,0', 'Style: Larger,微软雅黑,72,&H66FFFFFF,&H66FFFFFF,&H66000000,&H66000000,0,0,0,0,100,100,0,0,1,1.2,0,5,0,0,0,0', 'Style: ExtraLarge,微软雅黑,90,&H66FFFFFF,&H66FFFFFF,&H66000000,&H66000000,0,0,0,0,100,100,0,0,1,1.2,0,5,0,0,0,0', '', '[Events]', 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text'];
      let scroll_id = 0,
        fix_id = 0;
      for (const danmaku of danmaku_data) {
        if (danmaku.type === 0) {
          scroll_id++;
        } else {
          fix_id++;
        }
        content.push(dialogue(danmaku, scroll_id, fix_id));
      }
      // 4.ass & return
      const data = content.join('\n');
      if (return_type === null || return_type === 'file') {
        const blob_url = URL.createObjectURL(new Blob([data], {
          type: 'text/ass'
        }));
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blob_url;
        a.download = title + '.ass';
        a.click();
        URL.revokeObjectURL(blob_url);
      } else if (return_type === 'callback' && callback) {
        callback(data);
      }
    }
  }).catch(() => {
    if (return_type === 'callback' && callback) {
      callback();
    }
  });
}
function download_danmaku_ass(cid, title) {
  _download_danmaku_ass(cid, title, 'file');
}
function download_subtitle_vtt() {
  let p = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  let file_name = arguments.length > 1 ? arguments[1] : undefined;
  const download_subtitle = blob_url => {
    if (!blob_url) {
      message_Message.warning('未发现字幕');
      return;
    }
    const a = document.createElement('a');
    a.setAttribute('target', '_blank');
    a.setAttribute('href', blob_url);
    a.setAttribute('download', file_name + '.vtt');
    a.click();
    URL.revokeObjectURL(blob_url);
  };
  api.get_subtitle_url(p, download_subtitle);
}
function download_blob_zip(blob_data, filename) {
  if (!blob_data) return;
  const blob_url = URL.createObjectURL(blob_data);
  const a = document.createElement('a');
  a.setAttribute('target', '_blank');
  a.setAttribute('href', blob_url);
  a.setAttribute('download', filename + '.zip');
  a.click();
  URL.revokeObjectURL(blob_url);
}

/**
 * 批量下载弹幕
 * @param {Array} videos
 * @param {JSZip} zip
 * @returns
 */
function download_danmaku_ass_zip(videos, zip) {
  if (!videos) return;
  if (videos.length === 0) {
    if (Object.keys(zip.files).length === 0) {
      message_Message.warning('未发现弹幕');
      return;
    }
    zip.generateAsync({
      type: 'blob'
    }).then(data => download_blob_zip(data, video.base().getFilename() + '_ass'));
    return;
  }
  const {
    cid,
    filename
  } = videos.pop();
  _download_danmaku_ass(cid, filename, 'callback', data => {
    if (data) {
      zip.file(filename + '.ass', data);
    }
    setTimeout(() => {
      download_danmaku_ass_zip(videos, zip);
    }, 1000);
  });
}

/**
 * 批量下载字幕
 * @param {Array} videos
 * @param {JSZip} zip
 * @returns
 */
function download_subtitle_vtt_zip(videos, zip) {
  if (!videos) return;
  if (videos.length === 0) {
    if (Object.keys(zip.files).length === 0) {
      message_Message.warning('未发现字幕');
      return;
    }
    zip.generateAsync({
      type: 'blob'
    }).then(data => download_blob_zip(data, video.base().getFilename() + '_vtt'));
    return;
  }
  const {
    p,
    filename
  } = videos.pop();
  api.get_subtitle_data(p, data => {
    if (data) {
      zip.file(filename + '.vtt', data);
    }
    setTimeout(() => {
      download_subtitle_vtt_zip(videos, zip);
    }, 1000);
  });
}
function format(url) {
  if (!url) return '';
  if (url.match('.mp4|.m4s')) {
    return '.mp4';
  } else if (url.match('.flv')) {
    return '.flv';
  }
  return '.mp4';
}
function download(url, filename, type) {
  filename = filename.replace(/[\/\\*|]+/g, '-').replace(/:/g, '：').replace(/\?/g, '？').replace(/"/g, '\'').replace(/</g, '《').replace(/>/g, '》');
  if (type === 'blob') {
    download_blob(url, filename);
  } else if (type === 'rpc') {
    download_rpc(url, filename, rpc_type());
  }
}
const Download = {
  url_format: format,
  download,
  download_all,
  download_danmaku_ass,
  download_subtitle_vtt,
  open_ariang
};
;// ./src/html/config.html
// Module
var config_code = "<div id=\"bp_config\"> <div class=\"config-mark\"></div> <div class=\"config-bg\"> <span style=\"font-size:20px\"> <b>bilibili视频下载 参数设置</b> <b> <a href=\"javascript:;\" id=\"reset_config\"> [重置] </a> <a style=\"text-decoration:underline\" href=\"javascript:;\" id=\"show_help\">&lt;通知/帮助&gt;</a> </b> </span> <div style=\"margin:2% 0\"> <label>请求地址：</label> <input id=\"base_api\" style=\"width:30%\"/>&nbsp;&nbsp;&nbsp;&nbsp; <label>请求方式：</label> <select id=\"request_type\"> <option value=\"auto\">自动判断</option> <option value=\"local\">本地请求</option> <option value=\"remote\">远程请求</option></select><br/> <small>注意：普通使用请勿修改；默认使用混合请求</small> </div> <div style=\"margin:2% 0\"> <label>视频格式：</label> <select id=\"format\"> <option value=\"mp4\">MP4</option> <option value=\"flv\">FLV</option> <option value=\"dash\">DASH</option></select>&nbsp;&nbsp;&nbsp;&nbsp; <label>切换CDN：</label> <select id=\"host_key\"> {{host_key_options}}</select><br/> <small>注意：无法选择MP4清晰度；建议特殊地区或播放异常时切换（自行选择合适线路）</small> </div> <div style=\"margin:2% 0\"> <label>下载方式：</label> <select id=\"download_type\"> <option value=\"a\">URL链接</option> <option value=\"web\">Web浏览器</option> <option value=\"blob\">Blob请求</option> <option value=\"rpc\">RPC接口</option> <option value=\"aria\">Aria2命令</option></select>&nbsp;&nbsp;&nbsp;&nbsp; <label>AriaNg地址：</label> <input id=\"ariang_host\" style=\"width:30%\"/><br/> <small>提示：建议使用RPC请求下载；非HTTPS或非本地RPC域名使用AriaNg下载</small> </div> <div style=\"margin:2% 0\"> <label>RPC配置：[ 域名 : 端口 | 密钥 | 保存目录 ]</label><br/> <input id=\"rpc_domain\" placeholder=\"ws://192.168.1.2\" style=\"width:25%\"/> : <input id=\"rpc_port\" placeholder=\"6800\" style=\"width:10%\"/> | <input id=\"rpc_token\" placeholder=\"未设置不填\" style=\"width:15%\"/> | <input id=\"rpc_dir\" placeholder=\"留空使用默认目录\" style=\"width:20%\"/><br/> <small>注意：RPC默认使用Motrix（需要安装并运行）下载，其他软件请修改参数</small> </div> <div style=\"margin:2% 0\"> <label>Aria2配置：</label> <label>最大连接数：</label> <select id=\"aria2c_connection_level\"> <option value=\"min\">1</option> <option value=\"mid\">8</option> <option value=\"max\">16</option></select>&nbsp;&nbsp;&nbsp;&nbsp; <label>附加参数：</label> <input id=\"aria2c_addition_parameters\" placeholder=\"见Aria2c文档\" style=\"width:20%\"/><br/> <small>说明：用于配置Aria命令下载方式的参数</small> </div> <div style=\"margin:2% 0\"> <label>强制换源：</label> <select id=\"replace_force\"> <option value=\"0\">关闭</option> <option value=\"1\">开启</option> </select> &nbsp;&nbsp;&nbsp;&nbsp; <label>弹幕速度：</label> <input id=\"danmaku_speed\" style=\"width:5%\"/> s &nbsp;&nbsp;&nbsp;&nbsp; <label>弹幕字号：</label> <input id=\"danmaku_fontsize\" style=\"width:5%\"/> px<br/> <small>说明：使用请求到的视频地址在DPlayer进行播放；弹幕速度为弹幕滑过DPlayer的时间</small> </div> <div style=\"margin:2% 0\"> <label>自动下载：</label> <select id=\"auto_download\"> <option value=\"0\">关闭</option> <option value=\"1\">开启</option> </select> &nbsp;&nbsp;&nbsp;&nbsp; <label>视频质量：</label> <select id=\"video_quality\"> {{video_quality_options}}</select><br/> <small>说明：请求地址成功后将自动点击下载视频按钮</small> </div> <div style=\"margin:2% 0\"> <label>授权状态：</label> <select id=\"auth\" disabled=\"disabled\"> <option value=\"0\">未授权</option> <option value=\"1\">已授权</option> </select> <a class=\"setting-context\" href=\"javascript:;\" id=\"show_login\">扫码授权</a> <a class=\"setting-context\" href=\"javascript:;\" id=\"show_login_2\">网页授权</a> <a class=\"setting-context\" href=\"javascript:;\" id=\"show_logout\">取消授权</a> <a class=\"setting-context\" href=\"javascript:;\" id=\"show_login_help\">这是什么？</a> </div> <br/> <div style=\"text-align:right\"> <button class=\"setting-button\" id=\"save_config\">确定</button> </div> </div> <style>#bp_config{opacity:0;display:none;position:fixed;inset:0px;top:0;left:0;width:100%;height:100%;z-index:10000;line-height:normal!important;font-size:14px!important}#bp_config .config-bg{position:absolute;background:#fff;border-radius:10px;padding:20px;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;z-index:10001}#bp_config .config-mark{width:100%;height:100%;position:fixed;top:0;left:0;background:rgba(0,0,0,.5);z-index:10000}#bp_config .setting-button{width:120px;height:40px;border-width:0;border-radius:3px;background:#1e90ff;cursor:pointer;outline:0;color:#fff;font-size:17px}#bp_config .setting-button:hover{background:#59f}#bp_config .setting-context{margin:0 1%;color:#00f}#bp_config .setting-context:hover{color:red}#bp_config input{border:#000 1px solid;width:30%;font-size:13px;font-family:revert}#bp_config select{appearance:auto;border:#000 1px solid}</style> </div> ";
// Exports
/* harmony default export */ var config = (config_code);
;// ./src/js/ui/config.js
var _document$head$innerH;










const config_config = {
  base_api: 'https://api.func.cool/bparse',
  request_type: 'auto',
  format: 'mp4',
  host_key: '0',
  replace_force: '0',
  download_type: 'web',
  rpc_domain: 'http://localhost',
  rpc_port: '16800',
  rpc_token: '',
  rpc_dir: '',
  aria2c_connection_level: 'min',
  aria2c_addition_parameters: '',
  ariang_host: 'http://ariang.injahow.com/',
  auto_download: '0',
  video_quality: '0',
  danmaku_speed: '15',
  danmaku_fontsize: '22'
};
const default_config = Object.assign({}, config_config); // 浅拷贝

const hostMap = {
  local: ((_document$head$innerH = document.head.innerHTML.match(/up[\w-]+\.bilivideo\.com/)) === null || _document$head$innerH === void 0 ? void 0 : _document$head$innerH[0]) || '未发现本地CDN',
  bd: 'upos-sz-mirrorbd.bilivideo.com',
  ks3: 'upos-sz-mirrorks3.bilivideo.com',
  ks3b: 'upos-sz-mirrorks3b.bilivideo.com',
  ks3c: 'upos-sz-mirrorks3c.bilivideo.com',
  ks32: 'upos-sz-mirrorks32.bilivideo.com',
  kodo: 'upos-sz-mirrorkodo.bilivideo.com',
  kodob: 'upos-sz-mirrorkodob.bilivideo.com',
  cos: 'upos-sz-mirrorcos.bilivideo.com',
  cosb: 'upos-sz-mirrorcosb.bilivideo.com',
  bos: 'upos-sz-mirrorbos.bilivideo.com',
  wcs: 'upos-sz-mirrorwcs.bilivideo.com',
  wcsb: 'upos-sz-mirrorwcsb.bilivideo.com',
  /* 不限CROS, 限制UA */
  hw: 'upos-sz-mirrorhw.bilivideo.com',
  hwb: 'upos-sz-mirrorhwb.bilivideo.com',
  upbda2: 'upos-sz-upcdnbda2.bilivideo.com',
  upws: 'upos-sz-upcdnws.bilivideo.com',
  uptx: 'upos-sz-upcdntx.bilivideo.com',
  uphw: 'upos-sz-upcdnhw.bilivideo.com',
  js: 'upos-tf-all-js.bilivideo.com',
  hk: 'cn-hk-eq-bcache-01.bilivideo.com',
  akamai: 'upos-hz-mirrorakam.akamaized.net'
};
const videoQualityMap = {
  127: '8K 超高清',
  120: '4K 超清',
  116: '1080P 60帧',
  112: '1080P 高码率',
  80: '1080P 高清',
  74: '720P 60帧',
  64: '720P 高清',
  48: '720P 高清(MP4)',
  32: '480P 清晰',
  16: '360P 流畅'
};
let help_clicked = false;
const config_functions = {
  save_config() {
    let old_config;
    try {
      old_config = JSON.parse(store.get('config_str'));
    } catch (err) {
      old_config = {};
    } finally {
      old_config = {
        ...default_config,
        ...old_config
      };
    }
    // 差量保存
    const config_str = {};
    for (const key in default_config) {
      if (config_config[key] !== default_config[key]) {
        config_str[key] = config_config[key];
      }
    }
    store.set('config_str', JSON.stringify(config_str));

    // 判断重新请求 todo: auth
    for (const key of ['base_api', 'format', 'video_quality']) {
      if (config_config[key] !== old_config[key]) {
        $('#video_download').hide();
        $('#video_download_2').hide();
        break;
      }
    }
    if (config_config.host_key !== old_config.host_key) {
      check.refresh();
      $('#video_url').attr('href', '#');
      $('#video_url_2').attr('href', '#');
    }
    // 判断RPC配置情况
    if (config_config.rpc_domain !== old_config.rpc_domain) {
      if (!(config_config.rpc_domain.match('https://') || config_config.rpc_domain.match(/(localhost|127\.0\.0\.1)/))) {
        MessageBox.alert('检测到当前RPC不是localhost本地接口，即将跳转到AriaNg网页控制台页面；' + '请查看控制台RPC接口参数是否正确，第一次加载可能较慢请耐心等待；' + '配置好后即可使用脚本进行远程下载，使用期间不用关闭AriaNg页面！', () => {
          Download.open_ariang({
            domain: config_config.rpc_domain,
            port: config_config.rpc_port,
            token: config_config.rpc_token
          });
        });
      }
    }
    // 更新弹幕设置
    for (const key of ['danmaku_speed', 'danmaku_fontsize']) {
      if (config_config[key] !== old_config[key]) {
        player.danmaku.config();
        break;
      }
    }
    // todo

    // 关闭
    $('#bp_config').hide();
    $('#bp_config').css('opacity', 0);
    scroll_scroll.show();
  },
  reset_config() {
    for (const key in default_config) {
      config_config[key] = default_config[key];
      $(`#${key}`).val(default_config[key]);
    }
  },
  show_help() {
    if (help_clicked) {
      message_Message.miaow();
      return;
    }
    help_clicked = true;
    ajax({
      url: `${config_config.base_api}${config_config.base_api.endsWith('/') ? '' : '/'}auth/?act=help`,
      dataType: 'text'
    }).then(res => {
      if (res) {
        MessageBox.alert(res);
      } else {
        message_Message.warning('获取失败');
      }
    }).finally(() => {
      help_clicked = false;
    });
  },
  show_login() {
    auth.login('1');
  },
  show_login_2() {
    auth.login('0');
  },
  show_logout() {
    auth.logout();
  },
  show_login_help() {
    MessageBox.confirm('进行授权之后在远程请求时拥有用户账号原有的权限，例如能够获取用户已经付费或承包的番剧，是否需要授权？', () => {
      auth.login();
    });
  }
};
function initConfig(el) {
  // 注入 host_key_options
  let options = '<option value="0">关闭</option>';
  for (const k in hostMap) {
    options += `<option value="${k}">${hostMap[k]}</option>`;
  }
  config = config.replace('{{host_key_options}}', options);
  // 注入 video_quality_options
  options = '<option value="0">与播放器相同</option>';
  for (const k in videoQualityMap) {
    options += `<option value="${k}">${videoQualityMap[k]}</option>`;
  }
  config = config.replace('{{video_quality_options}}', options);
  if (el && !!$(el)[0]) {
    $(el).append(config);
  } else {
    $('body').append(config);
  }
  // 同步数据
  const config_str = store.get('config_str');
  try {
    const old_config = JSON.parse(config_str);
    for (const key in old_config) {
      if (Object.hasOwnProperty.call(config_config, key)) {
        config_config[key] = old_config[key];
      }
    }
  } catch {
    logger.debug('初始化脚本配置');
    store.set('config_str', '{}');
  }
  // 函数绑定
  for (const key in config_config) {
    $(`#${key}`).on('input', e => {
      config_config[key] = e.delegateTarget.value;
    });
  }
  for (const k in config_functions) {
    const e = $(`#${k}`)[0]; // a && button
    !!e && (e.onclick = config_functions[k]);
  }
  // 渲染数据
  for (const key in config_config) {
    $(`#${key}`).val(config_config[key]);
  }
  window.onbeforeunload = () => {
    // todo
    const bp_aria2_window = window.bp_aria2_window;
    if (bp_aria2_window && !bp_aria2_window.closed) {
      bp_aria2_window.close();
    }
  };
}

;// ./src/js/utils/cookie.js
function getCookie(cookieName) {
  const cookieList = document.cookie.split(';');
  for (let i = 0; i < cookieList.length; ++i) {
    const arr = cookieList[i].split('=');
    if (cookieName === arr[0].trim()) {
      return arr[1];
    }
  }
  return null;
}

;// ./src/js/auth.js







class Auth {
  constructor() {
    this.auth_clicked = false;
    this.auth_window = null;
    this.TV_KEY = '4409e2ce8ffd12b8';
    this.TV_SEC = '59b43e04ad6965f34319062b478f83dd';
  }
  hasAuth() {
    return store.get('auth_id') && store.get('auth_sec');
  }
  checkLoginStatus() {
    const [auth_id, auth_sec, access_key, auth_time] = [store.get('auth_id'), store.get('auth_sec'), store.get('access_key'), store.get('auth_time') || 0];
    if (!auth_id && !auth_sec) return;
    if (config_config.base_api !== store.get('pre_base_api') || Date.now() - parseInt(auth_time) > 24 * 3600 * 1e3) {
      if (!access_key) {
        message_Message.info('授权已失效');
        this.reLogin();
        return;
      }
      ajax({
        url: `https://passport.bilibili.com/api/oauth?access_key=${access_key}`,
        type: 'GET',
        dataType: 'json'
      }).then(res => {
        if (res.code) {
          message_Message.info('授权已过期，准备重新授权');
          this.reLogin();
          return;
        }
        store.set('auth_time', Date.now());
        ajax({
          url: `${config_config.base_api}${config_config.base_api.endsWith('/') ? '' : '/'}auth/?act=check&auth_id=${auth_id}&auth_sec=${auth_sec}`,
          type: 'GET',
          dataType: 'json'
        }).then(res => {
          if (res.code) {
            message_Message.info('检查失败，准备重新授权');
            this.reLogin();
          }
        });
      });
    }
    store.set('pre_base_api', config_config.base_api);
  }
  makeAPIData(param, sec) {
    return {
      ...param,
      sign: md5(`${Object.entries(param).map(e => `${e[0]}=${e[1]}`).join('&')}${sec}`)
    };
  }
  _login(resolve) {
    if (this.auth_clicked) {
      message_Message.miaow();
      return;
    }
    this.auth_clicked = true;
    ajax({
      url: 'https://passport.bilibili.com/x/passport-tv-login/qrcode/auth_code',
      type: 'POST',
      data: this.makeAPIData({
        appkey: this.TV_KEY,
        csrf: getCookie('bili_jct') || '',
        local_id: '0',
        ts: Date.now()
      }, this.TV_SEC)
    }).then(resolve).catch(() => this.auth_clicked = false);
  }
  login() {
    let useApp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '1';
    const do_login = useApp === '1' // 绑定 this
    ? this.loginApp.bind(this) : this.loginWeb.bind(this);
    if (store.get('auth_id')) {
      MessageBox.confirm('发现授权记录，是否重新授权？', do_login);
      return;
    }
    do_login();
  }
  reLogin() {
    this.logout();
    store.set('auth_time', '0');
    this.loginApp();
  }
  loginApp() {
    this._login(res => {
      if (!res || res.code) {
        return;
      }
      const {
        url,
        auth_code
      } = res.data;
      let is_login = 0;
      const box = MessageBox.alert('<p>请使用<a href="https://app.bilibili.com/" target="_blank">哔哩哔哩客户端</a>扫码登录</p><div id="login_qrcode"></div>', () => {
        if (!is_login) {
          message_Message.info('登陆失败！');
        }
        clearInterval(timer);
        this.auth_clicked = false;
      });
      new QRCode(document.getElementById('login_qrcode'), url);
      const timer = setInterval(() => {
        _ajax({
          url: `https://passport.bilibili.com/x/passport-tv-login/qrcode/poll`,
          type: 'POST',
          data: this.makeAPIData({
            appkey: this.TV_KEY,
            auth_code: auth_code,
            csrf: getCookie('bili_jct') || '',
            local_id: '0',
            ts: Date.now().toString()
          }, this.TV_SEC)
        }).then(res => {
          if (!res.code && res.data) {
            logger.info('login success');
            is_login = 1;
            this.doAuth(res.data);
            box.affirm();
          } else if (res.code === 86038) {
            box.affirm();
          }
        });
      }, 3000);
    });
  }
  loginWeb() {
    this._login(res => {
      if (!res || res.code) {
        return;
      }
      const {
        url,
        auth_code
      } = res.data;
      this.auth_window = window.open(url);
      let is_login = 0;
      const timer = setInterval(() => {
        if (!this.auth_window || this.auth_window.closed) {
          clearInterval(timer);
          this.auth_clicked = false;
          if (!is_login) {
            message_Message.info('登陆失败！');
          }
          return;
        }
        _ajax({
          url: `https://passport.bilibili.com/x/passport-tv-login/qrcode/poll`,
          type: 'POST',
          data: this.makeAPIData({
            appkey: this.TV_KEY,
            auth_code: auth_code,
            csrf: getCookie('bili_jct') || '',
            local_id: '0',
            ts: Date.now().toString()
          }, this.TV_SEC)
        }).then(res => {
          if (!res.code && res.data) {
            logger.info('login success');
            this.doAuth(res.data);
            is_login = 1;
            this.auth_window.close();
          } else if (res.code === 86038) {
            this.auth_window.close();
          }
        }).catch(() => this.auth_window.close());
      }, 3000);
    });
  }
  logout() {
    if (!store.get('auth_id')) {
      MessageBox.alert('没有发现授权记录');
      return;
    }
    if (this.auth_clicked) {
      message_Message.miaow();
      return;
    }
    const [auth_id, auth_sec] = [store.get('auth_id'), store.get('auth_sec')];
    ajax({
      url: `${config_config.base_api}${config_config.base_api.endsWith('/') ? '' : '/'}auth/?act=logout&auth_id=${auth_id}&auth_sec=${auth_sec}`,
      type: 'GET',
      dataType: 'json'
    }).then(res => {
      if (!res.code) {
        message_Message.success('注销成功');
        store.set('auth_id', '');
        store.set('auth_sec', '');
        store.set('auth_time', '0');
        store.set('access_key', '');
        $('#auth').val('0');
      } else {
        message_Message.warning('注销失败');
      }
    }).finally(() => this.auth_clicked = false);
  }
  doAuth(param) {
    if (this.auth_window && !this.auth_window.closed) {
      this.auth_window.close();
      this.auth_window = null;
    }
    ajax({
      url: `${config_config.base_api}${config_config.base_api.endsWith('/') ? '' : '/'}auth/?act=login&${Object.entries({
        auth_id: store.get('auth_id'),
        auth_sec: store.get('auth_sec')
      }).map(e => `${e[0]}=${e[1]}`).join('&')}`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        ...param
      })
    }).then(res => {
      if (!res.code) {
        message_Message.success('授权成功');
        if (res.auth_id && res.auth_sec) {
          store.set('auth_id', res.auth_id);
          store.set('auth_sec', res.auth_sec);
        }
        store.set('access_key', param.access_token);
        store.set('auth_time', Date.now());
        $('#auth').val('1');
      } else {
        message_Message.warning('授权失败');
      }
    }).finally(() => this.auth_clicked = false);
  }
}
const auth = new Auth();
;// ./src/html/toolbar.html
// Module
var toolbar_code = "<div id=\"toolbar_module_2\" class=\"tool-bar clearfix report-wrap-module report-scroll-module media-info\" scrollshow=\"true\"> <div id=\"setting_btn\" class=\"like-info\"> <i class=\"iconfont icon-add\"></i><span>脚本设置</span> </div> <div id=\"bilibili_parse\" class=\"like-info\"> <i class=\"iconfont icon-customer-serv\"></i><span>请求地址</span> </div> <div id=\"video_download\" class=\"like-info\" style=\"display:none\"> <i class=\"iconfont icon-download\"></i><span>下载视频</span> </div> <div id=\"video_download_2\" class=\"like-info\" style=\"display:none\"> <i class=\"iconfont icon-download\"></i><span>下载音频</span> </div> <div id=\"video_download_all\" class=\"like-info\"> <i class=\"iconfont icon-download\"></i><span>批量下载</span> </div> <div class=\"more\">更多<div class=\"more-ops-list\"> <ul> <li><span id=\"download_danmaku\">下载弹幕</span></li> <li><span id=\"download_subtitle\">下载字幕</span></li> </ul> </div> </div> <style>.tool-bar .more{float:right;cursor:pointer;color:#757575;font-size:16px;transition:all .3s;position:relative;text-align:center}.tool-bar .more:hover .more-ops-list{display:block}.tool-bar:after{display:block;content:\"\";clear:both}.more-ops-list{display:none;position:absolute;width:80px;left:-65px;z-index:30;text-align:center;padding:10px 0;background:#fff;border:1px solid #e5e9ef;box-shadow:0 2px 4px 0 rgba(0,0,0,.14);border-radius:2px;font-size:14px;color:#222}.more-ops-list li{position:relative;height:34px;line-height:34px;cursor:pointer;transition:all .3s}.more-ops-list li:hover{color:#00a1d6;background:#e7e7e7}</style> </div> ";
// Exports
/* harmony default export */ var toolbar = (toolbar_code);
;// ./src/html/more_style.html
// Module
var more_style_code = "<style>.more{float:right;padding:1px;cursor:pointer;color:#757575;font-size:16px;transition:all .3s;position:relative;text-align:center}.more:hover .more-ops-list{display:block}.more-ops-list{display:none;position:absolute;width:80px;left:-15px;z-index:30;text-align:center;padding:10px 0;background:#fff;border:1px solid #e5e9ef;box-shadow:0 2px 4px 0 rgba(0,0,0,.14);border-radius:2px;font-size:14px;color:#222}.more-ops-list li{position:relative;height:34px;line-height:34px;cursor:pointer;transition:all .3s}.more-ops-list li:hover{color:#00a1d6;background:#e7e7e7}</style> ";
// Exports
/* harmony default export */ var more_style = (more_style_code);
;// ./src/js/ui/toolbar.js


const btn_list = {
  setting_btn: '脚本设置',
  bilibili_parse: '请求地址',
  video_download: '下载视频',
  video_download_2: '下载音频',
  video_download_all: '批量下载',
  more: {
    download_danmaku: '下载弹幕',
    download_subtitle: '下载字幕'
  }
};
const setting_svg = '' + `<svg class width="28" height="28" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preserve">
        <path fill="#757575" style="stroke-miterlimit:10;" d="M16,29.5L16,29.5c-0.828,0-1.5-0.672-1.5-1.5V4c0-0.828,0.672-1.5,1.5-1.5h0 c0.828,0,1.5,0.672,1.5,1.5v24C17.5,28.828,16.828,29.5,16,29.5z"/>
        <path fill="#757575" style="stroke-miterlimit:10;" d="M29.5,16L29.5,16c0,0.828-0.672,1.5-1.5,1.5H4c-0.828,0-1.5-0.672-1.5-1.5v0 c0-0.828,0.672-1.5,1.5-1.5h24C28.828,14.5,29.5,15.172,29.5,16z"/>
    </svg>`;
const request_svg = '' + `<svg class width="28" height="28" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preserve">
        <path fill="#757575" d="M28.282,13.508c-0.623-6.932-6.627-12.036-13.41-11.399C8.947,2.665,4.254,7.465,3.716,13.521 c0.786,0.404,1.283,1.226,1.284,2.126v4.157c-0.023,0.565-0.49,1.004-1.043,0.98c-0.521-0.022-0.938-0.448-0.959-0.98v-4.157 c0-0.188-0.113-0.452-0.508-0.452s-0.492,0.275-0.492,0.452v8.176c0,2.446,1.94,4.428,4.333,4.428c0,0,0,0,0,0h7.191 c0.552-1.396,2.107-2.07,3.473-1.505s2.025,2.154,1.473,3.549c-0.552,1.396-2.107,2.07-3.473,1.505 c-0.67-0.277-1.202-0.82-1.473-1.505h-7.19c-3.497,0-6.332-2.897-6.333-6.471l0,0v-8.178c0-1.077,0.706-2.02,1.723-2.303C2.429,5.285,9.393-0.662,17.278,0.059c6.952,0.636,12.445,6.297,13.009,13.407c1.032,0.404,1.713,1.416,1.712,2.545v4.088 c-0.038,1.505-1.262,2.694-2.735,2.656c-1.42-0.037-2.562-1.205-2.599-2.656l0,0v-4.085C26.667,14.924,27.302,13.939,28.282,13.508zM11.334,14.653c-1.105,0-2-0.915-2-2.044s0.896-2.044,2-2.044l0,0c1.105,0,2,0.915,2,2.044S12.439,14.653,11.334,14.653z M20.666,14.653c-1.105,0-2-0.915-2-2.044s0.896-2.044,2-2.044l0,0c1.105,0,2,0.915,2,2.044S21.771,14.653,20.666,14.653z M13.629,21.805c-2.167,0-3.962-1.653-3.962-3.748c0-0.564,0.448-1.022,1-1.022c0.552,0,1,0.458,1,1.022 c0,0.916,0.856,1.704,1.962,1.704c0.612,0.012,1.198-0.253,1.602-0.723c0.352-0.433,0.982-0.493,1.406-0.132 c0,0,0.001,0.001,0.001,0.001c0.047,0.039,0.09,0.083,0.128,0.131c0.404,0.47,0.99,0.734,1.602,0.723 c1.106,0,1.964-0.788,1.964-1.704c0-0.564,0.448-1.022,1-1.022c0.552,0,1,0.458,1,1.022c0,2.095-1.797,3.748-3.964,3.748 c-0.844,0.003-1.67-0.256-2.368-0.742C15.302,21.55,14.475,21.809,13.629,21.805z M29.332,15.333c-0.368,0-0.666,0.305-0.666,0.68 v4.088c-0.001,0.376,0.297,0.681,0.665,0.681c0.368,0.001,0.666-0.304,0.666-0.679c0-0.001,0-0.001,0-0.002v-4.088 c0.002-0.374-0.293-0.678-0.659-0.68c-0.001,0-0.002,0-0.003,0H29.332z"/>
    </svg>`;
const download_svg = '' + `<svg class width="28" height="28" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preserve">
        <path fill="#757575" d="M16.015,0C7.186,0,0.03,7.157,0.03,15.985 S7.186,31.97,16.015,31.97S32,24.814,32,15.985S24.843,0,16.015,0z"/>
        <path style="fill:#FFFFFF;" d="M16.942,23.642H9.109C8.496,23.642,8,24.17,8,24.821v0C8,25.472,8.496,26,9.109,26h14.783 C24.504,26,25,25.472,25,24.821v0c0-0.651-0.496-1.179-1.109-1.179H16.942z"/>
        <path style="fill:#FFFFFF;" d="M8.798,16.998l6.729,6.33c0.398,0.375,1.029,0.375,1.427,0l6.729-6.33 c0.666-0.627,0.212-1.726-0.714-1.726h-3.382c-0.568,0-1.028-0.449-1.028-1.003V8.003C18.56,7.449,18.099,7,17.532,7h-2.582 c-0.568,0-1.028,0.449-1.028,1.003v6.266c0,0.554-0.46,1.003-1.028,1.003H9.511C8.586,15.273,8.132,16.372,8.798,16.998z"/>
    </svg>`;
const svg_map = {
  setting_btn: setting_svg,
  bilibili_parse: request_svg,
  video_download: download_svg,
  video_download_2: download_svg,
  video_download_all: download_svg
};
function make_toolbar_bangumi(main_class_name, sub_class_names) {
  // class-3

  const list_element = (id, class_names, svg, name) => {
    return '' + `<div id="${id}" mr-show="" class="${class_names[0]}">
                <span class="${class_names[1]}">
                    ${svg}
                </span>
                <span class="${class_names[2]}">${name}</span>
            </div>`;
  };
  const more_element = (id, name) => `<li><span id="${id}">${name}</span></li>`;
  let toolbar_elements = Object.keys(btn_list).map(key => {
    if (key === 'more') {
      const more_map = btn_list[key];
      return '' + `<div class="more">更多<div class="more-ops-list">
                    <ul>${Object.keys(more_map).map(key => more_element(key, more_map[key])).join('')}</ul>
                </div>`;
    }
    return list_element(key, sub_class_names, svg_map[key], btn_list[key]);
  }).join('');
  return '' + `<div class="${main_class_name}">
            ${toolbar_elements}
            ${more_style}
        </div>`;
}
function showVideoToolbar(toolbar_id) {
  const toolbar_obj = $(`#${toolbar_id}`);
  const toolbar_obj_2 = toolbar_obj.clone();
  toolbar_obj_2.attr('id', `${toolbar_id}_2`);
  const left = toolbar_obj_2.find('.video-toolbar-left');
  const right = toolbar_obj_2.find('.video-toolbar-right');
  left.children().remove();
  right.children().remove();
  Object.keys(btn_list).map(key => {
    if (key === 'more') {
      const more_map = btn_list[key];
      const el = '' + `<div class="more">更多<div class="more-ops-list">
                    <ul>${Object.keys(more_map).map(key => `<li><span id="${key}">${more_map[key]}</span></li>`).join('')}</ul>
                </div>`;
      right.append(el + more_style);
      return;
    }
    const item = toolbar_obj.find('.toolbar-left-item-wrap').eq(0).clone();
    item.attr('id', key);
    const svg = svg_map[key].replaceAll('#757575', 'currentColor').replace('class', `class="${item.find('svg').attr('class')}"`);
    const span = item.find('span').text(btn_list[key]);
    const item_div = item.find('div').eq(0);
    item_div.attr('title', btn_list[key]);
    item_div.removeClass('on');
    item_div.children().remove();
    item_div.append(svg).append(span);
    left.append(item);
    return;
  });
  toolbar_obj.after(toolbar_obj_2);
}
function showFestivalToolbar(toolbar_id) {
  const toolbar_obj = $(`#${toolbar_id}`);
  const toolbar_obj_2 = toolbar_obj.clone();
  toolbar_obj_2.attr('id', `${toolbar_id}_2`);
  const left = toolbar_obj_2.find('.video-toolbar-content_left');
  const right = toolbar_obj_2.find('.video-toolbar-content_right');
  toolbar_obj_2.find('.video-toobar_title').remove();
  left.children().remove();
  const watchlater = right.find('.watchlater').clone();
  right.children().remove();
  right.append(watchlater);
  toolbar_obj_2.find('.video-desc-wrapper').remove();
  Object.keys(btn_list).map(key => {
    if (key === 'more') {
      const list = watchlater.find('.more-list');
      const list_li = list.children().eq(0);
      list.children().remove();
      const more_map = btn_list[key];
      Object.keys(more_map).map(key => {
        const li = list_li.clone();
        li.html(`<span id="${key}">${more_map[key]}</span>`);
        list.append(li);
      });
      return;
    }
    const item = toolbar_obj.find('.video-toolbar-content_item').eq(0).clone();
    item.attr('id', key);
    item.attr('title', btn_list[key]);
    const svg = svg_map[key].replaceAll('#757575', 'currentColor');
    const item_icon = item.find('.content-item_icon').eq(0);
    item_icon.removeClass('ic_like');
    item_icon.html(svg);
    item.html('');
    item.append(item_icon);
    item.append(btn_list[key]);
    left.append(item);
    return;
  });
  toolbar_obj.after(toolbar_obj_2);
}
function showBangumiToolbar(toolbar_class) {
  const toolbar_obj = $(`.${toolbar_class}`).eq(0);
  const toolbar_obj_2 = toolbar_obj.clone();
  const left = toolbar_obj_2.find('.toolbar-left');
  const right = toolbar_obj_2.find('.toolbar-right');
  left.children().remove();
  right.children().remove();
  Object.keys(btn_list).map(key => {
    if (key === 'more') {
      const more_map = btn_list[key];
      const el = '' + `<div class="more">更多<div class="more-ops-list">
                    <ul>${Object.keys(more_map).map(key => `<li><span id="${key}">${more_map[key]}</span></li>`).join('')}</ul>
                </div>`;
      right.append(el + more_style);
      return;
    }
    const item = toolbar_obj.find('.toolbar-left').children().eq(0).clone();
    item.attr('id', key);
    item.attr('title', btn_list[key]);
    const svg = svg_map[key].replaceAll('#757575', 'currentColor').replace('class', `class="${item.find('svg').attr('class')}"`);
    const span = item.find('span').text(btn_list[key]);
    item.children().remove();
    item.append(svg).append(span);
    left.append(item);
    return;
  });
  toolbar_obj.after(toolbar_obj_2);
}
function showVideoCardToolbar(toolbar_class) {
  const toolbar_obj = $(`.${toolbar_class}`);
  toolbar_obj.each(function () {
    const $detail = $(this);
    const $link = $detail.find('.bili-video-card__title a');
    const href = $link.attr('href');
    const match = href && href.match(/\/video\/([0-9A-Za-z]+)/);
    if (match) {
      const bvId = match[1]; // e.g. BV1ViEczpEgN
      const $subtitle = $detail.find('.bili-video-card__subtitle');

      // 创建新 span 元素
      const $span = $('<span></span>').attr('id', bvId).attr('class', 'bilibili_card_parse').text('#' + bvId).css('margin-left', '40px'); // 可选，样式与原 span 间距保持一致

      $subtitle.append($span);
    }
  });
  const key = 'setting_btn';
  const label = btn_list[key];
  const svgHtml = svg_map[key].replaceAll('#757575', 'currentColor');
  const $floatBtn = $(`
      <div id="${key}" class="custom-float-btn" title="${label}">
        ${svgHtml}
        <span>${label}</span>
      </div>
    `);
  $('<style>').html(`
        .custom-float-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 99999;
          background: #fff;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
          font-size: 14px;
          color: #333;
          transition: all 0.2s;
        }
        .custom-float-btn:hover {
          background: #f5f5f5;
        }
        .custom-float-btn svg {
          width: 20px;
          height: 20px;
          margin-right: 6px;
          fill: currentColor;
        }
        .custom-float-btn span {
          white-space: nowrap;
        }
      `).appendTo('head');

  // 添加到页面
  $('body').append($floatBtn);
}
function initToolbar() {
  if (!!$('.bili-video-card__details')[0]) {
    // upload
    showVideoCardToolbar('bili-video-card__details');
  } else if (!!$('#arc_toolbar_report')[0]) {
    // video
    showVideoToolbar('arc_toolbar_report');
  } else if (!!$('#playlistToolbar')[0]) {
    // list
    showVideoToolbar('playlistToolbar');
  } else if (!!$('#videoToolbar')[0]) {
    // festival
    showFestivalToolbar('videoToolbar');
  } else if (!!$('.toolbar')[0]) {
    // bungumi
    showBangumiToolbar('toolbar');
  } else if (!!$('.edu-play-left')[0]) {
    // cheese test
    // todo
    const toolbar_obj = $('.edu-play-left').children().eq(1);
    const toolbar_class = toolbar_obj.attr('class');
    const span_class = toolbar_obj.children().eq(0).attr('class');
    const span_class_svg = toolbar_obj.children().eq(0).children().eq(0).attr('class');
    const span_class_text = toolbar_obj.children().eq(0).children().eq(1).attr('class');
    toolbar_obj.after(make_toolbar_bangumi(toolbar_class, [span_class, span_class_svg, span_class_text]));
  } else if (!!$('#toolbar_module')[0]) {
    // ! fix
    $('#toolbar_module').after(toolbar);
  }

  // 处理遮挡
  !!$('#limit-mask-wall')[0] && $('#limit-mask-wall').remove();
}

;// ./src/js/main.js













class Main {
  constructor() {
    /* global JS_VERSION GIT_HASH */
    logger.debug(`${'\n'} %c bilibili-parse-download.user.js v${"2.6.3"} ${"82323c5"} %c https://github.com/injahow/user.js ${'\n'}${'\n'}`, 'color: #fadfa3; background: #030307; padding:5px 0;', 'background: #fadfa3; padding:5px 0;');
  }
  init() {
    initToolbar();
    const root_div = document.createElement('div');
    root_div.id = 'bp_root';
    document.body.append(root_div);
    // initConfig
    initConfig(`#${root_div.id}`);
    initMessage(`#${root_div.id}`);
    user.lazyInit();
    auth.checkLoginStatus();
    check.refresh();

    // 如果是视频页面，初始化播放器
    if (window.location.host !== 'space.bilibili.com') {
      $(`#${root_div.id}`).append('<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/dplayer/1.25.0/DPlayer.min.css">'); // for dom changed
    }
    $(`#${root_div.id}`).append('<a id="video_url" style="display:none;" target="_blank" href="#"></a>');
    $(`#${root_div.id}`).append('<a id="video_url_2" style="display:none;" target="_blank" href="#"></a>');
  }
  run() {
    this.init();
    let api_url, api_url_temp;
    const evt = {
      setting_btn() {
        user.lazyInit(true); // init
        // set form by config
        for (const key in config_config) {
          $(`#${key}`).val(config_config[key]);
        }
        $('#auth').val(auth.hasAuth() ? '1' : '0');
        //show setting
        $('#bp_config').show();
        $('#bp_config').animate({
          opacity: '1'
        }, 300);
        scroll_scroll.hide();
      },
      bilibili_parse() {
        user.lazyInit(true); // init
        const vb = video.base();
        const [type, aid, p, cid, epid] = [vb.type(), vb.aid(), vb.p(), vb.cid(), vb.epid()];
        const {
          q
        } = video.get_quality();
        api_url = `${config_config.base_api}?av=${aid}&p=${p}&cid=${cid}&ep=${epid}&q=${q}&type=${type}&format=${config_config.format}&otype=json&_host=${config_config.host_key}&_req=${config_config.request_type}&_q=${config_config.video_quality}`;
        const [auth_id, auth_sec] = [store.get('auth_id'), store.get('auth_sec')];
        if (auth_id && auth_sec) {
          api_url += `&auth_id=${auth_id}&auth_sec=${auth_sec}`;
        }
        if (api_url === api_url_temp && config_config.request_type !== 'local') {
          message_Message.miaow();
          const url = $('#video_url').attr('href');
          const url_2 = $('#video_url_2').attr('href');
          if (url && url !== '#') {
            $('#video_download').show();
            config_config.format === 'dash' && $('#video_download_2').show();
            if (user.needReplace() || vb.isLimited() || config_config.replace_force === '1') {
              !$('#bp_dplayer')[0] && player.replace_player(url, url_2);
            }
            if (config_config.auto_download === '1') {
              $('#video_download').click();
            }
          }
          return;
        }
        $('#video_url').attr('href', '#');
        $('#video_url_2').attr('href', '#');
        api_url_temp = api_url;
        message_Message.info('开始请求');
        api.get_url(res => {
          if (res && !res.code) {
            message_Message.success('请求成功');
            res.times && message_Message.info(`剩余请求次数：${res.times}`);
            let url, url_2;
            if (res.url) {
              url = res.url.replace('http://', 'https://');
              url_2 = '#';
            } else if (res.video && res.audio) {
              url = res.video.replace('http://', 'https://');
              url_2 = res.audio.replace('http://', 'https://');
            } else {
              message_Message.warning('数据错误');
              return;
            }
            $('#video_url').attr('href', url);
            $('#video_url').attr('download', vb.filename() + Download.url_format(url));
            $('#video_download').show();
            if (url_2 !== '#') {
              $('#video_url_2').attr('href', url_2);
              $('#video_url_2').attr('download', vb.filename() + '_audio.mp4');
              $('#video_download_2').show();
            }
            if (user.needReplace() || vb.isLimited() || config_config.replace_force === '1') {
              player.replace_player(url, url_2);
            }
            if (config_config.auto_download === '1') {
              $('#video_download').click();
            }
          }
        });
      },
      download_danmaku() {
        const vb = video.base();
        Download.download_danmaku_ass(vb.cid(), vb.filename());
      },
      download_subtitle() {
        Download.download_subtitle_vtt(0, video.base().filename());
      },
      video_download_all() {
        user.lazyInit(true); // init
        if (auth.hasAuth()) {
          if (config_config.download_type === 'rpc') {
            Download.download_all();
          } else {
            MessageBox.confirm('仅支持使用RPC接口批量下载，请确保RPC环境正常，是否继续？', () => {
              Download.download_all();
            });
          }
        } else {
          MessageBox.confirm('批量下载仅支持授权用户使用RPC接口下载，是否进行授权？', () => {
            auth.login();
          });
        }
      },
      video_download() {
        const type = config_config.download_type;
        if (type === 'web') {
          $('#video_url')[0].click();
        } else if (type === 'a') {
          const [video_url, video_url_2, file_name, file_name_2] = [$('#video_url').attr('href'), $('#video_url_2').attr('href'), $('#video_url').attr('download'), $('#video_url_2').attr('download')];
          const msg = '建议使用IDM、FDM等软件安装其浏览器插件后，鼠标右键点击链接下载~<br/><br/>' + `<a href="${video_url}" download="${file_name}" target="_blank" style="text-decoration:underline;">&gt视频地址&lt</a><br/><br/>` + (config_config.format === 'dash' ? `<a href="${video_url_2}" download="${file_name_2}" target="_blank" style="text-decoration:underline;">&gt音频地址&lt</a>` : '');
          MessageBox.alert(msg);
        } else if (type === 'aria') {
          const [video_url, video_url_2] = [$('#video_url').attr('href'), $('#video_url_2').attr('href')];
          const video_title = video.base().filename();
          const [file_name, file_name_2] = [video_title + Download.url_format(video_url), video_title + '.m4a'];
          const aria2c_header = `--header "User-Agent: ${window.navigator.userAgent}" --header "Referer: ${window.location.href}"`;
          const [url_max_connection, server_max_connection] = {
            min: [1, 5],
            mid: [16, 8],
            max: [32, 16]
          }[config_config.aria2c_connection_level] || [1, 5];
          const aria2c_max_connection_parameters = `--max-concurrent-downloads ${url_max_connection} --max-connection-per-server ${server_max_connection}`;
          const [code, code_2] = [`aria2c "${video_url}" --out "${file_name}"`, `aria2c "${video_url_2}" --out "${file_name_2}"`].map(code => `${code} ${aria2c_header} ${aria2c_max_connection_parameters} ${config_config.aria2c_addition_parameters}`);
          const msg = '点击文本框即可复制下载命令！<br/><br/>' + `视频：<br/><input id="aria2_code" value='${code}' onclick="bp_clip_btn('aria2_code')" style="width:100%;"></br></br>` + (config_config.format === 'dash' ? `音频：<br/><input id="aria2_code_2" value='${code_2}' onclick="bp_clip_btn('aria2_code_2')" style="width:100%;"><br/><br/>` + `全部：<br/><textarea id="aria2_code_all" onclick="bp_clip_btn('aria2_code_all')" style="min-width:100%;max-width:100%;min-height:100px;max-height:100px;">${code}\n${code_2}</textarea>` : '');
          !window.bp_clip_btn && (window.bp_clip_btn = id => {
            $(`#${id}`).select();
            if (document.execCommand('copy')) {
              message_Message.success('复制成功');
            } else {
              message_Message.warning('复制失败');
            }
          });
          MessageBox.alert(msg);
        } else {
          const url = $('#video_url').attr('href');
          const filename = video.base().filename() + Download.url_format(url);
          Download.download(url, filename, type);
        }
      },
      video_download_2() {
        const type = config_config.download_type;
        if (type === 'web') {
          $('#video_url_2')[0].click();
        } else if (type === 'a') {
          $('#video_download').click();
        } else if (type === 'aria') {
          $('#video_download').click();
        } else {
          const url = $('#video_url_2').attr('href');
          const filename = video.base().filename() + '.m4a';
          Download.download(url, filename, type);
        }
      },
      bilibili_card_parse() {
        user.lazyInit(true); // init
        const bvId = this.id; // 或 $(this).attr('id')，等价
        video.card(bvId).then(vb => {
          const [type, aid, p, cid, epid] = [vb.type(), vb.aid(), vb.p(), vb.cid(), vb.epid()];
          const {
            q
          } = video.get_quality();
          api_url = `${config_config.base_api}?av=${aid}&p=${p}&cid=${cid}&ep=${epid}&q=${q}&type=${type}&format=${config_config.format}&otype=json&_host=${config_config.host_key}&_req=${config_config.request_type}&_q=${config_config.video_quality}`;
          const [auth_id, auth_sec] = [store.get('auth_id'), store.get('auth_sec')];
          if (auth_id && auth_sec) {
            api_url += `&auth_id=${auth_id}&auth_sec=${auth_sec}`;
          }
          api_url_temp = api_url;
          message_Message.info('开始请求');
          api.get_card_url(vb, res => {
            if (res && !res.code) {
              message_Message.success('请求成功');
              res.times && message_Message.info(`剩余请求次数：${res.times}`);
              let url, url_2;
              if (res.url) {
                url = res.url.replace('http://', 'https://');
                url_2 = '#';
              } else if (res.video && res.audio) {
                url = res.video.replace('http://', 'https://');
                url_2 = res.audio.replace('http://', 'https://');
              } else {
                message_Message.warning('数据错误');
                return;
              }
              const filename = vb.pupdate() + '-' + vb.filename() + Download.url_format(url);
              Download.download(url, filename, 'rpc');
            }
          });
        });
      }
    };

    // api & click
    window.bpd = evt;
    Object.entries(evt).forEach(_ref => {
      let [k, v] = _ref;
      return $('body').on('click', `#${k}`, v);
    });
    Object.entries(evt).forEach(_ref2 => {
      let [k, v] = _ref2;
      return $('body').on('click', `.${k}`, v);
    });

    // part of check
    $('body').on('click', 'a.router-link-active', function () {
      if (this !== $('li[class="on"]').find('a')[0]) {
        check.refresh();
      }
    });
    $('body').on('click', 'li.ep-item', () => {
      check.refresh();
    });
    $('body').on('click', 'button.bilibili-player-iconfont-next', () => {
      check.refresh();
    });
    // 监听q
    $('body').on('click', 'li.bui-select-item', () => {
      check.refresh();
    });
    // 监听aid
    $('body').on('click', '.rec-list', () => {
      check.refresh();
    });
    $('body').on('click', '.bilibili-player-ending-panel-box-videos', () => {
      check.refresh();
    });
    // 定时检查
    setInterval(() => {
      if (check.href !== location.href) {
        check.refresh();
      }
    }, 500);
    setInterval(() => {
      try {
        const vb = video.base();
        if (check.aid !== vb.aid() || check.cid !== vb.cid()) {
          check.refresh();
        }
      } catch (error) {}
    }, 1500);
  }
}
/* harmony default export */ var main = (Main);
;// ./src/js/index.js

(() => {
  'use strict';

  if (window.bp_fun_locked) return;
  window.bp_fun_locked = true;

  // error page
  if ($('.error-text')[0]) {
    return;
  }
  setTimeout(() => {
    new main().run();
  }, 5000);
})();
/******/ })()
;