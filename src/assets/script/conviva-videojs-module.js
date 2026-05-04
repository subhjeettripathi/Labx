/*! (C) 2022 Conviva, Inc. All rights reserved. Confidential and proprietary. */
!function(t, i) {
    var n;
    "function" == typeof define && define.amd ? define(i) : ("object" == typeof exports || "object" == typeof module && module.exports) && (module.exports = i()), 
    void 0 !== t && t && (void 0 !== t.Conviva && t.Conviva ? t.Conviva.ProxyMonitor || t.ConvivaModuleLoading || (n = i(), 
    t.ConvivaModuleLoading = !0, t.Conviva.ProxyMonitor = n.ProxyMonitor, t.Conviva.Impl.VideojsProxy = n.Impl.VideojsProxy, 
    delete t.ConvivaModuleLoading) : t.ConvivaModule || t.ConvivaModuleLoading || (t.ConvivaModuleLoading = !0, 
    t.ConvivaModule = i(), delete t.ConvivaModuleLoading));
}(this, function() {
    var o = {};
    return function() {
        "use strict";
        function t(t, i, n, v) {
            var l = this;
            l.t = [], l.i = 0, l.o = 0, l.u = !1, this.h = -1, this.v = -1, this.l = v.Constants.PlayerState.UNKNOWN, 
            this.p = !1, this.N = 0, this.V = -1, this.C = "", this.g = null, this.A = !1, 
            this.I = function(t, i, n) {
                void 0 === n && (n = l.m), l.O.push([ t, i, n ]), n.on(t, i);
            }, this.j = function(t, i, n) {
                (n = void 0 === n ? l.m : n).off(t, i);
            }, this.P = function() {
                l.I("onContentPauseRequested", function(t) {
                    l.M("onContentPauseRequested", t);
                }), l.I("onContentResumeRequested", function(t) {
                    l.M("onContentResumeRequested", t);
                }), l.I("abort", function(t) {
                    l.M("abort", t);
                }), l.I("loadstart", function(t) {
                    l.M("loadstart", t);
                }), l.I("firstplay", function(t) {
                    l.M("firstplay", t), l.k(t);
                }), l.I("play", function(t) {
                    l.M("play", t), l.k(t);
                }), l.I("ended", function(t) {
                    l.M("ended", t), l.R(v.Constants.PlayerState.STOPPED);
                }), l.I("pause", function(t) {
                    l.M("pause", t), l.k(t), l.R(v.Constants.PlayerState.PAUSED);
                }), l.I("playing", function(t) {
                    l.M("playing", t), l.k(t), 0 === l.m.currentTime() ? l.u = !0 : 0 < l.m.currentTime() && (l.u = !1);
                }), l.I("waiting", function(t) {
                    l.M("waiting", t), l.k(t), l.R(v.Constants.PlayerState.BUFFERING);
                }), l.I("timeupdate", function() {
                    l.u && (l.i++, l.l !== v.Constants.PlayerState.PLAYING) && l.m && !l.m.seeking() && l.R(v.Constants.PlayerState.PLAYING);
                }), l.I("error", function(t) {
                    l.q(t);
                }), l.I("contenterror", function(t) {
                    l.q(t);
                }), l.I("aderror", function(t) {
                    l.q(t);
                }), l.I("loadedmetadata", function(t) {
                    l.M("loadedmetadata", t), l.k(t), l.B() || l.F();
                }), l.I("loadeddata", function(t) {
                    l.M("loadeddata", t), l.k(t);
                }), l.I("durationchange", function(t) {
                    l.M("durationchange", t), l.k(t);
                }), l.I("seeking", function(t) {
                    l.M("seeking", t), l.k(t), l.isSeekStarted || (l.isSeekStarted = !0, 
                    l.S && l.S.reportPlaybackMetric(v.Constants.Playback.SEEK_STARTED, "CONVIVA")), 
                    l.u && l.l !== v.Constants.PlayerState.BUFFERING && (l.M("Adjusting Conviva player state to: BUFFERING"), 
                    l.R(v.Constants.PlayerState.BUFFERING));
                }), l.I("seeked", function(t) {
                    l.M("seeked", t), l.k(t), l.isSeekStarted = !1, l.S && l.S.reportPlaybackMetric(v.Constants.Playback.SEEK_ENDED, "CONVIVA");
                }), l.I("progress", function() {
                    l.A || l.U();
                }), l.I("stalled", function() {}), l.I("resize", function() {
                    var t, i;
                    !l.B() && l.A || l.U(), "function" == typeof l.m.videoWidth && "function" == typeof l.m.videoHeight && (t = l.m.videoWidth(), 
                    i = l.m.videoHeight(), !isNaN(t) && 0 < t && t !== l.h || !isNaN(i) && 0 < i && i !== l.v) && (l.h = t, 
                    l.v = i, l.S.reportPlaybackMetric(v.Constants.Playback.RESOLUTION, t, i, "CONVIVA"));
                });
            }, this.F = function() {
                if (!l.A) {
                    for (var t, i = l.m.textTracks(), n = 0; n < i.length; n++) "segment-metadata" === i[n].label && (t = i[n]);
                    t && (t.on("cuechange", l.D), l.A = !0);
                }
            }, this.G = function() {
                for (var t, i = l.m.textTracks(), n = 0; n < i.length; n++) "segment-metadata" === i[n].label && (t = i[n]);
                t && (t.off("cuechange", l.D), l.A = !1);
            }, this.D = function() {
                var t = this.activeCues[0];
                if (t && t.value && t.value.bandwidth && l.S && l.l !== v.Constants.PlayerState.UNKNOWN) {
                    var i = 0, n = t.value.bandwidth, e = l.m;
                    if (e) {
                        var o, a, s = e.tech(!0);
                        if (s) if (s.vhs && s.vhs.playlists && s.vhs.playlists.media ? (a = s.vhs.playlists, 
                        h = s.vhs.playlists.media()) : s.hls && s.hls.playlists && s.hls.playlists.media && (a = s.hls.playlists, 
                        h = s.hls.playlists.media()), h && h.attributes) {
                            if (h.attributes.BANDWIDTH) {
                                var r = e.audioTracks();
                                if (r && 0 < r.length) for (var f = 0; f < r.length; f++) {
                                    var u = r[f];
                                    if (u.enabled) {
                                        o = u;
                                        break;
                                    }
                                }
                            }
                            o && h.attributes.AUDIO && a && a.master && a.master.mediaGroups && a.master.mediaGroups.AUDIO && (s = a.master.mediaGroups.AUDIO[h.attributes.AUDIO]) && (e = s[o.id]) && e.playlists && e.playlists[0] && (a = e.playlists[0].attributes) && a.BANDWIDTH && (i = a.BANDWIDTH);
                        }
                    }
                    var h = Math.round((n + i) / 1e3);
                    h !== l.N && (l.N = h, l.S.reportPlaybackMetric(v.Constants.Playback.BITRATE, l.N, "CONVIVA")), 
                    t.value.resolution && t.value.resolution.width && t.value.resolution.height && (s = t.value.resolution.width, 
                    e = t.value.resolution.height, !isNaN(s) && 0 < s && s !== l.h || !isNaN(e) && 0 < e && e !== l.v) && (l.h = s, 
                    l.v = e, l.S.reportPlaybackMetric(v.Constants.Playback.RESOLUTION, s, e, "CONVIVA"));
                }
            }, this.U = function() {
                var t = 0, i = 0, n = 0;
                if (l.S && l.l !== v.Constants.PlayerState.UNKNOWN) {
                    var e = l.m;
                    if (e) {
                        var o, a, s = e.tech({
                            IWillNotUseThisInPlugins: !0
                        });
                        if (s) {
                            if (s.vhs && s.vhs.playlists && s.vhs.playlists.media ? (d = s.vhs.playlists, 
                            c = s.vhs.playlists.media()) : s.hls && s.hls.playlists && s.hls.playlists.media && (d = s.hls.playlists, 
                            c = s.hls.playlists.media()), c && c.attributes) {
                                c.attributes.BANDWIDTH && (n = c.attributes.BANDWIDTH);
                                var r, f = e.audioTracks();
                                if (f && 0 < f.length) for (var u = 0; u < f.length; u++) {
                                    var h = f[u];
                                    if (h.enabled) {
                                        r = h;
                                        break;
                                    }
                                }
                                return t = n + (i = r && c.attributes.AUDIO && d && d.master && d.master.mediaGroups && d.master.mediaGroups.AUDIO && (d = d.master.mediaGroups.AUDIO[c.attributes.AUDIO]) && (c = d[r.id]) && c.playlists && c.playlists[0] && (d = c.playlists[0].attributes) && d.BANDWIDTH ? d.BANDWIDTH : i), 
                                void ((o = Math.round(t / 1e3)) !== l.N && (l.N = o, 
                                l.S.reportPlaybackMetric(v.Constants.Playback.BITRATE, l.N, "CONVIVA")));
                            }
                            var c = s.shakaPlayer_ || s.shaka_ || s.shakaPlayer;
                            if (c && "function" == typeof c.getStats) {
                                var d = c.getStats();
                                if (d && d.streamBandwidth) return void ((o = Math.round(d.streamBandwidth / 1e3)) !== l.N && (l.N = o, 
                                l.S.reportPlaybackMetric(v.Constants.Playback.BITRATE, l.N, "CONVIVA")));
                            }
                            var c = s.hls_;
                            if (c && c.levels && 0 <= c.currentLevel) {
                                var d = c.levels[c.currentLevel];
                                if (d && d.bitrate) return void ((o = Math.round(d.bitrate / 1e3)) !== l.N && (l.N = o, 
                                l.S.reportPlaybackMetric(v.Constants.Playback.BITRATE, l.N, "CONVIVA")));
                            }
                        }
                        e.mediaPlayer ? a = e.mediaPlayer : e.dash && e.dash.mediaPlayer && (a = e.dash.mediaPlayer), 
                        a && "function" == typeof a.getQualityFor && "function" == typeof a.getBitrateInfoListFor && (s = a.getQualityFor("audio"), 
                        c = a.getBitrateInfoListFor("audio"), void 0 !== s && c && c[s] && c[s].bitrate && (i = c[s].bitrate), 
                        d = a.getQualityFor("video"), e = a.getBitrateInfoListFor("video"), 
                        t = i + (n = void 0 !== d && e && e[d] && e[d].bitrate ? e[d].bitrate : n), 
                        (o = Math.round(t / 1e3)) !== l.N) && (l.N = o, l.S.reportPlaybackMetric(v.Constants.Playback.BITRATE, l.N, "CONVIVA"));
                    }
                }
            }, this.getBufferLength = function() {
                var t = l.m.buffered();
                if ("number" != typeof t) return -1;
                for (var i = 0, n = 0; n < t.length; n++) {
                    var e = t.start(n), o = t.end(n);
                    e <= l.m.currentTime() && l.m.currentTime() < o && (i += o - l.m.currentTime());
                }
                return l.J = i, 1e3 * l.J;
            }, this._ = function() {
                for (var t = 0; t < l.O.length; t++) {
                    var i = l.O[t];
                    l.j(i[0], i[1], i[2]);
                }
                l.O = [];
            }, this.T = function() {
                l.m && (l.L = l.m.readyState(), 0 === l.m.readyState() || l.m.ended() ? l.R(v.Constants.PlayerState.STOPPED) : (l.m.paused() || l.m.seeking()) && l.R(v.Constants.PlayerState.PAUSED));
            }, this.R = function(t) {
                l.S && (l.l = t, l.S.reportPlaybackMetric(v.Constants.Playback.PLAYER_STATE, l.l, "CONVIVA"), 
                l.W(), l.Y = !0);
            }, this.k = function(t) {
                if (l.S) {
                    var i, n = !0, e = !0, o = (l.H && ((i = l.m.playlist && l.m.playlist() && 0 < l.m.playlist().length ? l.m.playlist()[l.m.playlist.currentItem()] : l.m.mediainfo) && (((o = i.custom_fields || i.customFields) && (o.isLive || o.islive) || 0 < i.duration) && (n = !1), 
                    0 < i.duration) && (e = !1), l.K) && void 0 !== l.K.isLive && (n = !1), 
                    {});
                    if (l.m && l.m.playlist && "function" == typeof l.m.playlist.currentItem && (e || n)) {
                        var a, s = !1;
                        switch (t.type) {
                          case "play":
                          case "waiting":
                            -1 === l.m.playlist.currentItem() && (s = !0);
                            break;

                          case "playing":
                          case "seeking":
                          case "seeked":
                          case "pause":
                          case "loadedmetadata":
                          case "loadeddata":
                          case "durationChange":
                            s = !0;
                        }
                        s && ("function" == typeof l.m.duration && (a = l.m.duration(), 
                        l.m.duration() === 1 / 0 || isNaN(l.m.duration()) || (a = Math.round(l.m.duration()))), 
                        a) && a !== l.V && ((l.V = a) === 1 / 0 ? n && (o[v.Constants.IS_LIVE] = v.Constants.StreamType.LIVE) : 0 < a && (e && (o[v.Constants.DURATION] = a), 
                        n) && (o[v.Constants.IS_LIVE] = v.Constants.StreamType.VOD));
                    }
                    "function" == typeof l.m.currentSource && l.m.currentSource().src && (i = l.m.currentSource().src) !== l.C && (l.C = i, 
                    o[v.Constants.STREAM_URL] = i), "{}" !== JSON.stringify(o) && l.S.setContentInfo(o);
                }
            }, this.X = function() {
                var t;
                l.m && "function" == typeof l.m.getVideoPlaybackQuality && l.m.getVideoPlaybackQuality() && (t = l.m.getVideoPlaybackQuality().droppedVideoFrames) && 0 < t && t !== l.g && (l.g = t, 
                l.S.reportPlaybackMetric(v.Constants.Playback.DROPPED_FRAMES_TOTAL, l.g, "CONVIVA"));
            }, this.Z = function() {
                this.$ = 0, this.tt = 0, this.J = 0, this.it = this.nt.createTimer(this.et, 100, "videojsProxy._poll()");
            }, this.et = function() {
                l.S && (l.S.getAdType() !== v.Constants.AdType.CLIENT_SIDE && l.m ? (l.S.reportPlaybackMetric(v.Constants.Playback.PLAY_HEAD_TIME, 1e3 * l.m.currentTime(), "CONVIVA"), 
                l.S.reportPlaybackMetric(v.Constants.Playback.BUFFER_LENGTH, l.getBufferLength(), "CONVIVA"), 
                l.ot(), l.at(), l.X()) : l.l !== v.Constants.PlayerState.UNKNOWN && (l.l = v.Constants.PlayerState.UNKNOWN));
            }, this.ot = function() {
                l.$ = l.tt, l.tt = l.m.currentTime();
                var t, i = Date.now();
                0 < l.st && i > l.st && (t = (t = (t = l.tt - l.$) < 0 ? 0 : t) / (i - l.st) * 1e3, 
                l.t.push(t)), l.st = i, l.t.length > Math.max(8, 4) && l.t.shift();
            }, this.at = function() {
                var t = l.t.length;
                if (t >= Math.min(4, 8)) {
                    for (var i = 0, n = l.t.slice(), e = 0; e < n.length; e++) i += n[e];
                    i /= t;
                    var o = 1, a = .25, s = l.m.playbackRate();
                    !isNaN(s) && s !== 1 / 0 && 0 < s && (o *= s = l.B() && s < .5 ? .5 : s, 
                    a *= s), l.l !== v.Constants.PlayerState.PLAYING && 4 <= t && Math.abs(i - o) < a ? l.m.seeking() || (l.M("Adjusting Conviva player state to: PLAYING"), 
                    l.R(v.Constants.PlayerState.PLAYING)) : 8 <= t && 0 === i && (l.m.paused() ? l.l !== v.Constants.PlayerState.PAUSED && (l.M("Adjusting Conviva player state to: PAUSED"), 
                    l.R(v.Constants.PlayerState.PAUSED)) : l.m.seeking() || l.l !== v.Constants.PlayerState.BUFFERING && (l.M("Adjusting Conviva player state to: BUFFERING"), 
                    l.R(v.Constants.PlayerState.BUFFERING)));
                }
            }, this.rt = function() {
                this.it && (this.it(), this.it = null);
            }, this.W = function() {
                l.t = [], l.$ = -1, l.st = 0;
            }, this.ft = function() {
                l.o = 0, l.i = 0;
            }, this.q = function(t) {
                l.M("error", t), l.m && l.m.error() && !l.H && (t = "Error Type: " + t.type + ", Error Message: " + l.m.error().message + ", Error Code: " + l.m.error().code, 
                l.S.reportPlaybackError(t, v.Constants.ErrorSeverity.FATAL));
            }, this.M = function(t) {
                this.H ? this.ut(t) : this.ut.log(t, v.SystemSettings.LogLevel.DEBUG);
            }, this.ht = function(t, i) {
                if (!t) throw new Error("bcVideojsProxy: player argument cannot be null.");
                l.m = t, l.S = i, l.M("bcVideojsProxy.update()"), 0 === l.O.length && l.P(), 
                l.W(), l.ft(), l.rt(), l.Z(), l.h = -1, l.v = -1, l.l = v.Constants.PlayerState.UNKNOWN, 
                l.N = 0, l.V = -1, l.C = "", l.g = null, l.T();
                var t = {};
                t[v.Constants.MODULE_NAME] = "BC", t[v.Constants.MODULE_VERSION] = "4.1.12", 
                l.S.setContentInfo(t), this.B() || this.F(), !l.B() && l.A || (l.U(), 
                "function" == typeof l.m.videoWidth && "function" == typeof l.m.videoHeight && (i = l.m.videoWidth(), 
                t = l.m.videoHeight(), !isNaN(i) && 0 < i && i !== l.h || !isNaN(t) && 0 < t && t !== l.v) && (l.h = i, 
                l.v = t, l.S.reportPlaybackMetric(v.Constants.Playback.RESOLUTION, i, t, "CONVIVA")));
            }, this.B = function() {
                return /apple/i.test(navigator.vendor);
            }, function(t, i, n, e, o, a) {
                if (!t) throw new Error("videojsProxy: videoElement argument cannot be null.");
                var s = {};
                this.H = !1, this.m = t, this.S = n, this.nt = new e.Impl.Html5Timer(), 
                i ? (this.ut = i.buildLogger(), this.ut.setModuleName("videojsProxy"), 
                s[e.Constants.MODULE_NAME] = "Video JS", (t = {})[e.Constants.FRAMEWORK_NAME] = "Video JS", 
                "undefined" != typeof videojs && (t[e.Constants.FRAMEWORK_VERSION] = videojs.VERSION), 
                this.S.setPlayerInfo(t)) : (this.ut = o, this.K = a, s[e.Constants.MODULE_NAME] = "BC", 
                this.H = !0), s[e.Constants.MODULE_VERSION] = "4.1.12", this.M("videojsProxy._constr()"), 
                this.O = [], this.P(), this.W(), this.ft(), this.Z(), this.T(), 
                this.S.setContentInfo(s), this.B() || this.F(), !l.B() && l.A || (l.U(), 
                "function" == typeof l.m.videoWidth && "function" == typeof l.m.videoHeight && (n = l.m.videoWidth(), 
                i = l.m.videoHeight(), !isNaN(n) && 0 < n && n !== l.h || !isNaN(i) && 0 < i && i !== l.v) && (l.h = n, 
                l.v = i, l.S.reportPlaybackMetric(e.Constants.Playback.RESOLUTION, n, i, "CONVIVA")));
            }.apply(this, arguments), this.cleanup = function() {
                this.M("videojsProxy.cleanup()"), this.rt(), this._(), this.B() || this.G(), 
                this.m = null, l.S = null, l.h = -1, l.v = -1, l.l = v.Constants.PlayerState.UNKNOWN, 
                l.N = 0, l.V = -1, l.C = "", l.g = null, l.A = !1;
            };
        }
        o.ProxyMonitor = {
            ct: null,
            release: function() {
                this.ct && this.ct.cleanup();
            },
            initConvivaDropIn: function(t, i, n, e) {
                if (t) return this.ct = new o.Impl.VideojsProxy(t, i, n, e), this.ct;
                throw new Error("No player proxy initialized");
            }
        }, void 0 !== o && (o.Impl = o.Impl || {}, o.Impl.VideojsProxy = t);
    }(), o;
});
