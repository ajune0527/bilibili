// ==UserScript==
// @name          bilibili视频下载 by ajune0527 (fork by injahow)
// @namespace     https://github.com/ajune0527
// @version       2.6.3
// @description   支持Web、RPC、Blob、Aria等下载方式；支持下载flv、dash、mp4视频格式；支持下载港区番剧；支持下载字幕弹幕；支持换源播放等功能
// @author        ajune0527
// @copyright     2025, ajune0527 (https://github.com/ajune0527)
// @license       MIT
// @source        https://github.com/ajune0527/bilibili
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
// @compatible    chrome
// @compatible    firefox
// @grant         none
// ==/UserScript==
/* globals $ waitForKeyElements */
// @[ You can find all source codes in GitHub repo ]
!function() {
    "use strict";
    const user = new class {
        constructor() {
            this.is_login = !1, this.vip_status = 0, this.mid = "", this.uname = "", this.has_init = !1, 
            this.lazyInit();
        }
        needReplace() {
            return !this.is_login || !this.vip_status && video.base().needVip();
        }
        isVIP() {
            return 1 === this.vip_status;
        }
        lazyInit(last_init) {
            this.has_init || (window.__BILI_USER_INFO__ ? (this.is_login = window.__BILI_USER_INFO__.isLogin, 
            this.vip_status = window.__BILI_USER_INFO__.vipStatus, this.mid = window.__BILI_USER_INFO__.mid || "", 
            this.uname = window.__BILI_USER_INFO__.uname || "") : window.__BiliUser__ && (this.is_login = window.__BiliUser__.isLogin, 
            window.__BiliUser__.cache ? (this.vip_status = window.__BiliUser__.cache.data.vipStatus, 
            this.mid = window.__BiliUser__.cache.data.mid || "", this.uname = window.__BiliUser__.cache.data.uname || "") : (this.vip_status = 0, 
            this.mid = "", this.uname = "")), this.has_init = last_init);
        }
    };
    class CacheFactory {
        static get() {
            let name = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "default", cache = CacheFactory.map[name];
            return cache instanceof Cache || (cache = new Cache, CacheFactory.map[name] = cache), 
            cache;
        }
        static setValue() {
            let key = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", value = arguments.length > 1 ? arguments[1] : void 0, [cacheName, cacheKey] = key.split(".", 2);
            if (!cacheName || !cacheKey) return;
            const cache = CacheFactory.get(cacheName);
            cache instanceof Cache && cache.set(cacheKey, value);
        }
        static clear(name) {
            name ? CacheFactory.get(name).clear() : CacheFactory.map = {};
        }
    }
    !function _defineProperty(e, r, t) {
        return (r = function _toPropertyKey(t) {
            var i = function _toPrimitive(t, r) {
                if ("object" != typeof t || !t) return t;
                var e = t[Symbol.toPrimitive];
                if (void 0 !== e) {
                    var i = e.call(t, r || "default");
                    if ("object" != typeof i) return i;
                    throw new TypeError("@@toPrimitive must return a primitive value.");
                }
                return ("string" === r ? String : Number)(t);
            }(t, "string");
            return "symbol" == typeof i ? i : i + "";
        }(r)) in e ? Object.defineProperty(e, r, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[r] = t, e;
    }(CacheFactory, "map", {});
    class Cache {
        constructor() {
            this.data = {};
        }
        get() {
            let key = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
            return this.data[key];
        }
        set() {
            let key = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", value = arguments.length > 1 ? arguments[1] : void 0;
            this.data[key] = value;
        }
        clear() {
            this.data = {};
        }
    }
    var cache = CacheFactory;
    const scroll_scroll = {
        show: function show_scroll() {
            $("div#bp_config").is(":hidden") && $("div#message_box").is(":hidden") && $("body").css("overflow", "auto");
        },
        hide: function hide_scroll() {
            $("body").css("overflow", "hidden");
        }
    };
    var message = '<div class="message-bg"></div> <div id="message_box"> <div class="message-box-mark"></div> <div class="message-box-bg"> <span style="font-size:20px"><b>提示：</b></span> <div id="message_box_context" style="margin:2% 0">...</div><br/><br/> <div class="message-box-btn"> <button name="affirm">确定</button> <button name="cancel">取消</button> </div> </div> </div> <style>.message-bg{position:fixed;float:right;right:0;top:2%;z-index:30000}.message{margin-bottom:15px;padding:2% 2%;width:300px;display:flex;margin-top:-70px;opacity:0}.message-success{background-color:#dfd;border-left:6px solid #4caf50}.message-error{background-color:#fdd;border-left:6px solid #f44336}.message-info{background-color:#e7f3fe;border-left:6px solid #0c86de}.message-warning{background-color:#ffc;border-left:6px solid #ffeb3b}.message-context{font-size:21px;word-wrap:break-word;word-break:break-all}.message-context p{margin:0}#message_box{opacity:0;display:none;position:fixed;inset:0px;top:0;left:0;width:100%;height:100%;z-index:20000}.message-box-bg{position:absolute;background:#fff;border-radius:10px;padding:20px;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;z-index:20001}.message-box-mark{width:100%;height:100%;position:fixed;top:0;left:0;background:rgba(0,0,0,.5);z-index:20000}.message-box-btn{text-align:right}.message-box-btn button{margin:0 5px;width:120px;height:40px;border-width:0;border-radius:3px;background:#1e90ff;cursor:pointer;outline:0;color:#fff;font-size:17px}.message-box-btn button:hover{background:#59f}</style> ';
    function messageBox(ctx, type) {
        "confirm" === type ? $('.message-box-btn button[name="cancel"]').show() : "alert" === type && $('.message-box-btn button[name="cancel"]').hide(), 
        ctx.html ? $("#message_box_context").html(`<div style="font-size:18px">${ctx.html}</div>`) : $("#message_box_context").html('<div style="font-size:18px">╰(￣▽￣)╮</div>'), 
        scroll_scroll.hide(), $("#message_box").show(), $("#message_box").animate({
            opacity: "1"
        }, 300);
        const option = {
            affirm: () => {
                $("#message_box").hide(), $("#message_box").css("opacity", 0), scroll_scroll.show(), 
                ctx.callback && ctx.callback.affirm && ctx.callback.affirm();
            },
            cancel: () => {
                $("#message_box").hide(), $("#message_box").css("opacity", 0), scroll_scroll.show(), 
                ctx.callback && ctx.callback.cancel && ctx.callback.cancel();
            }
        };
        return $('.message-box-btn button[name="affirm"]')[0].onclick = option.affirm, $('.message-box-btn button[name="cancel"]')[0].onclick = option.cancel, 
        option;
    }
    let id = 0;
    function message_message(html, type) {
        id += 1, function messageEnQueue(message, id) {
            $(".message-bg").append(message), $(`#message_${id}`).animate({
                "margin-top": "+=70px",
                opacity: "1"
            }, 300);
        }(`<div id="message_${id}" class="message message-${type}"><div class="message-context"><p><strong>${type}：</strong></p><p>${html}</p></div></div>`, id), 
        function messageDeQueue(id) {
            let time = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 3;
            setTimeout((() => {
                const e = `div#message_${id}`;
                $(e).animate({
                    "margin-top": "-=70px",
                    opacity: "0"
                }, 300, (() => {
                    $(e).remove();
                }));
            }), 1e3 * time);
        }(id, 3);
    }
    const message_Message_success = html => message_message(html, "success"), message_Message_warning = html => message_message(html, "warning"), message_Message_error = html => message_message(html, "error"), message_Message_info = html => message_message(html, "info"), message_Message_miaow = () => message_message("(^・ω・^)~喵喵喵~", "info"), MessageBox_alert = (html, affirm) => messageBox({
        html: html,
        callback: {
            affirm: affirm
        }
    }, "alert"), MessageBox_confirm = (html, affirm, cancel) => messageBox({
        html: html,
        callback: {
            affirm: affirm,
            cancel: cancel
        }
    }, "confirm");
    function ajax(obj) {
        return new Promise(((resolve, reject) => {
            obj.success = res => {
                res && res.code && message_Message_warning(`${res.message || `CODE:${res.code}`}`), 
                resolve(res);
            }, obj.error = err => {
                message_Message_error("网络异常"), reject(err);
            }, $.ajax(obj);
        }));
    }
    function _ajax(obj) {
        return new Promise(((resolve, reject) => {
            const _success = obj.success;
            obj.success = res => {
                resolve(_success ? _success(res) : res);
            };
            const _error = obj.error;
            obj.error = res => {
                reject(_error ? _error(res) : res);
            }, $.ajax(obj);
        }));
    }
    // @ts-nocheck
    const levels = {
        log: 0,
        debug: 1,
        info: 2,
        warn: 3,
        error: 4
    };
    let currentLevel = levels.warn;
    function logMessage(level) {
        if (levels[level] >= currentLevel) {
            const timestamp = (new Date).toISOString();
            for (var _len = arguments.length, messages = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) messages[_key - 1] = arguments[_key];
            const formattedMessages = messages.map((message => message));
            console[level](`[${timestamp}] [${level.toUpperCase()}]`, ...formattedMessages), 
            "error" === level && messages[0] instanceof Error && messages[0].stack && console[level](messages[0].stack);
        }
    }
    const Logger = {
        setLogLevel: function setLogLevel(level) {
            void 0 !== levels[level] ? currentLevel = levels[level] : console.warn(`Unknown log level: ${level}`);
        },
        log: function() {
            for (var _len2 = arguments.length, messages = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) messages[_key2] = arguments[_key2];
            return logMessage("log", ...messages);
        },
        debug: function() {
            for (var _len3 = arguments.length, messages = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) messages[_key3] = arguments[_key3];
            return logMessage("debug", ...messages);
        },
        info: function() {
            for (var _len4 = arguments.length, messages = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) messages[_key4] = arguments[_key4];
            return logMessage("info", ...messages);
        },
        warn: function() {
            for (var _len5 = arguments.length, messages = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) messages[_key5] = arguments[_key5];
            return logMessage("warn", ...messages);
        },
        error: function() {
            for (var _len6 = arguments.length, messages = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) messages[_key6] = arguments[_key6];
            return logMessage("error", ...messages);
        }
    };
    var logger = Logger;
    const clazzMap = {};
    class VideoBase {
        constructor(video_type, main_title, state) {
            this.constructor.name in clazzMap || (clazzMap[this.constructor.name] = this.constructor), 
            this.video_type = video_type || "video", this.main_title = main_title || "", this.state = state, 
            this.page = state && parseInt(state.p) || 1, this.data = {};
        }
        getVideo(p) {
            let prop = {
                p: p,
                id: 0,
                title: "",
                filename: "",
                aid: 0,
                bvid: "",
                cid: 0,
                epid: 0,
                needVip: !1,
                vipNeedPay: !1,
                isLimited: !1
            };
            const clazz = clazzMap[this.constructor.name];
            return prop = {
                ...prop,
                ...Object.fromEntries(Object.getOwnPropertyNames(VideoBase.prototype).filter((key => key in prop)).map((key => [ key, clazz.prototype[key].call(this, p) ])))
            }, prop;
        }
        type() {
            return this.video_type;
        }
        getName() {
            return this.main_title || "";
        }
        getFilename() {
            return this.getName().replace(/[\/\\:*?"<>|]+/g, "");
        }
        p(p) {
            return (p = parseInt(p) || 0) > 0 && p <= this.total() ? p : this.page;
        }
        id(p) {
            return this.p(p) - 1;
        }
        total() {
            return 0;
        }
        title() {
            return "";
        }
        filename() {
            return "";
        }
        aid() {
            return 0;
        }
        bvid() {
            return "";
        }
        cid() {
            return 0;
        }
        epid() {
            return "";
        }
        needVip() {
            return !1;
        }
        vipNeedPay() {
            return !1;
        }
        isLimited() {
            return !1;
        }
        pupdate() {
            return "";
        }
    }
    class VideoCard extends VideoBase {
        constructor(main_title, state, data) {
            super("video", main_title, state), this.state = state, this.page = state && parseInt(state.p) || 1, 
            this.data = data;
        }
        type() {
            return this.video_type;
        }
        getName() {
            return this.main_title || "";
        }
        getFilename() {
            return this.getName().replace(/[\/\\:*?"<>|]+/g, "");
        }
        p(p) {
            return (p = parseInt(p) || 0) > 0 && p <= this.total() ? p : this.page;
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
            return null === (_this$data = this.data) || void 0 === _this$data ? void 0 : _this$data.aid;
        }
        bvid() {
            var _this$data2;
            return null === (_this$data2 = this.data) || void 0 === _this$data2 ? void 0 : _this$data2.bvid;
        }
        cid() {
            var _this$data3;
            return null === (_this$data3 = this.data) || void 0 === _this$data3 ? void 0 : _this$data3.cid;
        }
        epid() {
            return "";
        }
        needVip() {
            return !1;
        }
        vipNeedPay() {
            return !1;
        }
        isLimited() {
            return !1;
        }
        pupdate() {
            const date = new Date(1e3 * this.data.pubdate);
            return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
        }
    }
    class Video extends VideoBase {
        constructor(main_title, state) {
            var _state$sectionsInfo;
            super("video", main_title, state), this.video_list = [];
            const sections = state.sections || (null === (_state$sectionsInfo = state.sectionsInfo) || void 0 === _state$sectionsInfo ? void 0 : _state$sectionsInfo.sections) || [];
            if (!sections.length) return;
            let new_page = 0, i = 1;
            for (const section of sections) {
                const eplist = section.episodes || [];
                for (const ep of eplist) this.video_list.push(ep), state.videoData.bvid == ep.bvid && (new_page = i), 
                i++;
            }
            new_page < 1 ? this.video_list = [] : super.page = new_page;
        }
        total() {
            return this.video_list.length > 0 ? this.video_list.length : this.state.videoData.pages.length;
        }
        title(p) {
            const id = this.id(p);
            return this.video_list.length > 0 ? this.video_list[id].title : this.state.videoData.pages[id].part;
        }
        filename(p) {
            if (this.video_list.length > 0) return this.title(p).replace(/[\/\\:*?"<>|]+/g, "");
            const id = this.id(p);
            let prefix = this.pupdate();
            prefix && (prefix = `${prefix}-`);
            return (prefix + this.main_title + (this.total() > 1 ? ` P${id + 1} ${this.state.videoData.pages[id].part || ""}` : "")).replace(/[\/\\:*?"<>|]+/g, "");
        }
        aid(p) {
            return this.video_list.length > 0 ? this.video_list[this.id(p)].aid : this.state.videoData.aid;
        }
        bvid(p) {
            return this.video_list.length > 0 ? this.video_list[this.id(p)].bvid : this.state.videoData.bvid;
        }
        cid(p) {
            return this.video_list.length > 0 ? this.video_list[this.id(p)].cid : this.state.videoData.pages[this.id(p)].cid;
        }
        pupdate() {
            try {
                var _this$state;
                const date = new Date(1e3 * (null === (_this$state = this.state) || void 0 === _this$state || null === (_this$state = _this$state.videoData) || void 0 === _this$state ? void 0 : _this$state.pubdate)), yyyy = date.getFullYear(), mm = String(date.getMonth() + 1).padStart(2, "0");
                return `${yyyy}${mm}${String(date.getDate()).padStart(2, "0")}`;
            } catch (error) {
                return "";
            }
        }
    }
    class VideoList extends VideoBase {
        constructor(main_title, state) {
            super("video", main_title, state), this.video = new Video(state.videoData.title, state);
            const resourceList = state.resourceList || [], video_list = [];
            for (const video of resourceList) {
                let i = 0, length = video.pages && video.pages.length || 0;
                for (;i < length; ) {
                    const _video = Object.assign({}, video);
                    _video.title = video.title + (length > 1 ? ` P${i + 1} ${video.pages[i].title}` : ""), 
                    _video.cid = video.pages[i].cid || 0, video_list.push(_video), i++;
                }
            }
            this.video_list = video_list;
        }
        total() {
            return this.video_list.length;
        }
        title(p) {
            return p ? this.video_list[this.id(p)].title : this.video.title();
        }
        filename(p) {
            if (!p) return this.video.filename();
            const id = this.id(p);
            return (this.main_title + (this.total() > 1 ? ` P${id + 1} ${this.video_list[id].title}` : "")).replace(/[\/\\:*?"<>|]+/g, "");
        }
        aid(p) {
            return p ? this.video_list[this.id(p)].aid : this.video.aid();
        }
        bvid(p) {
            return p ? this.video_list[this.id(p)].bvid : this.video.bvid();
        }
        cid(p) {
            return p ? this.video_list[this.id(p)].cid : this.video.cid();
        }
    }
    class VideoFestival extends VideoBase {
        constructor(main_title, state) {
            super("video", main_title, state), this.video_info = state.videoInfo, this.video_list = state.sectionEpisodes || [];
        }
        total() {
            return this.video_list.length;
        }
        title(p) {
            return p ? this.video_list[this.id(p)].title : this.video_info.title;
        }
        filename(p) {
            let title;
            if (p) {
                const id = this.id(p);
                title = this.main_title + (this.total() > 1 ? ` P${id + 1} ${this.video_list[id].title}` : "");
            } else title = this.video_info.title;
            return title.replace(/[\/\\:*?"<>|]+/g, "");
        }
        aid(p) {
            return p ? this.video_list[this.id(p)].id : this.video_info.aid;
        }
        bvid(p) {
            return p ? this.video_list[this.id(p)].bvid : this.video_info.bvid;
        }
        cid(p) {
            return p ? this.video_list[this.id(p)].cid : this.video_info.cid;
        }
    }
    class Bangumi extends VideoBase {
        constructor(main_title, state) {
            super("bangumi", main_title, state), this.epInfo = state.epInfo, this.epList = state.epList, 
            this.epId = state.epId, this.epMap = state.epMap, this.isEpMap = state.isEpMap;
        }
        static build() {
            const bangumiCache = cache.get("Bangumi");
            if (location.href == bangumiCache.get("href") && bangumiCache.get("build")) return bangumiCache.get("build");
            bangumiCache.set("build", null);
            let main_title, sid, epid, epMap = {};
            const pathname = location.pathname.toLowerCase();
            pathname.startsWith("/bangumi/play/ss") ? (sid = pathname.match(/ss(\d+)/), sid = parseInt(sid[1])) : pathname.startsWith("/bangumi/play/ep") && (epid = pathname.match(/ep(\d+)/), 
            epid = parseInt(epid[1]));
            try {
                logger.debug("location sid:", sid, "epid:", epid);
                const page_data = JSON.parse($(".toolbar").attr("mr-show"));
                main_title = page_data.msg.title, sid = sid || page_data.msg.season_id, epid = epid || page_data.msg.ep_id, 
                logger.debug("mr-show get sid:", sid, "epid:", epid);
            } catch {
                console.warn("mr-show get err");
            }
            if (sid != bangumiCache.get("sid") && (bangumiCache.set("sid", sid), bangumiCache.set("epid", ""), 
            bangumiCache.set("hasData", !1)), sid && !epid && _ajax({
                type: "GET",
                url: `https://api.bilibili.com/pgc/player/web/v2/playurl?support_multi_audio=true&qn=80&fnver=0&fnval=4048&fourk=1&gaia_source=&from_client=BROWSER&is_main_page=true&need_fragment=true&season_id=${sid}&isGaiaAvoided=false&voice_balance=1&drm_tech_type=2`,
                dataType: "json",
                xhrFields: {
                    withCredentials: !0
                }
            }).then((res => {
                res && !res.code && bangumiCache.set("epid", res.result.view_info.report.ep_id);
            })), bangumiCache.get("lock")) throw "bangumiCache request waiting !";
            if (bangumiCache.set("lock", !0), sid = sid || "", epid = epid || "", _ajax({
                type: "GET",
                url: `https://api.bilibili.com/pgc/view/web/ep/list?season_id=${sid}&ep_id=${epid}`,
                dataType: "json",
                cache: !0
            }).then((res => {
                res && !res.code && (bangumiCache.set("hasData", !0), bangumiCache.set("episodes", res.result.episodes || []), 
                bangumiCache.set("section", res.result.section || []));
            })).finally((() => {
                bangumiCache.set("lock", !1);
            })), bangumiCache.set("href", location.href), !epid && !bangumiCache.get("epid")) throw "epid not found !";
            if (!bangumiCache.get("hasData")) throw "bangumiCache no data !";
            let episodes = bangumiCache.get("episodes") || [];
            episodes = [ ...episodes.filter((a => 1 != a.badge_type)), ...episodes.filter((a => 1 == a.badge_type)) ];
            const isEpMap = {};
            for (const ep of episodes) [ 0, 2, 3 ].includes(ep.badge_type) && (isEpMap[ep.id] = !0);
            const section = bangumiCache.get("section") || [];
            for (const item of section) if (item.episodes) for (const ep of item.episodes) episodes.push(ep);
            epid = epid || bangumiCache.get("epid");
            let _id = 0;
            for (let i = 0; i < episodes.length; i++) epMap[episodes[i].id] = episodes[i], episodes[i].id == epid && (_id = i);
            const state = {
                p: _id + 1,
                epId: epid,
                epList: episodes,
                isEpMap: isEpMap,
                epMap: epMap,
                epInfo: epMap[epid]
            }, bangumi = new Bangumi(main_title, state);
            return bangumiCache.set("build", bangumi), bangumi;
        }
        total() {
            return this.epList.length;
        }
        getEpisode(p) {
            return p ? this.epList[this.id(p)] : this.epMap[this.epId] || this.epInfo || {};
        }
        getEpPadLen() {
            let n = Object.keys(this.isEpMap).length, len = n < 10 ? 1 : 0;
            for (;n >= 1; ) n /= 10, len++;
            return len;
        }
        title(p) {
            const ep = this.getEpisode(p);
            let title = "";
            if (this.isEpMap[ep.id]) {
                const epNum = Object.keys(this.isEpMap).length > 1 ? `EP${("" + this.p(p)).padStart(this.getEpPadLen(), "0")}` : "";
                title = `${this.main_title} ${epNum} ${ep.long_title}`;
            } else ep.share_copy ? (title = ep.share_copy.split("》", 2), title = title.length > 1 ? `${this.main_title} ${title[1]}` : `${this.main_title} ${ep.title} ${ep.long_title}`) : title = `${ep.title} ${ep.long_title}`;
            return title.replaceAll("undefined", "").replaceAll("  ", " ").trim();
        }
        filename(p) {
            return this.title(p).replace(/[\/\\:*?"<>|]+/g, "");
        }
        aid(p) {
            return this.getEpisode(p).aid;
        }
        bvid(p) {
            return this.getEpisode(p).bvid;
        }
        cid(p) {
            return this.getEpisode(p).cid;
        }
        epid(p) {
            return this.getEpisode(p).id;
        }
        needVip(p) {
            return "会员" === this.getEpisode(p).badge;
        }
        vipNeedPay(p) {
            return "付费" === this.getEpisode(p).badge;
        }
        isLimited() {
            return !1;
        }
    }
    class Cheese extends VideoBase {
        constructor(main_title, state) {
            super("cheese", main_title, state), this.episodes = state.episodes;
        }
        static build() {
            const cheeseCache = cache.get("Cheese"), sid = (location.href.match(/\/cheese\/play\/ss(\d+)/i) || [ "", "" ])[1];
            let epid;
            if (sid || (epid = (location.href.match(/\/cheese\/play\/ep(\d+)/i) || [ "", "" ])[1]), 
            epid || (epid = parseInt($(".bpx-state-active").eq(0).attr("data-episodeid"))), 
            sid && sid != cheeseCache.get("sid") && (cheeseCache.set("sid", sid), cheeseCache.set("episodes", null)), 
            !cheeseCache.get("episodes")) {
                if (cheeseCache.get("lock")) throw "cheese request waiting !";
                if (cheeseCache.set("lock", !0), !sid && !epid) return void logger.error("get_season error");
                _ajax({
                    url: `https://api.bilibili.com/pugv/view/web/season?season_id=${sid || ""}&ep_id=${epid || ""}`,
                    xhrFields: {
                        withCredentials: !0
                    },
                    dataType: "json"
                }).then((res => {
                    res.code ? Message.warning("获取剧集信息失败") : cheeseCache.set("episodes", res.data.episodes);
                })).finally((() => {
                    cheeseCache.set("lock", !1);
                }));
            }
            const episodes = cheeseCache.get("episodes");
            if (!episodes) throw "cheese has not data !";
            let _id = -1;
            for (let i = 0; i < episodes.length; i++) {
                if (!epid) {
                    epid = episodes[i].id, _id = 0;
                    break;
                }
                if (episodes[i].id == epid) {
                    _id = i;
                    break;
                }
            }
            if (_id < 0) throw cheeseCache.set("episodes", null), "episodes need reload !";
            const main_title = ($("div.archive-title-box").text() || "unknown").replace(/[\/\\:*?"<>|]+/g, "");
            return new Cheese(main_title, {
                p: _id + 1,
                episodes: episodes
            });
        }
        total() {
            return this.episodes.length;
        }
        title(p) {
            return this.episodes[this.id(p)].title;
        }
        filename(p) {
            return `${this.main_title} EP${this.p(p)} ${this.title(p)}`.replace(/[\/\\:*?"<>|]+/g, "");
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
    function type() {
        const routerMap = {
            video: /^\/video\//,
            list: /^\/list\//,
            festival: /^\/festival\//,
            bangumi: /^\/bangumi\/play\//,
            cheese: /^\/cheese\/play\//,
            card: /\/upload\/video/
        };
        for (const key in routerMap) if (routerMap[key].test(location.pathname)) return key;
        return "?";
    }
    const q_map = {
        "8K 超高清": 127,
        "4K 超清": 120,
        "1080P 60帧": 116,
        "1080P 高码率": 112,
        "1080P 高清": 80,
        "720P 高清": 64,
        "480P 清晰": 32,
        "360P 流畅": 16,
        "自动": 32
    };
    const video = {
        type: type,
        base: function base() {
            const _type = type();
            let vb = new VideoBase;
            if ("card" === _type) vb = new VideoCard("video"); else if ("video" === _type) {
                const state = window.__INITIAL_STATE__, main_title = state.videoData && state.videoData.title;
                vb = new Video(main_title, state);
            } else if ("list" === _type) {
                const state = window.__INITIAL_STATE__, main_title = state.mediaListInfo && state.mediaListInfo.upper.name + "-" + state.mediaListInfo.title;
                vb = new VideoList(main_title, state);
            } else if ("festival" === _type) {
                const state = window.__INITIAL_STATE__, main_title = state.title;
                vb = new VideoFestival(main_title, state);
            } else "bangumi" === _type ? vb = Bangumi.build() : "cheese" === _type && (vb = Cheese.build());
            return vb;
        },
        card: async function card() {
            let bvid = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
            const res = await $.ajax({
                type: "GET",
                url: `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
                dataType: "json",
                xhrFields: {
                    withCredentials: !0
                }
            }), data = res.code ? {} : res.data;
            return new VideoCard(data.title, data, data);
        },
        get_quality: function get_quality() {
            let _q = 0, _q_max = 0;
            const _type = type();
            if ("cheese" === _type) {
                const q = $("div.edu-player-quality-item.active span").text(), q_max = $($("div.edu-player-quality-item span").get(0)).text();
                _q = q in q_map ? q_map[q] : 0, _q_max = q_max in q_map ? q_map[q_max] : 0;
            } else {
                const keys = Object.keys(videoQualityMap), q = parseInt(("video" === _type ? $("li.bpx-player-ctrl-quality-menu-item.bpx-state-active") : $("li.squirtle-select-item.active")).attr("data-value")), q_max = parseInt($(("video" === _type ? $("li.bpx-player-ctrl-quality-menu-item") : $("li.squirtle-select-item")).get(0)).attr("data-value"));
                _q = keys.indexOf(`${q}`) > -1 ? q : 0, _q_max = keys.indexOf(`${q_max}`) > -1 ? q_max : 0;
            }
            return !_q && (_q = 80), !_q_max && (_q_max = 80), user.isVIP() || (_q = _q > 80 ? 80 : _q), 
            {
                q: _q,
                q_max: _q_max
            };
        },
        get_quality_support: function get_quality_support() {
            let list, quality_list = [];
            const _type = type();
            if ("cheese" === _type) list = $("div.edu-player-quality-item span"), list.each((function() {
                const k = $(this).text();
                q_map[k] && quality_list.push(q_map[k]);
            })); else {
                const keys = Object.keys(videoQualityMap);
                list = [ "video", "list" ].includes(_type) ? $("li.bpx-player-ctrl-quality-menu-item") : $("li.squirtle-select-item"), 
                list && list.length && list.each((function() {
                    const q = `${parseInt($(this).attr("data-value"))}`;
                    keys.indexOf(q) > -1 && quality_list.push(q);
                }));
            }
            return quality_list.length ? quality_list : [ "80", "64", "32", "16" ];
        }
    };
    const store = new class {
        constructor() {
            this.prefix = "bp_";
        }
        get() {
            let key = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
            return localStorage.getItem(this.prefix + key) || "";
        }
        set() {
            let key = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", value = arguments.length > 1 ? arguments[1] : void 0;
            localStorage.setItem(this.prefix + key, value);
        }
    };
    function get_url_base(page, quality, video_format, success, error, request_type) {
        let _success, _error;
        _success = "function" == typeof success ? e => {
            success(e);
        } : res => logger.debug(res), _error = "function" == typeof error ? e => {
            message_Message_error("请求失败"), error(e);
        } : err => console.error(err);
        const vb = video.base(), [aid, bvid, cid, epid, q, type] = [ vb.aid(page), vb.bvid(page), vb.cid(page), vb.epid(page), quality || video.get_quality().q, vb.type() ];
        let format = video_format || config_config.format;
        "auto" === request_type && user.needReplace() && (request_type = "remote");
        const url_replace_cdn = url => {
            if ("0" === config_config.host_key) return url;
            const url_tmp = url.split("/"), mapping = hostMap[config_config.host_key];
            return "string" == typeof mapping && mapping.length ? mapping.at(0).match(/[a-z]/) && (url_tmp[2] = mapping) : "function" == typeof mapping && (url_tmp[2] = mapping()), 
            url = url_tmp.join("/");
        };
        let base_api;
        const ajax_obj = {
            type: "GET",
            dataType: "json"
        };
        if ("auto" === request_type || "local" === request_type) {
            let fnver, fnval;
            "cheese" === type ? (base_api = "https://api.bilibili.com/pugv/player/web/playurl", 
            fnver = "mp4" === format ? 1 : 0, fnval = 80) : (base_api = "video" === type ? "https://api.bilibili.com/x/player/playurl" : "https://api.bilibili.com/pgc/player/web/playurl", 
            fnver = 0, fnval = {
                dash: 4048,
                flv: 4049,
                mp4: 0
            }[format] || 0), base_api += `?avid=${aid}&bvid=${bvid}&cid=${cid}&qn=${q}&fnver=${fnver}&fnval=${fnval}&fourk=1&ep_id=${epid}&type=${format}&otype=json`, 
            base_api += "mp4" === format ? "&platform=html5&high_quality=1" : "", ajax_obj.xhrFields = {
                withCredentials: !0
            };
        } else {
            base_api = config_config.base_api, base_api += `?av=${aid}&bv=${bvid}&cid=${cid}&ep=${epid}&q=${q}&type=${type}&format=${format}&otype=json`, 
            page && (base_api += "&s");
            const [auth_id, auth_sec] = [ store.get("auth_id"), store.get("auth_sec") ];
            auth_id && auth_sec && (base_api += `&auth_id=${auth_id}&auth_sec=${auth_sec}`);
        }
        const resultConvertor = (data, _success) => {
            const checkTask = (key, backup_key) => data[backup_key] ? _ajax({
                type: "GET",
                url: data[key],
                cache: !1,
                timeout: 1e3,
                success: function(res) {
                    return key;
                },
                error: function(res) {
                    return "timeout" == res.statusText ? key : backup_key;
                }
            }) : Promise.resolve(key);
            new Promise(((resolve, reject) => {
                const promiseList = [], valueList = [];
                data.url ? promiseList.push(checkTask("url", "backup_url")) : (promiseList.push(checkTask("video", "backup_video")), 
                promiseList.push(checkTask("audio", "backup_audio")));
                const timer = setTimeout((() => {
                    resolve(valueList);
                }), 1500);
                let index = 0;
                promiseList.forEach((async promise => {
                    let result;
                    try {
                        result = await promise;
                    } catch (error) {
                        result = error;
                    }
                    logger.info("use " + result), valueList[index++] = result, index == promiseList.length && (clearInterval(timer), 
                    resolve(valueList));
                }));
            })).then((resList => {
                if (logger.info("use data key: ", resList), resList) {
                    resList = [ ...resList ];
                    for (const key of resList) data[key] && ([ "url", "backup_url" ].includes(key) ? data.url = data[key] : [ "video", "backup_video" ].includes(key) ? data.video = data[key] : [ "audio", "backup_audio" ].includes(key) && (data.audio = data[key]));
                }
            })).finally((() => {
                _success(data);
            }));
        };
        ajax_obj.url = base_api, ajax(ajax_obj).then((res => {
            let data;
            if (res.code || (data = res.result || res.data), !data) return "auto" === request_type ? void get_url_base(page, quality, video_format, success, error, "remote") : (res.url && (res.url = url_replace_cdn(res.url)), 
            res.video && (res.video = url_replace_cdn(res.video)), res.audio && (res.audio = url_replace_cdn(res.audio)), 
            void resultConvertor(res, _success));
            if (data.dash) {
                const result = {
                    code: 0,
                    quality: data.quality,
                    accept_quality: data.accept_quality,
                    video: "",
                    audio: ""
                }, videos = data.dash.video;
                for (let i = 0; i < videos.length; i++) {
                    const video = videos[i];
                    if (video.id <= q) {
                        result.video = url_replace_cdn(video.base_url), result.audio = url_replace_cdn(data.dash.audio[0].base_url), 
                        result.backup_video = video.backup_url && url_replace_cdn(video.backup_url[0]), 
                        result.backup_audio = data.dash.audio[0].backup_url && url_replace_cdn(data.dash.audio[0].backup_url[0]);
                        break;
                    }
                }
                resultConvertor(result, _success);
            } else resultConvertor({
                code: 0,
                quality: data.quality,
                accept_quality: data.accept_quality,
                url: url_replace_cdn(data.durl[0].url),
                backup_url: data.durl[0].backup_url && url_replace_cdn(data.durl[0].backup_url[0])
            }, _success);
        })).catch((err => _error(err)));
    }
    function _get_subtitle(p, callback) {
        let to_blob_url = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
        const vb = video.base(), [aid, cid, epid] = [ vb.aid(p), vb.cid(p), vb.epid(p) ];
        ajax({
            url: `https://api.bilibili.com/x/player/v2?aid=${aid}&cid=${cid}&ep_id=${epid}`,
            dataType: "json"
        }).then((res => {
            !res.code && res.data.subtitle.subtitles[0] ? ajax({
                url: `${res.data.subtitle.subtitles[0].subtitle_url}`,
                dataType: "json"
            }).then((res => {
                const datas = res.body || [ {
                    from: 0,
                    to: 0,
                    content: ""
                } ];
                let webvtt = "WEBVTT\n\n";
                for (let data of datas) {
                    webvtt += `${new Date(1e3 * (parseInt(data.from) - 28800)).toTimeString().split(" ")[0] + "." + (data.from.toString().split(".")[1] || "000").padEnd(3, "0")} --\x3e ${new Date(1e3 * (parseInt(data.to) - 28800)).toTimeString().split(" ")[0] + "." + (data.to.toString().split(".")[1] || "000").padEnd(3, "0")}\n${data.content.trim()}\n\n`;
                }
                callback(to_blob_url ? URL.createObjectURL(new Blob([ webvtt ], {
                    type: "text/vtt"
                })) : webvtt);
            })).catch(callback) : callback();
        })).catch(callback);
    }
    const api = {
        get_url(success, error) {
            const request_type = config_config.request_type, format = config_config.format;
            get_url_base(0, parseInt(config_config.video_quality), format, success, error, request_type);
        },
        get_urls(page, quality, format, success, error) {
            get_url_base(page, quality, format, success, error, config_config.request_type);
        },
        get_card_url(vb, success, error) {
            const request_type = config_config.request_type, format = config_config.format;
            !function get_card_url_base(vb, page, quality, video_format, success, error, request_type) {
                let _success, _error;
                _success = "function" == typeof success ? e => {
                    success(e);
                } : res => logger.debug(res), _error = "function" == typeof error ? e => {
                    message_Message_error("请求失败"), error(e);
                } : err => console.error(err);
                const [aid, bvid, cid, epid, q, type] = [ vb.aid(page), vb.bvid(page), vb.cid(page), vb.epid(page), quality || video.get_quality().q || 80, vb.type() ];
                let format = video_format || config_config.format;
                "auto" === request_type && user.needReplace() && (request_type = "remote");
                const url_replace_cdn = url => {
                    if ("0" === config_config.host_key) return url;
                    const url_tmp = url.split("/"), mapping = hostMap[config_config.host_key];
                    return "string" == typeof mapping && mapping.length ? mapping.at(0).match(/[a-z]/) && (url_tmp[2] = mapping) : "function" == typeof mapping && (url_tmp[2] = mapping()), 
                    url_tmp.join("/");
                };
                let base_api;
                const ajax_obj = {
                    type: "GET",
                    dataType: "json"
                };
                if ("auto" === request_type || "local" === request_type) {
                    let fnver, fnval;
                    "cheese" === type ? (base_api = "https://api.bilibili.com/pugv/player/web/playurl", 
                    fnver = "mp4" === format ? 1 : 0, fnval = 80) : (base_api = "video" === type ? "https://api.bilibili.com/x/player/playurl" : "https://api.bilibili.com/pgc/player/web/playurl", 
                    fnver = 0, fnval = {
                        dash: 4048,
                        flv: 4049,
                        mp4: 0
                    }[format] || 0), base_api += `?avid=${aid}&bvid=${bvid}&cid=${cid}&qn=${q}&fnver=${fnver}&fnval=${fnval}&fourk=1&ep_id=${epid}&type=${format}&otype=json`, 
                    base_api += "mp4" === format ? "&platform=html5&high_quality=1" : "", ajax_obj.xhrFields = {
                        withCredentials: !0
                    };
                } else {
                    base_api = config_config.base_api, base_api += `?av=${aid}&bv=${bvid}&cid=${cid}&ep=${epid}&q=${q}&type=${type}&format=${format}&otype=json`, 
                    page && (base_api += "&s");
                    const [auth_id, auth_sec] = [ store.get("auth_id"), store.get("auth_sec") ];
                    auth_id && auth_sec && (base_api += `&auth_id=${auth_id}&auth_sec=${auth_sec}`);
                }
                const resultConvertor = (data, _success) => {
                    const checkTask = (key, backup_key) => data[backup_key] ? _ajax({
                        type: "GET",
                        url: data[key],
                        cache: !1,
                        timeout: 1e3,
                        success: function(res) {
                            return key;
                        },
                        error: function(res) {
                            return "timeout" == res.statusText ? key : backup_key;
                        }
                    }) : Promise.resolve(key);
                    new Promise(((resolve, reject) => {
                        const promiseList = [], valueList = [];
                        data.url ? promiseList.push(checkTask("url", "backup_url")) : (promiseList.push(checkTask("video", "backup_video")), 
                        promiseList.push(checkTask("audio", "backup_audio")));
                        const timer = setTimeout((() => {
                            resolve(valueList);
                        }), 1500);
                        let index = 0;
                        promiseList.forEach((async promise => {
                            let result;
                            try {
                                result = await promise;
                            } catch (error) {
                                result = error;
                            }
                            logger.debug("use " + result), valueList[index++] = result, index == promiseList.length && (clearInterval(timer), 
                            resolve(valueList));
                        }));
                    })).then((resList => {
                        if (logger.debug("use data key: ", resList), resList) {
                            resList = [ ...resList ];
                            for (const key of resList) data[key] && ([ "url", "backup_url" ].includes(key) ? data.url = data[key] : [ "video", "backup_video" ].includes(key) ? data.video = data[key] : [ "audio", "backup_audio" ].includes(key) && (data.audio = data[key]));
                        }
                    })).finally((() => {
                        _success(data);
                    }));
                };
                ajax_obj.url = base_api, ajax(ajax_obj).then((res => {
                    let data;
                    if (res.code || (data = res.result || res.data), !data) return "auto" === request_type ? void get_url_base(page, quality, video_format, success, error, "remote") : (res.url && (res.url = url_replace_cdn(res.url)), 
                    res.video && (res.video = url_replace_cdn(res.video)), res.audio && (res.audio = url_replace_cdn(res.audio)), 
                    void resultConvertor(res, _success));
                    if (data.dash) {
                        const result = {
                            code: 0,
                            quality: data.quality,
                            accept_quality: data.accept_quality,
                            video: "",
                            audio: ""
                        }, videos = data.dash.video;
                        for (let i = 0; i < videos.length; i++) {
                            const video = videos[i];
                            if (video.id <= q) {
                                result.video = url_replace_cdn(video.base_url), result.audio = url_replace_cdn(data.dash.audio[0].base_url), 
                                result.backup_video = video.backup_url && url_replace_cdn(video.backup_url[0]), 
                                result.backup_audio = data.dash.audio[0].backup_url && url_replace_cdn(data.dash.audio[0].backup_url[0]);
                                break;
                            }
                        }
                        resultConvertor(result, _success);
                    } else resultConvertor({
                        code: 0,
                        quality: data.quality,
                        accept_quality: data.accept_quality,
                        url: url_replace_cdn(data.durl[0].url),
                        backup_url: data.durl[0].backup_url && url_replace_cdn(data.durl[0].backup_url[0])
                    }, _success);
                })).catch((err => _error(err)));
            }(vb, 0, parseInt(config_config.video_quality), format, success, error, request_type);
        },
        get_subtitle_url: function get_subtitle_url(p, callback) {
            _get_subtitle(p, callback, !0);
        },
        get_subtitle_data: function get_subtitle_data(p, callback) {
            _get_subtitle(p, callback, !1);
        }
    };
    class RuntimeLib {
        constructor(config) {
            this.config = config, this.moduleAsync, this.anyResolved = !1;
        }
        getModulePromise() {
            const {urls: urls, getModule: getModule} = this.config, errs = [];
            return new Promise(((resolve, reject) => {
                let i = 0;
                urls.forEach((url => {
                    setTimeout((async () => {
                        try {
                            if (this.anyResolved) return;
                            logger.debug(`[Runtime Library] Start download from ${url}`);
                            const code = await _ajax({
                                url: url,
                                type: "GET",
                                dataType: "text",
                                cache: !0
                            });
                            if (this.anyResolved) return;
                            logger.debug(`[Runtime Library] Downloaded from ${url} , length = ${code.length}`), 
                            this.anyResolved = !0, resolve(code);
                        } catch (err) {
                            if (this.anyResolved) return;
                            errs.push({
                                url: url,
                                err: err
                            }), 0 === --i && (console.error(errs), reject(errs));
                        }
                    }), 1e3 * i++);
                }));
            }));
        }
    }
    const cdn_map = {
        cloudflare: (name, ver, filename) => `https://cdnjs.cloudflare.com/ajax/libs/${name}/${ver}/${filename}`,
        bootcdn: (name, ver, filename) => `https://cdn.bootcdn.net/ajax/libs/${name}/${ver}/${filename}`,
        jsdelivr: (name, ver, filename) => `https://cdn.jsdelivr.net/npm/${name}@${ver}/${filename}`,
        staticfile: (name, ver, filename) => `https://cdn.staticfile.org/${name}/${ver}/${filename}`
    }, urls = _ref => {
        let {name: name, ver: ver, filename: filename, cdn_keys: cdn_keys} = _ref;
        return cdn_keys = cdn_keys ? cdn_keys.filter((key => key in cdn_map)) : Object.keys(cdn_map), 
        cdn_keys.map((k => cdn_map[k](name, ver, filename)));
    }, runtime_div = document.createElement("div");
    runtime_div.id = "bp_runtime_div", runtime_div.style.display = "none", document.getElementById(runtime_div.id) || document.body.appendChild(runtime_div);
    let count = 0;
    const scripts = [], getModules = [], initIframe = (name, ver, filename, getModule) => {
        count++, new RuntimeLib({
            urls: urls({
                name: name,
                ver: ver,
                filename: filename
            }),
            getModule: getModule
        }).getModulePromise().then((script => {
            scripts.push(script), getModules.push(getModule);
        })).catch((err => {
            console.error(`[Runtime Library] Failed to load ${name} from CDN`, err);
        })).finally((() => {
            0 === --count && (((scripts, getModules) => {
                logger.debug("[Runtime Library] iframe invoke scripts, size =", scripts.length);
                const scriptTags = scripts.map((code => `<script>${code}<\/script>`)).join(""), html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Runtime Library</title></head><body>${scriptTags}</body></html>`, blobUrl = URL.createObjectURL(new Blob([ html ], {
                    type: "text/html"
                })), iframe = document.createElement("iframe"), clearIframe = () => {
                    clearTimeout(timeoutId), URL.revokeObjectURL(blobUrl), iframe.remove();
                }, timeoutId = setTimeout((() => {
                    console.error("[Runtime Library] Script loading timed out"), clearIframe();
                }), 1e4);
                iframe.src = blobUrl, iframe.onload = () => {
                    logger.debug("[Runtime Library] Script loaded in iframe");
                    for (const getModule of getModules) try {
                        getModule(iframe.contentWindow);
                    } catch (err) {
                        console.error("[Runtime Library] Error in getModule:", err);
                    }
                    clearIframe();
                }, iframe.onerror = () => {
                    console.error("[Runtime Library] Failed to load script in iframe"), clearIframe();
                }, runtime_div.appendChild(iframe);
            })(scripts, getModules), logger.debug("[Runtime Library] iframe invoke complete"));
        }));
    };
    let JSZip, flvjs, DPlayer;
    var name, getModule, handleScript;
    let QRCode, md5;
    function get_bili_player_id() {
        return $("#bilibiliPlayer")[0] ? "#bilibiliPlayer" : $("#bilibili-player")[0] ? "#bilibili-player" : $("#edu-player")[0] ? "div.bpx-player-primary-area" : void 0;
    }
    function bili_video_tag() {
        return $("bwp-video")[0] ? "bwp-video" : $('video[class!="dplayer-video dplayer-video-current"]')[0] ? 'video[class!="dplayer-video dplayer-video-current"]' : void 0;
    }
    function bili_video_stop() {
        const bili_video = $(bili_video_tag())[0];
        bili_video && (bili_video.pause(), bili_video.currentTime = 0);
    }
    function recover_player() {
        if (window.bp_dplayer) {
            const bili_video = $(bili_video_tag())[0];
            bili_video && bili_video.removeEventListener("play", bili_video_stop, !1), window.bp_dplayer.destroy(), 
            window.bp_dplayer = null, $("#bp_dplayer").remove(), window.bp_dplayer_2 && (window.bp_dplayer_2.destroy(), 
            window.bp_dplayer_2 = null, $("#bp_dplayer_2").remove()), $(get_bili_player_id()).show();
        }
    }
    function danmaku_config() {
        const style = `<style id="dplayer_danmaku_style">\n        .dplayer-danmaku .dplayer-danmaku-right.dplayer-danmaku-move {\n            animation-duration: ${parseFloat(config_config.danmaku_speed)}s;\n            font-size: ${parseInt(config_config.danmaku_fontsize)}px;\n        }\n        </style>`;
        $("#dplayer_danmaku_style")[0] && $("#dplayer_danmaku_style").remove(), $("body").append(style);
    }
    initIframe("jszip", "3.10.0", "jszip.min.js", (w => JSZip = w.JSZip)), initIframe("flv.js", "1.6.2", "flv.min.js", (w => flvjs = w.flvjs)), 
    getModule = w => DPlayer = w.DPlayer, handleScript = (handleScript = script => script.replace('"About author"', '"About DIYgod"')) || (script => script), 
    new RuntimeLib({
        urls: urls({
            name: name = "dplayer",
            ver: "1.26.0",
            filename: "DPlayer.min.js"
        }),
        getModule: getModule
    }).getModulePromise().then((script => {
        const blob = new Blob([ handleScript(script) ], {
            type: "text/javascript"
        }), blob_url = URL.createObjectURL(blob), script_tag = document.createElement("script");
        script_tag.src = blob_url, script_tag.onload = () => {
            logger.debug(`[Runtime Library] Loaded ${name} from local`), getModule(window), 
            URL.revokeObjectURL(blob_url);
        }, script_tag.onerror = () => {
            console.error(`[Runtime Library] Failed to load ${name} from local`), URL.revokeObjectURL(blob_url);
        }, runtime_div.appendChild(script_tag);
    })).catch((err => {
        console.error(`[Runtime Library] Failed to load ${name} from local`, err);
    })), initIframe("qrcodejs", "1.0.0", "qrcode.min.js", (w => QRCode = w.QRCode)), 
    initIframe("blueimp-md5", "2.19.0", "js/md5.min.js", (w => md5 = w.md5));
    const player = {
        bili_video_tag: bili_video_tag,
        recover_player: recover_player,
        replace_player: function replace_player(url, url_2) {
            recover_player();
            const bili_video = $(bili_video_tag())[0];
            bili_video_stop(), bili_video && bili_video.addEventListener("play", bili_video_stop, !1);
            let bili_player_id = get_bili_player_id();
            $("#bilibiliPlayer")[0] ? ($(bili_player_id).before('<div id="bp_dplayer" class="bilibili-player relative bilibili-player-no-cursor">'), 
            $(bili_player_id).hide()) : $("#bilibili-player")[0] ? ($(bili_player_id).before('<div id="bp_dplayer" class="bilibili-player relative bilibili-player-no-cursor" style="width:100%;height:100%;z-index:1000;"></div>'), 
            $(bili_player_id).hide()) : $("#edu-player")[0] ? ($(bili_player_id).before('<div id="bp_dplayer" style="width:100%;height:100%;z-index:1000;"></div>'), 
            $(bili_player_id).hide()) : MessageBox_alert('<div id="bp_dplayer" style="width:100%;height:100%;"></div>', (() => {
                recover_player();
            })), api.get_subtitle_url(0, (function() {
                let subtitle_url = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
                if (window.bp_dplayer = new DPlayer({
                    container: $("#bp_dplayer")[0],
                    mutex: !1,
                    volume: 1,
                    autoplay: !0,
                    video: {
                        url: url,
                        type: "auto"
                    },
                    subtitle: {
                        url: subtitle_url,
                        type: "webvtt",
                        fontSize: "35px",
                        bottom: "5%",
                        color: "#fff"
                    },
                    danmaku: !0,
                    apiBackend: {
                        read: options => {
                            !function request_danmaku(options, cid) {
                                cid ? ajax({
                                    url: `https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}`,
                                    dataType: "text"
                                }).then((result => {
                                    const result_dom = $(result.replace(/[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f]/g, ""));
                                    if (result_dom) if (result_dom.find("d")[0]) {
                                        const danmaku_data = result_dom.find("d").map(((i, el) => {
                                            const item = $(el), p = item.attr("p").split(",");
                                            let type = 0;
                                            return "4" === p[1] ? type = 2 : "5" === p[1] && (type = 1), [ {
                                                author: "",
                                                time: parseFloat(p[0]),
                                                type: type,
                                                color: parseInt(p[3]),
                                                id: "",
                                                text: item.text()
                                            } ];
                                        })).get();
                                        options.success(danmaku_data), setTimeout((() => {
                                            danmaku_config();
                                        }), 100);
                                    } else options.error("未发现弹幕"); else options.error("弹幕获取失败");
                                })).catch((() => {
                                    options.error("弹幕请求异常");
                                })) : options.error("cid未知，无法获取弹幕");
                            }(options, video.base().cid());
                        },
                        send: options => {
                            options.error("此脚本无法将弹幕同步到云端");
                        }
                    },
                    contextmenu: [ {
                        text: "脚本信息",
                        link: "https://github.com/injahow/user.js"
                    }, {
                        text: "脚本作者",
                        link: "https://injahow.com"
                    }, {
                        text: "恢复播放器",
                        click: () => {
                            recover_player();
                        }
                    } ]
                }), url_2 && "#" !== url_2) {
                    $("body").append('<div id="bp_dplayer_2" style="display:none;"></div>'), window.bp_dplayer_2 = new DPlayer({
                        container: $("#bp_dplayer_2")[0],
                        mutex: !1,
                        volume: 1,
                        autoplay: !1,
                        video: {
                            url: url_2,
                            type: "auto"
                        }
                    });
                    const [bp_dplayer, bp_dplayer_2] = [ window.bp_dplayer, window.bp_dplayer_2 ];
                    bp_dplayer.on("play", (() => {
                        !bp_dplayer.paused && bp_dplayer_2.play();
                    })), bp_dplayer.on("playing", (() => {
                        !bp_dplayer.paused && bp_dplayer_2.play();
                    })), bp_dplayer.on("timeupdate", (() => {
                        Math.abs(bp_dplayer.video.currentTime - bp_dplayer_2.video.currentTime) > 1 && (bp_dplayer_2.pause(), 
                        bp_dplayer_2.seek(bp_dplayer.video.currentTime)), !bp_dplayer.paused && bp_dplayer_2.play();
                    })), bp_dplayer.on("seeking", (() => {
                        bp_dplayer_2.pause(), bp_dplayer_2.seek(bp_dplayer.video.currentTime);
                    })), bp_dplayer.on("waiting", (() => {
                        bp_dplayer_2.pause(), bp_dplayer_2.seek(bp_dplayer.video.currentTime);
                    })), bp_dplayer.on("pause", (() => {
                        bp_dplayer_2.pause(), bp_dplayer_2.seek(bp_dplayer.video.currentTime);
                    })), bp_dplayer.on("suspend", (() => {
                        bp_dplayer_2.speed(bp_dplayer.video.playbackRate);
                    })), bp_dplayer.on("volumechange", (() => {
                        bp_dplayer_2.volume(bp_dplayer.video.volume), bp_dplayer_2.video.muted = bp_dplayer.video.muted;
                    }));
                }
            }));
        },
        danmaku: {
            config: danmaku_config
        }
    };
    const check = new class {
        constructor() {
            this.href = "", this.aid = "", this.cid = "", this.q = "", this.epid = "", this.locked = !1;
        }
        refresh() {
            if (!this.locked) {
                this.lock = !0, logger.debug("refresh..."), $("#video_download").hide(), $("#video_download_2").hide(), 
                player.recover_player();
                try {
                    this.href = location.href;
                    const vb = video.base();
                    this.aid = vb.aid(), this.cid = vb.cid(), this.epid = vb.epid(), this.q = video.get_quality().q;
                } catch (err) {
                    logger.error(err);
                } finally {
                    this.lock = !1;
                }
            }
        }
    };
    function rpc_type() {
        return config_config.rpc_domain.match("https://") || config_config.rpc_domain.match(/localhost|127\.0\.0\.1/) ? "post" : "ariang";
    }
    function download_rpc(url, filename) {
        let type = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "post";
        "post" === type ? function download_rpc_post(video) {
            download_rpc_post_all([ video ]);
        }({
            url: url,
            filename: filename
        }) : "ariang" === type && download_rpc_ariang({
            url: url,
            filename: filename
        });
    }
    let download_rpc_clicked = !1;
    function download_rpc_post_all(videos) {
        if (download_rpc_clicked) return void message_Message_miaow();
        download_rpc_clicked = !0;
        const data = [ ...videos ];
        ajax(function get_rpc_post(data) {
            data instanceof Array || (data = data instanceof Object ? [ data ] : []);
            const rpc = {
                domain: config_config.rpc_domain,
                port: config_config.rpc_port,
                token: config_config.rpc_token,
                dir: config_config.rpc_dir
            };
            return {
                url: `${rpc.domain}:${rpc.port}/jsonrpc`,
                type: "POST",
                dataType: "json",
                data: JSON.stringify(data.map((_ref => {
                    let {url: url, filename: filename, rpc_dir: rpc_dir} = _ref;
                    const param = {
                        out: filename,
                        header: [ `User-Agent: ${window.navigator.userAgent}`, `Referer: ${window.location.href}` ]
                    };
                    return (rpc_dir || rpc.dir) && (param.dir = rpc_dir || rpc.dir), {
                        id: window.btoa(`BParse_${Date.now()}_${Math.random()}`),
                        jsonrpc: "2.0",
                        method: "aria2.addUri",
                        params: [ `token:${rpc.token}`, [ url ], param ]
                    };
                })))
            };
        }(data)).then((res => {
            res.length === data.length ? message_Message_success("RPC请求成功") : message_Message_warning("请检查RPC参数");
        })).catch((() => {
            message_Message_error("请检查RPC服务配置");
        })).finally((() => download_rpc_clicked = !1)), message_Message_info("发送RPC下载请求");
    }
    function open_ariang(rpc) {
        const hash_tag = rpc ? `#!/settings/rpc/set/${rpc.domain.replace("://", "/")}/${rpc.port}/jsonrpc/${window.btoa(rpc.token)}` : "", url = config_config.ariang_host + hash_tag, a = document.createElement("a");
        a.setAttribute("target", "_blank"), a.setAttribute("onclick", `window.bp_aria2_window=window.open('${url}');`), 
        a.click();
    }
    function download_rpc_ariang() {
        for (var _len = arguments.length, videos = new Array(_len), _key = 0; _key < _len; _key++) videos[_key] = arguments[_key];
        0 != videos.length && (1 == videos.length && videos[0] instanceof Array ? download_rpc_ariang(...videos[0]) : (!function download_rpc_ariang_send(video) {
            const bp_aria2_window = window.bp_aria2_window;
            let time = 100;
            bp_aria2_window && !bp_aria2_window.closed || (open_ariang(), time = 3e3), setTimeout((() => {
                const bp_aria2_window = window.bp_aria2_window, task_hash = "#!/new/task?" + [ `url=${encodeURIComponent(window.btoa(video.url))}`, `out=${encodeURIComponent(video.filename)}`, `header=User-Agent:${window.navigator.userAgent}`, `header=Referer:${window.location.href}` ].join("&");
                bp_aria2_window && !bp_aria2_window.closed ? (bp_aria2_window.location.href = config_config.ariang_host + task_hash, 
                message_Message_success("发送RPC请求")) : message_Message_warning("AriaNG页面未打开");
            }), time);
        }(videos.pop()), setTimeout((() => {
            download_rpc_ariang(...videos);
        }), 100)));
    }
    let download_blob_clicked = !1, need_show_progress = !0;
    function download_blob(url, filename) {
        if (download_blob_clicked) return message_Message_miaow(), void (need_show_progress = !0);
        const xhr = new XMLHttpRequest;
        xhr.open("get", url), xhr.responseType = "blob", xhr.onload = function() {
            if (200 === this.status || 304 === this.status) {
                if ("msSaveOrOpenBlob" in navigator) return void navigator.msSaveOrOpenBlob(this.response, filename);
                const blob_url = URL.createObjectURL(this.response), a = document.createElement("a");
                a.style.display = "none", a.href = blob_url, a.download = filename, a.click(), URL.revokeObjectURL(blob_url);
            }
        }, need_show_progress = !0, xhr.onprogress = function(evt) {
            if (4 != this.state) {
                const loaded = evt.loaded, tot = evt.total;
                !function show_progress(_ref2) {
                    let {total: total, loaded: loaded, percent: percent} = _ref2;
                    need_show_progress && MessageBox_alert(`文件大小：${Math.floor(total / 1048576)}MB(${total}Byte)<br/>已经下载：${Math.floor(loaded / 1048576)}MB(${loaded}Byte)<br/>当前进度：${percent}%<br/>下载中请勿操作浏览器，刷新或离开页面会导致下载取消！<br/>再次点击下载按钮可查看下载进度。`, (() => {
                        need_show_progress = !1;
                    })), total === loaded && (MessageBox_alert("下载完成，请等待浏览器保存！"), download_blob_clicked = !1);
                }({
                    total: tot,
                    loaded: loaded,
                    percent: Math.floor(100 * loaded / tot)
                });
            }
        }, xhr.send(), download_blob_clicked = !0, message_Message_info("准备开始下载");
    }
    function _download_danmaku_ass(cid, title) {
        let return_type = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null, callback = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
        ajax({
            url: `https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}`,
            dataType: "text"
        }).then((result => {
            const result_dom = $(result.replace(/[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f]/g, ""));
            if (!result_dom || !result_dom.find("d")[0]) return "callback" === return_type && callback ? void callback() : void message_Message_warning("未发现弹幕");
            {
                const danmaku_data = result_dom.find("d").map(((i, el) => {
                    const item = $(el), p = item.attr("p").split(",");
                    let type = 0;
                    return "4" === p[1] ? type = 2 : "5" === p[1] && (type = 1), [ {
                        time: parseFloat(p[0]),
                        type: type,
                        color: parseInt(p[3]),
                        text: item.text()
                    } ];
                })).get().sort(((a, b) => a.time - b.time)), dialogue = (danmaku, scroll_id, fix_id) => {
                    const [scrollTime, fixTime] = [ 8, 4 ], {text: text, time: time} = danmaku, commands = [ 0 === danmaku.type ? (top = 50 * (1 + Math.floor(15 * Math.random())), 
                    left_a = 1920 + 50 * danmaku.text.length / 2, left_b = 0 - 50 * danmaku.text.length / 2, 
                    `\\move(${left_a},${top},${left_b},${top})`) : ((top, left) => `\\pos(${left},${top})`)(50 * (1 + fix_id % 15), 960), (color = danmaku.color, 
                    16777215 === color ? "" : (color => {
                        const [r, g, b] = [ color >> 16 & 255, color >> 8 & 255, 255 & color ];
                        return `\\c&H${(b << 16 | g << 8 | r).toString(16)}&`;
                    })(danmaku.color)) ];
                    var color, top, left_a, left_b;
                    const formatTime = seconds => {
                        const div = (i, j) => Math.floor(i / j), pad = n => n < 10 ? "0" + n : "" + n, integer = Math.floor(seconds), hour = div(integer, 3600), minute = div(integer, 60) % 60, second = integer % 60, minorSecond = Math.floor(100 * (seconds - integer));
                        return `${hour}:${pad(minute)}:${pad(second)}.${minorSecond}`;
                    }, fields = [ 0, formatTime(time), formatTime(time + (0 === danmaku.type ? scrollTime : fixTime)), "Medium", "", "0", "0", "0", "", "{" + commands.join("") + "}" + (text => text.replace(/\{/g, "｛").replace(/\}/g, "｝").replace(/\r|\n/g, ""))(text) ];
                    return "Dialogue: " + fields.join(",");
                }, content = [ "[Script Info]", "; Script generated by injahow/user.js", "; https://github.com/injahow/user.js", `Title: ${title}`, "ScriptType: v4.00+", "PlayResX: 1920", "PlayResY: 1080", "Timer: 10.0000", "WrapStyle: 2", "ScaledBorderAndShadow: no", "", "[V4+ Styles]", "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding", "Style: Small,微软雅黑,36,&H66FFFFFF,&H66FFFFFF,&H66000000,&H66000000,0,0,0,0,100,100,0,0,1,1.2,0,5,0,0,0,0", "Style: Medium,微软雅黑,52,&H66FFFFFF,&H66FFFFFF,&H66000000,&H66000000,0,0,0,0,100,100,0,0,1,1.2,0,5,0,0,0,0", "Style: Large,微软雅黑,64,&H66FFFFFF,&H66FFFFFF,&H66000000,&H66000000,0,0,0,0,100,100,0,0,1,1.2,0,5,0,0,0,0", "Style: Larger,微软雅黑,72,&H66FFFFFF,&H66FFFFFF,&H66000000,&H66000000,0,0,0,0,100,100,0,0,1,1.2,0,5,0,0,0,0", "Style: ExtraLarge,微软雅黑,90,&H66FFFFFF,&H66FFFFFF,&H66000000,&H66000000,0,0,0,0,100,100,0,0,1,1.2,0,5,0,0,0,0", "", "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text" ];
                let scroll_id = 0, fix_id = 0;
                for (const danmaku of danmaku_data) 0 === danmaku.type ? scroll_id++ : fix_id++, 
                content.push(dialogue(danmaku, scroll_id, fix_id));
                const data = content.join("\n");
                if (null === return_type || "file" === return_type) {
                    const blob_url = URL.createObjectURL(new Blob([ data ], {
                        type: "text/ass"
                    })), a = document.createElement("a");
                    a.style.display = "none", a.href = blob_url, a.download = title + ".ass", a.click(), 
                    URL.revokeObjectURL(blob_url);
                } else "callback" === return_type && callback && callback(data);
            }
        })).catch((() => {
            "callback" === return_type && callback && callback();
        }));
    }
    function download_danmaku_ass(cid, title) {
        _download_danmaku_ass(cid, title, "file");
    }
    function download_subtitle_vtt() {
        let p = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, file_name = arguments.length > 1 ? arguments[1] : void 0;
        api.get_subtitle_url(p, (blob_url => {
            if (!blob_url) return void message_Message_warning("未发现字幕");
            const a = document.createElement("a");
            a.setAttribute("target", "_blank"), a.setAttribute("href", blob_url), a.setAttribute("download", file_name + ".vtt"), 
            a.click(), URL.revokeObjectURL(blob_url);
        }));
    }
    function download_blob_zip(blob_data, filename) {
        if (!blob_data) return;
        const blob_url = URL.createObjectURL(blob_data), a = document.createElement("a");
        a.setAttribute("target", "_blank"), a.setAttribute("href", blob_url), a.setAttribute("download", filename + ".zip"), 
        a.click(), URL.revokeObjectURL(blob_url);
    }
    function download_danmaku_ass_zip(videos, zip) {
        if (!videos) return;
        if (0 === videos.length) return 0 === Object.keys(zip.files).length ? void message_Message_warning("未发现弹幕") : void zip.generateAsync({
            type: "blob"
        }).then((data => download_blob_zip(data, video.base().getFilename() + "_ass")));
        const {cid: cid, filename: filename} = videos.pop();
        _download_danmaku_ass(cid, filename, "callback", (data => {
            data && zip.file(filename + ".ass", data), setTimeout((() => {
                download_danmaku_ass_zip(videos, zip);
            }), 1e3);
        }));
    }
    function download_subtitle_vtt_zip(videos, zip) {
        if (!videos) return;
        if (0 === videos.length) return 0 === Object.keys(zip.files).length ? void message_Message_warning("未发现字幕") : void zip.generateAsync({
            type: "blob"
        }).then((data => download_blob_zip(data, video.base().getFilename() + "_vtt")));
        const {p: p, filename: filename} = videos.pop();
        api.get_subtitle_data(p, (data => {
            data && zip.file(filename + ".vtt", data), setTimeout((() => {
                download_subtitle_vtt_zip(videos, zip);
            }), 1e3);
        }));
    }
    function format(url) {
        return url ? url.match(".mp4|.m4s") ? ".mp4" : url.match(".flv") ? ".flv" : ".mp4" : "";
    }
    const Download = {
        url_format: format,
        download: function download(url, filename, type) {
            filename = filename.replace(/[\/\\*|]+/g, "-").replace(/:/g, "：").replace(/\?/g, "？").replace(/"/g, "'").replace(/</g, "《").replace(/>/g, "》"), 
            "blob" === type ? download_blob(url, filename) : "rpc" === type && download_rpc(url, filename, rpc_type());
        },
        download_all: function download_all() {
            const vb = video.base(), [q, total] = [ video.get_quality().q, vb.total() ];
            $("body").on("click", 'input[name="option_video"]', (function(event) {
                function get_option_index(element) {
                    return element && parseInt(element.id.split("_")[1]) || 0;
                }
                if ($(this).is(":checked") ? $(this).parent().css("color", "rgba(0,0,0,1)") : $(this).parent().css("color", "rgba(0,0,0,0.5)"), 
                event.ctrlKey || event.altKey) {
                    const current_select_option_index = get_option_index(event.target), option_videos = [ ...document.getElementsByName("option_video") ];
                    if (event.target.checked) {
                        for (let i = get_option_index(option_videos.filter((e => e.checked && get_option_index(e) < current_select_option_index)).slice(-1)[0]); i < current_select_option_index; i++) option_videos[i].checked = !0, 
                        option_videos[i].parentNode.style.color = "rgba(0,0,0,1)";
                    } else {
                        for (let i = get_option_index(option_videos.filter((e => !e.checked && get_option_index(e) < current_select_option_index)).slice(-1)[0]); i < current_select_option_index; i++) option_videos[i].checked = !1, 
                        option_videos[i].parentNode.style.color = "rgba(0,0,0,0.5)";
                    }
                }
            }));
            let video_html = "";
            for (let i = 0; i < total; i++) video_html += `<label for="option_${i}"><div style="color:rgba(0,0,0,0.5);">\n                <input type="checkbox" id="option_${i}" name="option_video" value="${i}">\n                P${i + 1} ${vb.title(i + 1)}\n            </div></label><hr>`;
            let all_checked = !1;
            $("body").on("click", "button#checkbox_btn", (() => {
                all_checked ? (all_checked = !1, $('input[name="option_video"]').prop("checked", all_checked), 
                $('input[name="option_video"]').parent().css("color", "rgba(0,0,0,0.5)")) : (all_checked = !0, 
                $('input[name="option_video"]').prop("checked", all_checked), $('input[name="option_video"]').parent().css("color", "rgb(0,0,0)"));
            }));
            const quality_support = video.get_quality_support();
            let option_support_html = "";
            for (const item of quality_support) option_support_html += `<option value="${item}">${videoQualityMap[item]}</option>`;
            const msg = `<div style="margin:2% 0;">\n            <label>视频格式:</label>\n            <select id="dl_format">\n                <option value="mp4" selected>MP4</option>\n                <option value="flv">FLV</option>\n                <option value="dash">DASH</option>\n            </select>\n            &nbsp;&nbsp;无法设置MP4清晰度\n        </div>\n        <div style="margin:2% 0;">\n            <label>视频质量:</label>\n            <select id="dl_quality">\n                ${option_support_html}\n            </select>\n        </div>\n        <div style="margin:2% 0;">\n            <label>下载选择:</label>\n            <label style="color:rgba(0,0,0,1);">\n                <input type="checkbox" id="dl_video" name="dl_option" checked="checked">\n                <label for="dl_video">视频</label>\n            </label>\n            <label style="color:rgba(0,0,0,0.5);">\n                <input type="checkbox" id="dl_subtitle" name="dl_option">\n                <label for="dl_subtitle">字幕</label>\n            </label>\n            <label style="color:rgba(0,0,0,0.5);">\n                <input type="checkbox" id="dl_danmaku" name="dl_option">\n                <label for="dl_danmaku">弹幕</label>\n            </label>\n        </div>\n        <div style="margin:2% 0;">\n            <label>保存目录:</label>\n            <input id="dl_rpc_dir" placeholder="${config_config.rpc_dir || "为空使用默认目录"}"/>\n        </div>\n        <b>\n            <span style="color:red;">为避免请求被拦截，设置了延时且不支持下载无法播放的视频；请勿频繁下载过多视频，可能触发风控导致不可再下载！</span>\n        </b><br />\n        <div style="height:240px;width:100%;overflow:auto;background:rgba(0,0,0,0.1);">\n            ${video_html}\n        </div>\n        <div style="margin:2% 0;">\n            <button id="checkbox_btn">全选</button>\n        </div>`;
            function download_videos(video_tasks, i, videos) {
                if (!video_tasks.length) return;
                if (i >= video_tasks.length) return MessageBox_alert("视频地址请求完成！"), void ("post" === rpc_type() && videos.length > 0 && (download_rpc_post_all(videos), 
                videos.length = 0));
                const task = video_tasks[i], msg = `第${i + 1}（${i + 1}/${video_tasks.length}）个视频`;
                MessageBox_alert(`${msg}：获取中...`);
                api.get_urls(task.p, task.q, task.format, (res => {
                    if (setTimeout((() => {
                        download_videos(video_tasks, ++i, videos);
                    }), 4e3), res.code) return;
                    message_Message_success("请求成功" + (res.times ? `<br/>今日剩余请求次数${res.times}` : "")), 
                    MessageBox_alert(`${msg}：获取成功！`);
                    const [url, type, video_url, audio_url] = [ res.url, rpc_type(), res.video, res.audio ];
                    "post" === type ? ("dash" === task.format ? videos.push({
                        url: video_url,
                        filename: task.filename + format(video_url),
                        rpc_dir: task.rpc_dir
                    }, {
                        url: audio_url,
                        filename: task.filename + ".m4a",
                        rpc_dir: task.rpc_dir
                    }) : videos.push({
                        url: url,
                        filename: task.filename + format(url),
                        rpc_dir: task.rpc_dir
                    }), videos.length > 3 && (download_rpc_post_all(videos), videos.length = 0)) : "ariang" === type && ("dash" === task.format ? download_rpc_ariang({
                        url: video_url,
                        filename: task.filename + format(video_url)
                    }, {
                        url: audio_url,
                        filename: task.filename + ".m4a"
                    }) : download_rpc_ariang({
                        url: url,
                        filename: task.filename + format(url)
                    }));
                }), (() => {
                    download_videos(video_tasks, ++i, videos);
                }));
            }
            MessageBox_confirm(msg, (() => {
                const [dl_video, dl_subtitle, dl_danmaku, dl_format, dl_quality, dl_rpc_dir] = [ $("#dl_video").is(":checked"), $("#dl_subtitle").is(":checked"), $("#dl_danmaku").is(":checked"), $("#dl_format").val(), $("#dl_quality").val() || q, $("#dl_rpc_dir").val() ], videos = [];
                for (let i = 0; i < total; i++) {
                    if (!$(`input#option_${i}`).is(":checked")) continue;
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
                dl_video && download_videos(videos, 0, []), dl_subtitle && (1 === videos.length ? download_subtitle_vtt(videos[0].p, videos[0].filename) : download_subtitle_vtt_zip([ ...videos ], new JSZip)), 
                dl_danmaku && (1 === videos.length ? download_danmaku_ass(videos[0].cid, videos[0].filename) : download_danmaku_ass_zip([ ...videos ], new JSZip));
            })), $("#dl_quality").val(q), $("body").on("click", 'input[name="dl_option"]', (function() {
                $(this).is(":checked") ? $(this).parent().css("color", "rgba(0,0,0,1)") : $(this).parent().css("color", "rgba(0,0,0,0.5)");
            }));
        },
        download_danmaku_ass: download_danmaku_ass,
        download_subtitle_vtt: download_subtitle_vtt,
        open_ariang: open_ariang
    };
    var _document$head$innerH, config = '<div id="bp_config"> <div class="config-mark"></div> <div class="config-bg"> <span style="font-size:20px"> <b>bilibili视频下载 参数设置</b> <b> <a href="javascript:;" id="reset_config"> [重置] </a> <a style="text-decoration:underline" href="javascript:;" id="show_help">&lt;通知/帮助&gt;</a> </b> </span> <div style="margin:2% 0"> <label>请求地址：</label> <input id="base_api" style="width:30%"/>&nbsp;&nbsp;&nbsp;&nbsp; <label>请求方式：</label> <select id="request_type"> <option value="auto">自动判断</option> <option value="local">本地请求</option> <option value="remote">远程请求</option></select><br/> <small>注意：普通使用请勿修改；默认使用混合请求</small> </div> <div style="margin:2% 0"> <label>视频格式：</label> <select id="format"> <option value="mp4">MP4</option> <option value="flv">FLV</option> <option value="dash">DASH</option></select>&nbsp;&nbsp;&nbsp;&nbsp; <label>切换CDN：</label> <select id="host_key"> {{host_key_options}}</select><br/> <small>注意：无法选择MP4清晰度；建议特殊地区或播放异常时切换（自行选择合适线路）</small> </div> <div style="margin:2% 0"> <label>下载方式：</label> <select id="download_type"> <option value="a">URL链接</option> <option value="web">Web浏览器</option> <option value="blob">Blob请求</option> <option value="rpc">RPC接口</option> <option value="aria">Aria2命令</option></select>&nbsp;&nbsp;&nbsp;&nbsp; <label>AriaNg地址：</label> <input id="ariang_host" style="width:30%"/><br/> <small>提示：建议使用RPC请求下载；非HTTPS或非本地RPC域名使用AriaNg下载</small> </div> <div style="margin:2% 0"> <label>RPC配置：[ 域名 : 端口 | 密钥 | 保存目录 ]</label><br/> <input id="rpc_domain" placeholder="ws://192.168.1.2" style="width:25%"/> : <input id="rpc_port" placeholder="6800" style="width:10%"/> | <input id="rpc_token" placeholder="未设置不填" style="width:15%"/> | <input id="rpc_dir" placeholder="留空使用默认目录" style="width:20%"/><br/> <small>注意：RPC默认使用Motrix（需要安装并运行）下载，其他软件请修改参数</small> </div> <div style="margin:2% 0"> <label>Aria2配置：</label> <label>最大连接数：</label> <select id="aria2c_connection_level"> <option value="min">1</option> <option value="mid">8</option> <option value="max">16</option></select>&nbsp;&nbsp;&nbsp;&nbsp; <label>附加参数：</label> <input id="aria2c_addition_parameters" placeholder="见Aria2c文档" style="width:20%"/><br/> <small>说明：用于配置Aria命令下载方式的参数</small> </div> <div style="margin:2% 0"> <label>强制换源：</label> <select id="replace_force"> <option value="0">关闭</option> <option value="1">开启</option> </select> &nbsp;&nbsp;&nbsp;&nbsp; <label>弹幕速度：</label> <input id="danmaku_speed" style="width:5%"/> s &nbsp;&nbsp;&nbsp;&nbsp; <label>弹幕字号：</label> <input id="danmaku_fontsize" style="width:5%"/> px<br/> <small>说明：使用请求到的视频地址在DPlayer进行播放；弹幕速度为弹幕滑过DPlayer的时间</small> </div> <div style="margin:2% 0"> <label>自动下载：</label> <select id="auto_download"> <option value="0">关闭</option> <option value="1">开启</option> </select> &nbsp;&nbsp;&nbsp;&nbsp; <label>视频质量：</label> <select id="video_quality"> {{video_quality_options}}</select><br/> <small>说明：请求地址成功后将自动点击下载视频按钮</small> </div> <div style="margin:2% 0"> <label>授权状态：</label> <select id="auth" disabled="disabled"> <option value="0">未授权</option> <option value="1">已授权</option> </select> <a class="setting-context" href="javascript:;" id="show_login">扫码授权</a> <a class="setting-context" href="javascript:;" id="show_login_2">网页授权</a> <a class="setting-context" href="javascript:;" id="show_logout">取消授权</a> <a class="setting-context" href="javascript:;" id="show_login_help">这是什么？</a> </div> <br/> <div style="text-align:right"> <button class="setting-button" id="save_config">确定</button> </div> </div> <style>#bp_config{opacity:0;display:none;position:fixed;inset:0px;top:0;left:0;width:100%;height:100%;z-index:10000;line-height:normal!important;font-size:14px!important}#bp_config .config-bg{position:absolute;background:#fff;border-radius:10px;padding:20px;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;z-index:10001}#bp_config .config-mark{width:100%;height:100%;position:fixed;top:0;left:0;background:rgba(0,0,0,.5);z-index:10000}#bp_config .setting-button{width:120px;height:40px;border-width:0;border-radius:3px;background:#1e90ff;cursor:pointer;outline:0;color:#fff;font-size:17px}#bp_config .setting-button:hover{background:#59f}#bp_config .setting-context{margin:0 1%;color:#00f}#bp_config .setting-context:hover{color:red}#bp_config input{border:#000 1px solid;width:30%;font-size:13px;font-family:revert}#bp_config select{appearance:auto;border:#000 1px solid}</style> </div> ';
    const config_config = {
        base_api: "https://api.func.cool/bparse",
        request_type: "auto",
        format: "mp4",
        host_key: "0",
        replace_force: "0",
        download_type: "web",
        rpc_domain: "http://localhost",
        rpc_port: "16800",
        rpc_token: "",
        rpc_dir: "",
        aria2c_connection_level: "min",
        aria2c_addition_parameters: "",
        ariang_host: "http://ariang.injahow.com/",
        auto_download: "0",
        video_quality: "0",
        danmaku_speed: "15",
        danmaku_fontsize: "22"
    }, default_config = Object.assign({}, config_config), hostMap = {
        local: (null === (_document$head$innerH = document.head.innerHTML.match(/up[\w-]+\.bilivideo\.com/)) || void 0 === _document$head$innerH ? void 0 : _document$head$innerH[0]) || "未发现本地CDN",
        bd: "upos-sz-mirrorbd.bilivideo.com",
        ks3: "upos-sz-mirrorks3.bilivideo.com",
        ks3b: "upos-sz-mirrorks3b.bilivideo.com",
        ks3c: "upos-sz-mirrorks3c.bilivideo.com",
        ks32: "upos-sz-mirrorks32.bilivideo.com",
        kodo: "upos-sz-mirrorkodo.bilivideo.com",
        kodob: "upos-sz-mirrorkodob.bilivideo.com",
        cos: "upos-sz-mirrorcos.bilivideo.com",
        cosb: "upos-sz-mirrorcosb.bilivideo.com",
        bos: "upos-sz-mirrorbos.bilivideo.com",
        wcs: "upos-sz-mirrorwcs.bilivideo.com",
        wcsb: "upos-sz-mirrorwcsb.bilivideo.com",
        hw: "upos-sz-mirrorhw.bilivideo.com",
        hwb: "upos-sz-mirrorhwb.bilivideo.com",
        upbda2: "upos-sz-upcdnbda2.bilivideo.com",
        upws: "upos-sz-upcdnws.bilivideo.com",
        uptx: "upos-sz-upcdntx.bilivideo.com",
        uphw: "upos-sz-upcdnhw.bilivideo.com",
        js: "upos-tf-all-js.bilivideo.com",
        hk: "cn-hk-eq-bcache-01.bilivideo.com",
        akamai: "upos-hz-mirrorakam.akamaized.net"
    }, videoQualityMap = {
        127: "8K 超高清",
        120: "4K 超清",
        116: "1080P 60帧",
        112: "1080P 高码率",
        80: "1080P 高清",
        74: "720P 60帧",
        64: "720P 高清",
        48: "720P 高清(MP4)",
        32: "480P 清晰",
        16: "360P 流畅"
    };
    let help_clicked = !1;
    const config_functions = {
        save_config() {
            let old_config;
            try {
                old_config = JSON.parse(store.get("config_str"));
            } catch (err) {
                old_config = {};
            } finally {
                old_config = {
                    ...default_config,
                    ...old_config
                };
            }
            const config_str = {};
            for (const key in default_config) config_config[key] !== default_config[key] && (config_str[key] = config_config[key]);
            store.set("config_str", JSON.stringify(config_str));
            for (const key of [ "base_api", "format", "video_quality" ]) if (config_config[key] !== old_config[key]) {
                $("#video_download").hide(), $("#video_download_2").hide();
                break;
            }
            config_config.host_key !== old_config.host_key && (check.refresh(), $("#video_url").attr("href", "#"), 
            $("#video_url_2").attr("href", "#")), config_config.rpc_domain !== old_config.rpc_domain && (config_config.rpc_domain.match("https://") || config_config.rpc_domain.match(/(localhost|127\.0\.0\.1)/) || MessageBox_alert("检测到当前RPC不是localhost本地接口，即将跳转到AriaNg网页控制台页面；请查看控制台RPC接口参数是否正确，第一次加载可能较慢请耐心等待；配置好后即可使用脚本进行远程下载，使用期间不用关闭AriaNg页面！", (() => {
                Download.open_ariang({
                    domain: config_config.rpc_domain,
                    port: config_config.rpc_port,
                    token: config_config.rpc_token
                });
            })));
            for (const key of [ "danmaku_speed", "danmaku_fontsize" ]) if (config_config[key] !== old_config[key]) {
                player.danmaku.config();
                break;
            }
            $("#bp_config").hide(), $("#bp_config").css("opacity", 0), scroll_scroll.show();
        },
        reset_config() {
            for (const key in default_config) config_config[key] = default_config[key], $(`#${key}`).val(default_config[key]);
        },
        show_help() {
            help_clicked ? message_Message_miaow() : (help_clicked = !0, ajax({
                url: `${config_config.base_api}${config_config.base_api.endsWith("/") ? "" : "/"}auth/?act=help`,
                dataType: "text"
            }).then((res => {
                res ? MessageBox_alert(res) : message_Message_warning("获取失败");
            })).finally((() => {
                help_clicked = !1;
            })));
        },
        show_login() {
            auth.login("1");
        },
        show_login_2() {
            auth.login("0");
        },
        show_logout() {
            auth.logout();
        },
        show_login_help() {
            MessageBox_confirm("进行授权之后在远程请求时拥有用户账号原有的权限，例如能够获取用户已经付费或承包的番剧，是否需要授权？", (() => {
                auth.login();
            }));
        }
    };
    function getCookie(cookieName) {
        const cookieList = document.cookie.split(";");
        for (let i = 0; i < cookieList.length; ++i) {
            const arr = cookieList[i].split("=");
            if (cookieName === arr[0].trim()) return arr[1];
        }
        return null;
    }
    const auth = new class {
        constructor() {
            this.auth_clicked = !1, this.auth_window = null, this.TV_KEY = "4409e2ce8ffd12b8", 
            this.TV_SEC = "59b43e04ad6965f34319062b478f83dd";
        }
        hasAuth() {
            return store.get("auth_id") && store.get("auth_sec");
        }
        checkLoginStatus() {
            const [auth_id, auth_sec, access_key, auth_time] = [ store.get("auth_id"), store.get("auth_sec"), store.get("access_key"), store.get("auth_time") || 0 ];
            if (auth_id || auth_sec) {
                if (config_config.base_api !== store.get("pre_base_api") || Date.now() - parseInt(auth_time) > 864e5) {
                    if (!access_key) return message_Message_info("授权已失效"), void this.reLogin();
                    ajax({
                        url: `https://passport.bilibili.com/api/oauth?access_key=${access_key}`,
                        type: "GET",
                        dataType: "json"
                    }).then((res => {
                        if (res.code) return message_Message_info("授权已过期，准备重新授权"), void this.reLogin();
                        store.set("auth_time", Date.now()), ajax({
                            url: `${config_config.base_api}${config_config.base_api.endsWith("/") ? "" : "/"}auth/?act=check&auth_id=${auth_id}&auth_sec=${auth_sec}`,
                            type: "GET",
                            dataType: "json"
                        }).then((res => {
                            res.code && (message_Message_info("检查失败，准备重新授权"), this.reLogin());
                        }));
                    }));
                }
                store.set("pre_base_api", config_config.base_api);
            }
        }
        makeAPIData(param, sec) {
            return {
                ...param,
                sign: md5(`${Object.entries(param).map((e => `${e[0]}=${e[1]}`)).join("&")}${sec}`)
            };
        }
        _login(resolve) {
            this.auth_clicked ? message_Message_miaow() : (this.auth_clicked = !0, ajax({
                url: "https://passport.bilibili.com/x/passport-tv-login/qrcode/auth_code",
                type: "POST",
                data: this.makeAPIData({
                    appkey: this.TV_KEY,
                    csrf: getCookie("bili_jct") || "",
                    local_id: "0",
                    ts: Date.now()
                }, this.TV_SEC)
            }).then(resolve).catch((() => this.auth_clicked = !1)));
        }
        login() {
            const do_login = "1" === (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "1") ? this.loginApp.bind(this) : this.loginWeb.bind(this);
            store.get("auth_id") ? MessageBox_confirm("发现授权记录，是否重新授权？", do_login) : do_login();
        }
        reLogin() {
            this.logout(), store.set("auth_time", "0"), this.loginApp();
        }
        loginApp() {
            this._login((res => {
                if (!res || res.code) return;
                const {url: url, auth_code: auth_code} = res.data;
                let is_login = 0;
                const box = MessageBox_alert('<p>请使用<a href="https://app.bilibili.com/" target="_blank">哔哩哔哩客户端</a>扫码登录</p><div id="login_qrcode"></div>', (() => {
                    is_login || message_Message_info("登陆失败！"), clearInterval(timer), this.auth_clicked = !1;
                }));
                new QRCode(document.getElementById("login_qrcode"), url);
                const timer = setInterval((() => {
                    _ajax({
                        url: "https://passport.bilibili.com/x/passport-tv-login/qrcode/poll",
                        type: "POST",
                        data: this.makeAPIData({
                            appkey: this.TV_KEY,
                            auth_code: auth_code,
                            csrf: getCookie("bili_jct") || "",
                            local_id: "0",
                            ts: Date.now().toString()
                        }, this.TV_SEC)
                    }).then((res => {
                        !res.code && res.data ? (logger.info("login success"), is_login = 1, this.doAuth(res.data), 
                        box.affirm()) : 86038 === res.code && box.affirm();
                    }));
                }), 3e3);
            }));
        }
        loginWeb() {
            this._login((res => {
                if (!res || res.code) return;
                const {url: url, auth_code: auth_code} = res.data;
                this.auth_window = window.open(url);
                let is_login = 0;
                const timer = setInterval((() => {
                    if (!this.auth_window || this.auth_window.closed) return clearInterval(timer), this.auth_clicked = !1, 
                    void (is_login || message_Message_info("登陆失败！"));
                    _ajax({
                        url: "https://passport.bilibili.com/x/passport-tv-login/qrcode/poll",
                        type: "POST",
                        data: this.makeAPIData({
                            appkey: this.TV_KEY,
                            auth_code: auth_code,
                            csrf: getCookie("bili_jct") || "",
                            local_id: "0",
                            ts: Date.now().toString()
                        }, this.TV_SEC)
                    }).then((res => {
                        !res.code && res.data ? (logger.info("login success"), this.doAuth(res.data), is_login = 1, 
                        this.auth_window.close()) : 86038 === res.code && this.auth_window.close();
                    })).catch((() => this.auth_window.close()));
                }), 3e3);
            }));
        }
        logout() {
            if (!store.get("auth_id")) return void MessageBox_alert("没有发现授权记录");
            if (this.auth_clicked) return void message_Message_miaow();
            const [auth_id, auth_sec] = [ store.get("auth_id"), store.get("auth_sec") ];
            ajax({
                url: `${config_config.base_api}${config_config.base_api.endsWith("/") ? "" : "/"}auth/?act=logout&auth_id=${auth_id}&auth_sec=${auth_sec}`,
                type: "GET",
                dataType: "json"
            }).then((res => {
                res.code ? message_Message_warning("注销失败") : (message_Message_success("注销成功"), store.set("auth_id", ""), 
                store.set("auth_sec", ""), store.set("auth_time", "0"), store.set("access_key", ""), 
                $("#auth").val("0"));
            })).finally((() => this.auth_clicked = !1));
        }
        doAuth(param) {
            this.auth_window && !this.auth_window.closed && (this.auth_window.close(), this.auth_window = null), 
            ajax({
                url: `${config_config.base_api}${config_config.base_api.endsWith("/") ? "" : "/"}auth/?act=login&${Object.entries({
                    auth_id: store.get("auth_id"),
                    auth_sec: store.get("auth_sec")
                }).map((e => `${e[0]}=${e[1]}`)).join("&")}`,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    ...param
                })
            }).then((res => {
                res.code ? message_Message_warning("授权失败") : (message_Message_success("授权成功"), res.auth_id && res.auth_sec && (store.set("auth_id", res.auth_id), 
                store.set("auth_sec", res.auth_sec)), store.set("access_key", param.access_token), 
                store.set("auth_time", Date.now()), $("#auth").val("1"));
            })).finally((() => this.auth_clicked = !1));
        }
    };
    var more_style = "<style>.more{float:right;padding:1px;cursor:pointer;color:#757575;font-size:16px;transition:all .3s;position:relative;text-align:center}.more:hover .more-ops-list{display:block}.more-ops-list{display:none;position:absolute;width:80px;left:-15px;z-index:30;text-align:center;padding:10px 0;background:#fff;border:1px solid #e5e9ef;box-shadow:0 2px 4px 0 rgba(0,0,0,.14);border-radius:2px;font-size:14px;color:#222}.more-ops-list li{position:relative;height:34px;line-height:34px;cursor:pointer;transition:all .3s}.more-ops-list li:hover{color:#00a1d6;background:#e7e7e7}</style> ";
    const btn_list = {
        setting_btn: "脚本设置",
        bilibili_parse: "请求地址",
        video_download: "下载视频",
        video_download_2: "下载音频",
        video_download_all: "批量下载",
        more: {
            download_danmaku: "下载弹幕",
            download_subtitle: "下载字幕"
        }
    }, download_svg = '<svg class width="28" height="28" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preserve">\n        <path fill="#757575" d="M16.015,0C7.186,0,0.03,7.157,0.03,15.985 S7.186,31.97,16.015,31.97S32,24.814,32,15.985S24.843,0,16.015,0z"/>\n        <path style="fill:#FFFFFF;" d="M16.942,23.642H9.109C8.496,23.642,8,24.17,8,24.821v0C8,25.472,8.496,26,9.109,26h14.783 C24.504,26,25,25.472,25,24.821v0c0-0.651-0.496-1.179-1.109-1.179H16.942z"/>\n        <path style="fill:#FFFFFF;" d="M8.798,16.998l6.729,6.33c0.398,0.375,1.029,0.375,1.427,0l6.729-6.33 c0.666-0.627,0.212-1.726-0.714-1.726h-3.382c-0.568,0-1.028-0.449-1.028-1.003V8.003C18.56,7.449,18.099,7,17.532,7h-2.582 c-0.568,0-1.028,0.449-1.028,1.003v6.266c0,0.554-0.46,1.003-1.028,1.003H9.511C8.586,15.273,8.132,16.372,8.798,16.998z"/>\n    </svg>', svg_map = {
        setting_btn: '<svg class width="28" height="28" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preserve">\n        <path fill="#757575" style="stroke-miterlimit:10;" d="M16,29.5L16,29.5c-0.828,0-1.5-0.672-1.5-1.5V4c0-0.828,0.672-1.5,1.5-1.5h0 c0.828,0,1.5,0.672,1.5,1.5v24C17.5,28.828,16.828,29.5,16,29.5z"/>\n        <path fill="#757575" style="stroke-miterlimit:10;" d="M29.5,16L29.5,16c0,0.828-0.672,1.5-1.5,1.5H4c-0.828,0-1.5-0.672-1.5-1.5v0 c0-0.828,0.672-1.5,1.5-1.5h24C28.828,14.5,29.5,15.172,29.5,16z"/>\n    </svg>',
        bilibili_parse: '<svg class width="28" height="28" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preserve">\n        <path fill="#757575" d="M28.282,13.508c-0.623-6.932-6.627-12.036-13.41-11.399C8.947,2.665,4.254,7.465,3.716,13.521 c0.786,0.404,1.283,1.226,1.284,2.126v4.157c-0.023,0.565-0.49,1.004-1.043,0.98c-0.521-0.022-0.938-0.448-0.959-0.98v-4.157 c0-0.188-0.113-0.452-0.508-0.452s-0.492,0.275-0.492,0.452v8.176c0,2.446,1.94,4.428,4.333,4.428c0,0,0,0,0,0h7.191 c0.552-1.396,2.107-2.07,3.473-1.505s2.025,2.154,1.473,3.549c-0.552,1.396-2.107,2.07-3.473,1.505 c-0.67-0.277-1.202-0.82-1.473-1.505h-7.19c-3.497,0-6.332-2.897-6.333-6.471l0,0v-8.178c0-1.077,0.706-2.02,1.723-2.303C2.429,5.285,9.393-0.662,17.278,0.059c6.952,0.636,12.445,6.297,13.009,13.407c1.032,0.404,1.713,1.416,1.712,2.545v4.088 c-0.038,1.505-1.262,2.694-2.735,2.656c-1.42-0.037-2.562-1.205-2.599-2.656l0,0v-4.085C26.667,14.924,27.302,13.939,28.282,13.508zM11.334,14.653c-1.105,0-2-0.915-2-2.044s0.896-2.044,2-2.044l0,0c1.105,0,2,0.915,2,2.044S12.439,14.653,11.334,14.653z M20.666,14.653c-1.105,0-2-0.915-2-2.044s0.896-2.044,2-2.044l0,0c1.105,0,2,0.915,2,2.044S21.771,14.653,20.666,14.653z M13.629,21.805c-2.167,0-3.962-1.653-3.962-3.748c0-0.564,0.448-1.022,1-1.022c0.552,0,1,0.458,1,1.022 c0,0.916,0.856,1.704,1.962,1.704c0.612,0.012,1.198-0.253,1.602-0.723c0.352-0.433,0.982-0.493,1.406-0.132 c0,0,0.001,0.001,0.001,0.001c0.047,0.039,0.09,0.083,0.128,0.131c0.404,0.47,0.99,0.734,1.602,0.723 c1.106,0,1.964-0.788,1.964-1.704c0-0.564,0.448-1.022,1-1.022c0.552,0,1,0.458,1,1.022c0,2.095-1.797,3.748-3.964,3.748 c-0.844,0.003-1.67-0.256-2.368-0.742C15.302,21.55,14.475,21.809,13.629,21.805z M29.332,15.333c-0.368,0-0.666,0.305-0.666,0.68 v4.088c-0.001,0.376,0.297,0.681,0.665,0.681c0.368,0.001,0.666-0.304,0.666-0.679c0-0.001,0-0.001,0-0.002v-4.088 c0.002-0.374-0.293-0.678-0.659-0.68c-0.001,0-0.002,0-0.003,0H29.332z"/>\n    </svg>',
        video_download: download_svg,
        video_download_2: download_svg,
        video_download_all: download_svg
    };
    function showVideoToolbar(toolbar_id) {
        const toolbar_obj = $(`#${toolbar_id}`), toolbar_obj_2 = toolbar_obj.clone();
        toolbar_obj_2.attr("id", `${toolbar_id}_2`);
        const left = toolbar_obj_2.find(".video-toolbar-left"), right = toolbar_obj_2.find(".video-toolbar-right");
        left.children().remove(), right.children().remove(), Object.keys(btn_list).map((key => {
            if ("more" === key) {
                const more_map = btn_list[key], el = `<div class="more">更多<div class="more-ops-list">\n                    <ul>${Object.keys(more_map).map((key => `<li><span id="${key}">${more_map[key]}</span></li>`)).join("")}</ul>\n                </div>`;
                return void right.append(el + more_style);
            }
            const item = toolbar_obj.find(".toolbar-left-item-wrap").eq(0).clone();
            item.attr("id", key);
            const svg = svg_map[key].replaceAll("#757575", "currentColor").replace("class", `class="${item.find("svg").attr("class")}"`), span = item.find("span").text(btn_list[key]), item_div = item.find("div").eq(0);
            item_div.attr("title", btn_list[key]), item_div.removeClass("on"), item_div.children().remove(), 
            item_div.append(svg).append(span), left.append(item);
        })), toolbar_obj.after(toolbar_obj_2);
    }
    function initToolbar() {
        if ($(".bili-video-card__details")[0]) !function showVideoCardToolbar(toolbar_class) {
            $(`.${toolbar_class}`).each((function() {
                const $detail = $(this), href = $detail.find(".bili-video-card__title a").attr("href"), match = href && href.match(/\/video\/([0-9A-Za-z]+)/);
                if (match) {
                    const bvId = match[1], $subtitle = $detail.find(".bili-video-card__subtitle"), $span = $("<span></span>").attr("id", bvId).attr("class", "bilibili_card_parse").text("#" + bvId).css("margin-left", "40px");
                    $subtitle.append($span);
                }
            }));
            const key = "setting_btn", label = btn_list[key], svgHtml = svg_map[key].replaceAll("#757575", "currentColor"), $floatBtn = $(`\n      <div id="${key}" class="custom-float-btn" title="${label}">\n        ${svgHtml}\n        <span>${label}</span>\n      </div>\n    `);
            $("<style>").html("\n        .custom-float-btn {\n          position: fixed;\n          bottom: 30px;\n          right: 30px;\n          z-index: 99999;\n          background: #fff;\n          border: 1px solid #ccc;\n          border-radius: 8px;\n          padding: 10px 14px;\n          display: flex;\n          align-items: center;\n          box-shadow: 0 2px 8px rgba(0,0,0,0.15);\n          cursor: pointer;\n          font-size: 14px;\n          color: #333;\n          transition: all 0.2s;\n        }\n        .custom-float-btn:hover {\n          background: #f5f5f5;\n        }\n        .custom-float-btn svg {\n          width: 20px;\n          height: 20px;\n          margin-right: 6px;\n          fill: currentColor;\n        }\n        .custom-float-btn span {\n          white-space: nowrap;\n        }\n      ").appendTo("head"), 
            $("body").append($floatBtn);
        }("bili-video-card__details"); else if ($("#arc_toolbar_report")[0]) showVideoToolbar("arc_toolbar_report"); else if ($("#playlistToolbar")[0]) showVideoToolbar("playlistToolbar"); else if ($("#videoToolbar")[0]) !function showFestivalToolbar(toolbar_id) {
            const toolbar_obj = $(`#${toolbar_id}`), toolbar_obj_2 = toolbar_obj.clone();
            toolbar_obj_2.attr("id", `${toolbar_id}_2`);
            const left = toolbar_obj_2.find(".video-toolbar-content_left"), right = toolbar_obj_2.find(".video-toolbar-content_right");
            toolbar_obj_2.find(".video-toobar_title").remove(), left.children().remove();
            const watchlater = right.find(".watchlater").clone();
            right.children().remove(), right.append(watchlater), toolbar_obj_2.find(".video-desc-wrapper").remove(), 
            Object.keys(btn_list).map((key => {
                if ("more" === key) {
                    const list = watchlater.find(".more-list"), list_li = list.children().eq(0);
                    list.children().remove();
                    const more_map = btn_list[key];
                    return void Object.keys(more_map).map((key => {
                        const li = list_li.clone();
                        li.html(`<span id="${key}">${more_map[key]}</span>`), list.append(li);
                    }));
                }
                const item = toolbar_obj.find(".video-toolbar-content_item").eq(0).clone();
                item.attr("id", key), item.attr("title", btn_list[key]);
                const svg = svg_map[key].replaceAll("#757575", "currentColor"), item_icon = item.find(".content-item_icon").eq(0);
                item_icon.removeClass("ic_like"), item_icon.html(svg), item.html(""), item.append(item_icon), 
                item.append(btn_list[key]), left.append(item);
            })), toolbar_obj.after(toolbar_obj_2);
        }("videoToolbar"); else if ($(".toolbar")[0]) !function showBangumiToolbar(toolbar_class) {
            const toolbar_obj = $(`.${toolbar_class}`).eq(0), toolbar_obj_2 = toolbar_obj.clone(), left = toolbar_obj_2.find(".toolbar-left"), right = toolbar_obj_2.find(".toolbar-right");
            left.children().remove(), right.children().remove(), Object.keys(btn_list).map((key => {
                if ("more" === key) {
                    const more_map = btn_list[key], el = `<div class="more">更多<div class="more-ops-list">\n                    <ul>${Object.keys(more_map).map((key => `<li><span id="${key}">${more_map[key]}</span></li>`)).join("")}</ul>\n                </div>`;
                    return void right.append(el + more_style);
                }
                const item = toolbar_obj.find(".toolbar-left").children().eq(0).clone();
                item.attr("id", key), item.attr("title", btn_list[key]);
                const svg = svg_map[key].replaceAll("#757575", "currentColor").replace("class", `class="${item.find("svg").attr("class")}"`), span = item.find("span").text(btn_list[key]);
                item.children().remove(), item.append(svg).append(span), left.append(item);
            })), toolbar_obj.after(toolbar_obj_2);
        }("toolbar"); else if ($(".edu-play-left")[0]) {
            const toolbar_obj = $(".edu-play-left").children().eq(1), toolbar_class = toolbar_obj.attr("class"), span_class = toolbar_obj.children().eq(0).attr("class"), span_class_svg = toolbar_obj.children().eq(0).children().eq(0).attr("class"), span_class_text = toolbar_obj.children().eq(0).children().eq(1).attr("class");
            toolbar_obj.after(function make_toolbar_bangumi(main_class_name, sub_class_names) {
                let toolbar_elements = Object.keys(btn_list).map((key => {
                    if ("more" === key) {
                        const more_map = btn_list[key];
                        return `<div class="more">更多<div class="more-ops-list">\n                    <ul>${Object.keys(more_map).map((key => ((id, name) => `<li><span id="${id}">${name}</span></li>`)(key, more_map[key]))).join("")}</ul>\n                </div>`;
                    }
                    return ((id, class_names, svg, name) => `<div id="${id}" mr-show="" class="${class_names[0]}">\n                <span class="${class_names[1]}">\n                    ${svg}\n                </span>\n                <span class="${class_names[2]}">${name}</span>\n            </div>`)(key, sub_class_names, svg_map[key], btn_list[key]);
                })).join("");
                return `<div class="${main_class_name}">\n            ${toolbar_elements}\n            ${more_style}\n        </div>`;
            }(toolbar_class, [ span_class, span_class_svg, span_class_text ]));
        } else $("#toolbar_module")[0] && $("#toolbar_module").after('<div id="toolbar_module_2" class="tool-bar clearfix report-wrap-module report-scroll-module media-info" scrollshow="true"> <div id="setting_btn" class="like-info"> <i class="iconfont icon-add"></i><span>脚本设置</span> </div> <div id="bilibili_parse" class="like-info"> <i class="iconfont icon-customer-serv"></i><span>请求地址</span> </div> <div id="video_download" class="like-info" style="display:none"> <i class="iconfont icon-download"></i><span>下载视频</span> </div> <div id="video_download_2" class="like-info" style="display:none"> <i class="iconfont icon-download"></i><span>下载音频</span> </div> <div id="video_download_all" class="like-info"> <i class="iconfont icon-download"></i><span>批量下载</span> </div> <div class="more">更多<div class="more-ops-list"> <ul> <li><span id="download_danmaku">下载弹幕</span></li> <li><span id="download_subtitle">下载字幕</span></li> </ul> </div> </div> <style>.tool-bar .more{float:right;cursor:pointer;color:#757575;font-size:16px;transition:all .3s;position:relative;text-align:center}.tool-bar .more:hover .more-ops-list{display:block}.tool-bar:after{display:block;content:"";clear:both}.more-ops-list{display:none;position:absolute;width:80px;left:-65px;z-index:30;text-align:center;padding:10px 0;background:#fff;border:1px solid #e5e9ef;box-shadow:0 2px 4px 0 rgba(0,0,0,.14);border-radius:2px;font-size:14px;color:#222}.more-ops-list li{position:relative;height:34px;line-height:34px;cursor:pointer;transition:all .3s}.more-ops-list li:hover{color:#00a1d6;background:#e7e7e7}</style> </div> ');
        $("#limit-mask-wall")[0] && $("#limit-mask-wall").remove();
    }
    var main = class {
        constructor() {
            logger.debug("\n %c bilibili-parse-download.user.js v2.6.3 adce35b %c https://github.com/injahow/user.js \n\n", "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0;");
        }
        init() {
            initToolbar();
            const root_div = document.createElement("div");
            root_div.id = "bp_root", document.body.append(root_div), function initConfig(el) {
                let options = '<option value="0">关闭</option>';
                for (const k in hostMap) options += `<option value="${k}">${hostMap[k]}</option>`;
                config = config.replace("{{host_key_options}}", options), options = '<option value="0">与播放器相同</option>';
                for (const k in videoQualityMap) options += `<option value="${k}">${videoQualityMap[k]}</option>`;
                config = config.replace("{{video_quality_options}}", options), el && $(el)[0] ? $(el).append(config) : $("body").append(config);
                const config_str = store.get("config_str");
                try {
                    const old_config = JSON.parse(config_str);
                    for (const key in old_config) Object.hasOwnProperty.call(config_config, key) && (config_config[key] = old_config[key]);
                } catch {
                    logger.debug("初始化脚本配置"), store.set("config_str", "{}");
                }
                for (const key in config_config) $(`#${key}`).on("input", (e => {
                    config_config[key] = e.delegateTarget.value;
                }));
                for (const k in config_functions) {
                    const e = $(`#${k}`)[0];
                    e && (e.onclick = config_functions[k]);
                }
                for (const key in config_config) $(`#${key}`).val(config_config[key]);
                window.onbeforeunload = () => {
                    const bp_aria2_window = window.bp_aria2_window;
                    bp_aria2_window && !bp_aria2_window.closed && bp_aria2_window.close();
                };
            }(`#${root_div.id}`), function initMessage(el) {
                el && $(el)[0] ? $(el).append(message) : $("body").append(message);
            }(`#${root_div.id}`), user.lazyInit(), auth.checkLoginStatus(), check.refresh(), 
            $(`#${root_div.id}`).append('<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/dplayer/1.25.0/DPlayer.min.css">'), 
            $(`#${root_div.id}`).append('<a id="video_url" style="display:none;" target="_blank" href="#"></a>'), 
            $(`#${root_div.id}`).append('<a id="video_url_2" style="display:none;" target="_blank" href="#"></a>');
        }
        run() {
            let api_url, api_url_temp;
            this.init();
            const evt = {
                setting_btn() {
                    user.lazyInit(!0);
                    for (const key in config_config) $(`#${key}`).val(config_config[key]);
                    $("#auth").val(auth.hasAuth() ? "1" : "0"), $("#bp_config").show(), $("#bp_config").animate({
                        opacity: "1"
                    }, 300), scroll_scroll.hide();
                },
                bilibili_parse() {
                    user.lazyInit(!0);
                    const vb = video.base(), [type, aid, p, cid, epid] = [ vb.type(), vb.aid(), vb.p(), vb.cid(), vb.epid() ], {q: q} = video.get_quality();
                    api_url = `${config_config.base_api}?av=${aid}&p=${p}&cid=${cid}&ep=${epid}&q=${q}&type=${type}&format=${config_config.format}&otype=json&_host=${config_config.host_key}&_req=${config_config.request_type}&_q=${config_config.video_quality}`;
                    const [auth_id, auth_sec] = [ store.get("auth_id"), store.get("auth_sec") ];
                    if (auth_id && auth_sec && (api_url += `&auth_id=${auth_id}&auth_sec=${auth_sec}`), 
                    api_url !== api_url_temp || "local" === config_config.request_type) $("#video_url").attr("href", "#"), 
                    $("#video_url_2").attr("href", "#"), api_url_temp = api_url, message_Message_info("开始请求"), 
                    api.get_url((res => {
                        if (res && !res.code) {
                            let url, url_2;
                            if (message_Message_success("请求成功"), res.times && message_Message_info(`剩余请求次数：${res.times}`), 
                            res.url) url = res.url.replace("http://", "https://"), url_2 = "#"; else {
                                if (!res.video || !res.audio) return void message_Message_warning("数据错误");
                                url = res.video.replace("http://", "https://"), url_2 = res.audio.replace("http://", "https://");
                            }
                            $("#video_url").attr("href", url), $("#video_url").attr("download", vb.filename() + Download.url_format(url)), 
                            $("#video_download").show(), "#" !== url_2 && ($("#video_url_2").attr("href", url_2), 
                            $("#video_url_2").attr("download", vb.filename() + "_audio.mp4"), $("#video_download_2").show()), 
                            (user.needReplace() || vb.isLimited() || "1" === config_config.replace_force) && player.replace_player(url, url_2), 
                            "1" === config_config.auto_download && $("#video_download").click();
                        }
                    })); else {
                        message_Message_miaow();
                        const url = $("#video_url").attr("href"), url_2 = $("#video_url_2").attr("href");
                        url && "#" !== url && ($("#video_download").show(), "dash" === config_config.format && $("#video_download_2").show(), 
                        (user.needReplace() || vb.isLimited() || "1" === config_config.replace_force) && !$("#bp_dplayer")[0] && player.replace_player(url, url_2), 
                        "1" === config_config.auto_download && $("#video_download").click());
                    }
                },
                download_danmaku() {
                    const vb = video.base();
                    Download.download_danmaku_ass(vb.cid(), vb.filename());
                },
                download_subtitle() {
                    Download.download_subtitle_vtt(0, video.base().filename());
                },
                video_download_all() {
                    user.lazyInit(!0), auth.hasAuth() ? "rpc" === config_config.download_type ? Download.download_all() : MessageBox_confirm("仅支持使用RPC接口批量下载，请确保RPC环境正常，是否继续？", (() => {
                        Download.download_all();
                    })) : MessageBox_confirm("批量下载仅支持授权用户使用RPC接口下载，是否进行授权？", (() => {
                        auth.login();
                    }));
                },
                video_download() {
                    const type = config_config.download_type;
                    if ("web" === type) $("#video_url")[0].click(); else if ("a" === type) {
                        const [video_url, video_url_2, file_name, file_name_2] = [ $("#video_url").attr("href"), $("#video_url_2").attr("href"), $("#video_url").attr("download"), $("#video_url_2").attr("download") ], msg = `建议使用IDM、FDM等软件安装其浏览器插件后，鼠标右键点击链接下载~<br/><br/><a href="${video_url}" download="${file_name}" target="_blank" style="text-decoration:underline;">&gt视频地址&lt</a><br/><br/>` + ("dash" === config_config.format ? `<a href="${video_url_2}" download="${file_name_2}" target="_blank" style="text-decoration:underline;">&gt音频地址&lt</a>` : "");
                        MessageBox_alert(msg);
                    } else if ("aria" === type) {
                        const [video_url, video_url_2] = [ $("#video_url").attr("href"), $("#video_url_2").attr("href") ], video_title = video.base().filename(), [file_name, file_name_2] = [ video_title + Download.url_format(video_url), video_title + ".m4a" ], aria2c_header = `--header "User-Agent: ${window.navigator.userAgent}" --header "Referer: ${window.location.href}"`, [url_max_connection, server_max_connection] = {
                            min: [ 1, 5 ],
                            mid: [ 16, 8 ],
                            max: [ 32, 16 ]
                        }[config_config.aria2c_connection_level] || [ 1, 5 ], aria2c_max_connection_parameters = `--max-concurrent-downloads ${url_max_connection} --max-connection-per-server ${server_max_connection}`, [code, code_2] = [ `aria2c "${video_url}" --out "${file_name}"`, `aria2c "${video_url_2}" --out "${file_name_2}"` ].map((code => `${code} ${aria2c_header} ${aria2c_max_connection_parameters} ${config_config.aria2c_addition_parameters}`)), msg = `点击文本框即可复制下载命令！<br/><br/>视频：<br/><input id="aria2_code" value='${code}' onclick="bp_clip_btn('aria2_code')" style="width:100%;"></br></br>` + ("dash" === config_config.format ? `音频：<br/><input id="aria2_code_2" value='${code_2}' onclick="bp_clip_btn('aria2_code_2')" style="width:100%;"><br/><br/>全部：<br/><textarea id="aria2_code_all" onclick="bp_clip_btn('aria2_code_all')" style="min-width:100%;max-width:100%;min-height:100px;max-height:100px;">${code}\n${code_2}</textarea>` : "");
                        !window.bp_clip_btn && (window.bp_clip_btn = id => {
                            $(`#${id}`).select(), document.execCommand("copy") ? message_Message_success("复制成功") : message_Message_warning("复制失败");
                        }), MessageBox_alert(msg);
                    } else {
                        const url = $("#video_url").attr("href"), filename = video.base().filename() + Download.url_format(url);
                        Download.download(url, filename, type);
                    }
                },
                video_download_2() {
                    const type = config_config.download_type;
                    if ("web" === type) $("#video_url_2")[0].click(); else if ("a" === type) $("#video_download").click(); else if ("aria" === type) $("#video_download").click(); else {
                        const url = $("#video_url_2").attr("href"), filename = video.base().filename() + ".m4a";
                        Download.download(url, filename, type);
                    }
                },
                bilibili_card_parse() {
                    user.lazyInit(!0);
                    const bvId = this.id;
                    video.card(bvId).then((vb => {
                        const [type, aid, p, cid, epid] = [ vb.type(), vb.aid(), vb.p(), vb.cid(), vb.epid() ], {q: q} = video.get_quality();
                        api_url = `${config_config.base_api}?av=${aid}&p=${p}&cid=${cid}&ep=${epid}&q=${q}&type=${type}&format=${config_config.format}&otype=json&_host=${config_config.host_key}&_req=${config_config.request_type}&_q=${config_config.video_quality}`;
                        const [auth_id, auth_sec] = [ store.get("auth_id"), store.get("auth_sec") ];
                        auth_id && auth_sec && (api_url += `&auth_id=${auth_id}&auth_sec=${auth_sec}`), 
                        api_url_temp = api_url, message_Message_info("开始请求"), api.get_card_url(vb, (res => {
                            if (res && !res.code) {
                                let url, url_2;
                                if (message_Message_success("请求成功"), res.times && message_Message_info(`剩余请求次数：${res.times}`), 
                                res.url) url = res.url.replace("http://", "https://"), url_2 = "#"; else {
                                    if (!res.video || !res.audio) return void message_Message_warning("数据错误");
                                    url = res.video.replace("http://", "https://"), url_2 = res.audio.replace("http://", "https://");
                                }
                                const filename = vb.pupdate() + "-" + vb.filename() + Download.url_format(url);
                                Download.download(url, filename, "rpc");
                            }
                        }));
                    }));
                }
            };
            window.bpd = evt, Object.entries(evt).forEach((_ref => {
                let [k, v] = _ref;
                return $("body").on("click", `#${k}`, v);
            })), Object.entries(evt).forEach((_ref2 => {
                let [k, v] = _ref2;
                return $("body").on("click", `.${k}`, v);
            })), $("body").on("click", "a.router-link-active", (function() {
                this !== $('li[class="on"]').find("a")[0] && check.refresh();
            })), $("body").on("click", "li.ep-item", (() => {
                check.refresh();
            })), $("body").on("click", "button.bilibili-player-iconfont-next", (() => {
                check.refresh();
            })), $("body").on("click", "li.bui-select-item", (() => {
                check.refresh();
            })), $("body").on("click", ".rec-list", (() => {
                check.refresh();
            })), $("body").on("click", ".bilibili-player-ending-panel-box-videos", (() => {
                check.refresh();
            })), setInterval((() => {
                check.href !== location.href && check.refresh();
            }), 500), setInterval((() => {
                try {
                    const vb = video.base();
                    check.aid === vb.aid() && check.cid === vb.cid() || check.refresh();
                } catch (error) {}
            }), 1500);
        }
    };
    window.bp_fun_locked || (window.bp_fun_locked = !0, $(".error-text")[0] || setTimeout((() => {
        (new main).run();
    }), 5e3));
}();