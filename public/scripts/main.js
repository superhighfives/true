(function () {
  !(function () {
    var a;
    return (
      (a = angular.module("true", [])),
      a.controller("MainCtrl", [
        "$scope",
        "$http",
        function (a, b) {
          var c;
          return (
            (c =
              window.requestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.msRequestAnimationFrame),
            (window.requestAnimationFrame = c),
            (document.ontouchmove = function (b) {
              return a.unsupported() ? void 0 : b.preventDefault();
            }),
            (a.replay = function () {
              return location.reload();
            }),
            (a.unsupported = function () {
              return !(
                Modernizr.cssanimations &&
                Modernizr.csstransitions &&
                Modernizr.video &&
                Modernizr.opacity &&
                window.requestAnimationFrame
              );
            }),
            (a.webaudio = function () {
              return Modernizr.webaudio;
            }),
            (a.data = []),
            (a.data_endpoint = "data/data.json"),
            (a.dataLoading = !0),
            b.get(a.data_endpoint).success(function (b) {
              return (a.data = b.data);
            }),
            a.$watch("data", function () {
              return a.data.length ? (a.dataLoaded = !0) : void 0;
            }),
            a.$on("animationComplete", function (b, c) {
              return c ? ((a.animationComplete = !0), a.$apply()) : void 0;
            }),
            a.$watch("dataLoaded", function () {
              return a.dataLoaded
                ? ((a.ready = !0), (a.status = "Play"))
                : void 0;
            }),
            (a.start = function () {
              return (a.playing = !0), a.$broadcast("play");
            })
          );
        },
      ])
    );
  })();
}.call(this),
  function () {
    !(function (a) {
      "use strict";
      return a.controller("LyricController", function () {
        return function (a) {
          return (a.lyricClass = function () {
            return { visible: a.lyric.visible };
          });
        };
      });
    })(angular.module("true"));
  }.call(this),
  function () {
    !(function (a) {
      "use strict";
      return a.directive("lyric", function () {
        return function (a, b) {
          return (
            a.$watch("lyric.id", function (b) {
              return (a.id = b);
            }),
            a.$watch("lyric.visible", function (c) {
              return c && 0 === a.id
                ? setTimeout(function () {
                    return b.hide();
                  }, 2e3)
                : void 0;
            })
          );
        };
      });
    })(angular.module("true"));
  }.call(this),
  function () {
    !(function (a) {
      "use strict";
      return a.directive("trueVideo", function () {
        return function (a, b) {
          var c, d, e, f;
          return (
            (e = b[0]),
            (f = 720),
            (c = 404),
            (a.$parent.videoReference = b),
            b.css("margin-top", "-" + c / 2 + "px"),
            b.css("margin-left", "-" + f / 2 + "px"),
            (d = function () {
              var a, d, e, g;
              return (
                (e = f / c),
                (g = window.innerWidth / window.innerHeight),
                g > e
                  ? (b.css("width", "" + window.innerWidth + "px"),
                    b.css("margin-left", "-" + window.innerWidth / 2 + "px"),
                    (a = window.innerWidth / e),
                    b.css("height", "" + a + "px"),
                    b.css("margin-top", "-" + a / 2 + "px"))
                  : ((d = window.innerHeight * e),
                    b.css("width", "" + d + "px"),
                    b.css("margin-left", "-" + d / 2 + "px"),
                    b.css("height", "" + window.innerHeight + "px"),
                    b.css("margin-top", "-" + window.innerHeight / 2 + "px"))
              );
            }),
            d(),
            angular.element(window).bind("resize", d),
            angular.element(window).bind("orientationchange", d),
            b.bind("loadedmetadata", function () {
              return (e.currentTime = 0), (a.duration = Math.round(e.duration));
            }),
            b.bind("timeupdate", function () {
              var b;
              return a.playing &&
                ((a.currentTime = Math.round(e.currentTime)),
                (b = Math.round((a.currentTime / a.duration) * 100)),
                b !== a.progress)
                ? ((a.progress = b), a.$apply())
                : void 0;
            }),
            e.load(),
            a.$on("play", function () {
              var b, c;
              return (
                (a.playing = !0),
                e.play(),
                (b = 0),
                (c = function () {
                  var d, f;
                  return (
                    (d = e.currentTime),
                    null != a.data
                      ? ((d = e.currentTime),
                        (f = a.data[b]),
                        d > f.time &&
                          ((a.currentLyric = f),
                          (a.currentLyric.visible = !0),
                          a.$apply(),
                          b++),
                        a.data.length > b
                          ? window.requestAnimationFrame(c)
                          : setTimeout(function () {
                              return (a.ended = !0), a.$apply();
                            }, 3e4))
                      : void 0
                  );
                }),
                window.requestAnimationFrame(c)
              );
            })
          );
        };
      });
    })(angular.module("true"));
  }.call(this),
  function () {
    !(function (a) {
      "use strict";
      var b;
      return (
        (b = void 0),
        a.directive("trueVisualisation", function () {
          return function (a, c) {
            var d, e, f, g, h, i, j, k, l, m, n, o, p;
            return Modernizr.webaudio
              ? ((a.supported = !0),
                (window.AudioContext =
                  window.AudioContext || window.webkitAudioContext),
                (p = a.$parent.videoReference),
                (i = new AudioContext()),
                (e = o = d = b = f = h = g = void 0),
                (j = c[0].getContext("2d")),
                (m = function () {
                  return (
                    (h = window.innerWidth),
                    (g = window.innerHeight),
                    (j.canvas.width = h),
                    (j.canvas.height = g)
                  );
                }),
                m(),
                a.$on("play", function () {
                  i.resume();
                }),
                angular.element(window).bind("resize", m),
                (n = function () {
                  (b = i.createScriptProcessor(2048, 1, 1)),
                    b.connect(i.destination),
                    (d = i.createAnalyser()),
                    (d.smoothingTimeConstant = 0.5),
                    (d.fftSize = 512),
                    (o = i.createMediaElementSource(p[0])),
                    o.connect(d),
                    d.connect(b),
                    o.connect(i.destination);
                }),
                n(),
                (b.onaudioprocess = function () {
                  var a;
                  (a = new Uint8Array(d.frequencyBinCount)),
                    d.getByteFrequencyData(a),
                    j.clearRect(0, 0, h, g),
                    (f = l(a)),
                    k(a);
                }),
                (l = function (a) {
                  var b, c, d;
                  for (d = 0, f = void 0, c = a.length, b = 0; c > b; )
                    (d += a[b]), b++;
                  return (f = d / c);
                }),
                (k = function (a) {
                  var b, c, d, e, i, k, l;
                  for (
                    b = 0, j.stroke(), j.beginPath(), k = (g / 5) * 1.725;
                    b < a.length;

                  )
                    (l = a[b] * (g / 500)),
                      (e = b * Math.round(h / 160)),
                      (i = k + l / 2),
                      (d = Math.round(h / 1024) + f / 48),
                      (c = -l),
                      (j.fillStyle = "rgba(255, 255, 255, " + f / 250 + ")"),
                      j.fillRect(e, i, d * (f / 75), c),
                      (j.lineWidth = 1),
                      (j.strokeStyle = "rgba(255, 255, 255, 0.5)"),
                      j.lineTo(e, k + l / 2),
                      j.moveTo(e + 1, k - l / 2),
                      b++;
                }))
              : void 0;
          };
        })
      );
    })(angular.module("true"));
  }.call(this),
  function () {
    !(function (a) {
      "use strict";
      var b, c, d;
      return (
        (b = !1),
        (d = 0),
        (c = []),
        a.directive("svgDrawIn", function () {
          return function (a, e) {
            var f, g, h, i;
            return (
              (i = e.find("svg")),
              (h = Snap(i[0])),
              h.selectAll("g").forEach(function (a) {
                return (
                  a.selectAll("path").forEach(function (a) {
                    var b;
                    return (
                      (b = a.getTotalLength()),
                      (a.data = {
                        length: b,
                        current_frame: 0,
                        total_frames: 80,
                      }),
                      a.attr({
                        opacity: 0,
                        strokeDasharray: b + " " + b,
                        strokeDashoffset: b,
                      })
                    );
                  }),
                  setTimeout(function () {
                    return c.push(a);
                  }, (1e3 * d) / 4),
                  d++
                );
              }),
              (f = function () {
                return (
                  c.forEach(function (a) {
                    return a.selectAll("path").forEach(function (b) {
                      var d;
                      return (
                        (b.data.group = a),
                        (d = b.data.current_frame / b.data.total_frames),
                        d >= 1 &&
                          ((b.data.complete = !0),
                          (c = c.filter(function (a) {
                            return a !== b.data.group;
                          }))),
                        b.data.complete
                          ? void 0
                          : (b.data.current_frame++,
                            b.attr({
                              strokeDashoffset: Math.floor(
                                (b.data.total_frames - b.data.current_frame) / d
                              ),
                              opacity: d,
                            }))
                      );
                    });
                  }),
                  c.length ||
                    ((a.animating = !1), a.$emit("animationComplete", !0)),
                  a.animating ? (b = window.requestAnimationFrame(f)) : void 0
                );
              }),
              (g = function () {
                return setTimeout(function () {
                  return (a.animating = !0), f();
                }, 0);
              })()
            );
          };
        })
      );
    })(angular.module("true"));
  }.call(this));
