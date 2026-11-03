(function (root) {
  var C = {};
  C.ceIIW = function (m) { return m.C + m.Mn / 6 + (m.Cr + m.Mo + m.V) / 5 + (m.Ni + m.Cu) / 15; };
  C.cet = function (m) { return m.C + (m.Mn + m.Mo) / 10 + (m.Cr + m.Cu) / 20 + m.Ni / 40; };
  C.pcm = function (m) { return m.C + m.Si / 30 + (m.Mn + m.Cu + m.Cr) / 20 + m.Ni / 60 + m.Mo / 15 + m.V / 10 + 5 * m.B; };
  C.heatInput = function (k, U, I, vMmPerS) { return k * U * I / (vMmPerS * 1000); };
  C.preheat = function (cet, d, hd, q) {
    return 697 * cet + 160 * Math.tanh(d / 35) + 62 * Math.pow(hd, 0.35) + (53 * cet - 32) * q - 328;
  };
  C.t85_3D = function (q, t0, f3) { return (6700 - 5 * t0) * q * (1 / (500 - t0) - 1 / (800 - t0)) * f3; };
  C.t85_2D = function (q, t0, d, f2) {
    return (4300 - 4.3 * t0) * 1e5 * q * q / (d * d) * (1 / Math.pow(500 - t0, 2) - 1 / Math.pow(800 - t0, 2)) * f2;
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = C; else root.Calc = C;
})(this);
