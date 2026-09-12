/* Hash Pigs — a pig is drawn from the 32 bytes of the hash that dug it up. Same hash, same pig, anywhere. */
(function(){
  var BG = ['#2a1d14','#1d2a14','#14202a','#2a1428','#262626','#2a2414','#142a24','#301a10'];
  var SKIN = [['#f3a6b8','#d97b92'],['#f7bfc9','#e094a4'],['#e88aa0','#c25f78'],['#3a3a3a','#222'],['#d9a066','#a86f3c'],['#f0c8a0','#c99a6e'],['#b48ac8','#8a5fa0'],['#8fd18a','#5fa05a']];
  var EYE = ['#111','#2e6bd6','#1f9d55','#d61f1f'];
  var HAT = ['none','farmer','crown','chef','viking','propeller','cowboy','beanie','halo','party'];
  var GLASS = ['none','round','shades','goggles','3d','monocle'];
  var MOUTH = ['none','apple','corn','cigar','gold','straw'];
  var ITEM = ['none','shovel','truffle','sack','gpu','bucket'];
  function px(ctx, x, y, w, h, c){ ctx.fillStyle = c; ctx.fillRect(x, y, w || 1, h || 1); }
  function traits(hex){
    var b = []; for(var i = 0; i < 32; i++) b.push(parseInt(hex.substr(i * 2, 2), 16));
    return { bg: b[0] % BG.length, skin: b[1] % SKIN.length, eye: b[3] % EYE.length,
      hat: b[4] % 100 < 22 ? 0 : 1 + (b[5] % (HAT.length - 1)), glass: b[6] % 100 < 42 ? 0 : 1 + (b[7] % (GLASS.length - 1)),
      mouth: b[8] % 100 < 32 ? 0 : 1 + (b[9] % (MOUTH.length - 1)), item: b[10] % 100 < 45 ? 0 : 1 + (b[11] % (ITEM.length - 1)),
      mud: b[12] % 100 < 35, spots: b[13] % 100 < 25, bytes: b };
  }
  function draw(cv, hex, size){
    var S = 24, t = traits(hex), ctx = cv.getContext('2d'); cv.width = S; cv.height = S; ctx.imageSmoothingEnabled = false;
    var sk = SKIN[t.skin][0], sk2 = SKIN[t.skin][1];
    px(ctx, 0, 0, S, S, BG[t.bg]);
    for(var y = 1; y < S; y += 3) for(var x = (y + t.bytes[14]) % 4; x < S; x += 4) if(t.bytes[(x * 3 + y) % 32] % 4 === 0) px(ctx, x, y, 1, 1, 'rgba(255,255,255,.05)');
    /* body */
    px(ctx, 5, 17, 14, 7, sk); px(ctx, 4, 19, 16, 5, sk); px(ctx, 8, 18, 8, 6, sk2);
    /* ears */
    px(ctx, 5, 3, 4, 4, sk); px(ctx, 15, 3, 4, 4, sk); px(ctx, 6, 4, 2, 2, sk2); px(ctx, 16, 4, 2, 2, sk2);
    /* head */
    px(ctx, 5, 6, 14, 11, sk); px(ctx, 4, 8, 16, 7, sk);
    if(t.spots){ px(ctx, 6, 9, 2, 2, sk2); px(ctx, 16, 12, 2, 2, sk2); px(ctx, 8, 14, 1, 1, sk2); }
    /* eyes */
    px(ctx, 8, 8, 2, 2, '#fff'); px(ctx, 14, 8, 2, 2, '#fff'); px(ctx, 9, 8, 1, 2, EYE[t.eye]); px(ctx, 15, 8, 1, 2, EYE[t.eye]);
    /* snout */
    px(ctx, 9, 11, 6, 4, sk2); px(ctx, 10, 12, 1, 2, '#6b2d3e'); px(ctx, 13, 12, 1, 2, '#6b2d3e');
    /* mouth */
    px(ctx, 10, 16, 4, 1, '#6b2d3e');
    if(t.mud){ px(ctx, 5, 15, 3, 1, '#5a3a1a'); px(ctx, 16, 14, 3, 1, '#5a3a1a'); px(ctx, 6, 20, 5, 1, '#5a3a1a'); px(ctx, 14, 21, 4, 1, '#5a3a1a'); }
    var m = MOUTH[t.mouth];
    if(m === 'apple'){ px(ctx, 11, 15, 3, 3, '#d61f1f'); px(ctx, 12, 14, 1, 1, '#1f9d55'); }
    if(m === 'corn'){ px(ctx, 12, 16, 7, 2, '#f5d90a'); px(ctx, 12, 16, 7, 1, '#e0c000'); px(ctx, 18, 15, 2, 1, '#1f9d55'); }
    if(m === 'cigar'){ px(ctx, 13, 16, 6, 1, '#6b3a1a'); px(ctx, 19, 16, 1, 1, '#ff6a00'); }
    if(m === 'gold'){ px(ctx, 11, 16, 1, 1, '#f2c94c'); }
    if(m === 'straw'){ px(ctx, 13, 16, 1, 1, '#e8c070'); px(ctx, 14, 15, 1, 1, '#e8c070'); px(ctx, 15, 14, 1, 1, '#e8c070'); px(ctx, 16, 13, 2, 1, '#e8c070'); }
    var g = GLASS[t.glass];
    if(g === 'round'){ px(ctx, 7, 7, 4, 4, '#000'); px(ctx, 13, 7, 4, 4, '#000'); px(ctx, 8, 8, 2, 2, '#9ad'); px(ctx, 14, 8, 2, 2, '#9ad'); px(ctx, 11, 9, 2, 1, '#000'); }
    if(g === 'shades'){ px(ctx, 7, 8, 10, 2, '#111'); px(ctx, 7, 7, 10, 1, '#333'); }
    if(g === 'goggles'){ px(ctx, 6, 7, 5, 4, '#8a6a2c'); px(ctx, 13, 7, 5, 4, '#8a6a2c'); px(ctx, 7, 8, 3, 2, '#aef5f1'); px(ctx, 14, 8, 3, 2, '#aef5f1'); px(ctx, 11, 8, 2, 1, '#8a6a2c'); }
    if(g === '3d'){ px(ctx, 7, 7, 4, 3, '#e0263a'); px(ctx, 13, 7, 4, 3, '#2e9fd6'); px(ctx, 7, 7, 10, 1, '#fff'); }
    if(g === 'monocle'){ px(ctx, 13, 7, 4, 4, '#f2c94c'); px(ctx, 14, 8, 2, 2, '#dff'); px(ctx, 16, 11, 1, 3, '#f2c94c'); }
    var h = HAT[t.hat];
    if(h === 'farmer'){ px(ctx, 7, 2, 10, 3, '#c9a04a'); px(ctx, 4, 5, 16, 1, '#c9a04a'); px(ctx, 7, 4, 10, 1, '#8a6a24'); }
    if(h === 'crown'){ px(ctx, 7, 1, 10, 3, '#f2c94c'); px(ctx, 7, 0, 2, 1, '#f2c94c'); px(ctx, 11, 0, 2, 1, '#f2c94c'); px(ctx, 15, 0, 2, 1, '#f2c94c'); px(ctx, 12, 2, 1, 1, '#d61f1f'); }
    if(h === 'chef'){ px(ctx, 7, 0, 10, 5, '#fff'); px(ctx, 6, 1, 12, 2, '#fff'); px(ctx, 7, 5, 10, 1, '#ccc'); }
    if(h === 'viking'){ px(ctx, 6, 2, 12, 4, '#8a8a8a'); px(ctx, 4, 0, 2, 4, '#e8dcc0'); px(ctx, 18, 0, 2, 4, '#e8dcc0'); px(ctx, 6, 5, 12, 1, '#555'); }
    if(h === 'propeller'){ px(ctx, 7, 3, 10, 3, '#2e6bd6'); px(ctx, 12, 3, 1, 3, '#d61f1f'); px(ctx, 11, 1, 1, 2, '#888'); px(ctx, 8, 0, 8, 1, '#d61f1f'); }
    if(h === 'cowboy'){ px(ctx, 7, 1, 10, 4, '#6b3a1a'); px(ctx, 3, 5, 18, 1, '#6b3a1a'); px(ctx, 7, 4, 10, 1, '#3a1d0a'); }
    if(h === 'beanie'){ px(ctx, 6, 2, 12, 4, '#1f9d55'); px(ctx, 6, 5, 12, 1, '#146b3a'); px(ctx, 11, 1, 2, 1, '#fff'); }
    if(h === 'halo'){ px(ctx, 8, 0, 8, 1, '#fff29a'); px(ctx, 7, 1, 1, 1, '#fff29a'); px(ctx, 16, 1, 1, 1, '#fff29a'); }
    if(h === 'party'){ px(ctx, 11, 0, 2, 1, '#f5d90a'); px(ctx, 10, 1, 4, 2, '#ff5c9a'); px(ctx, 9, 3, 6, 2, '#2e9fd6'); px(ctx, 8, 5, 8, 1, '#ff5c9a'); }
    var it = ITEM[t.item];
    if(it === 'shovel'){ px(ctx, 21, 12, 1, 9, '#8a5a2b'); px(ctx, 20, 20, 3, 3, '#aaa'); px(ctx, 20, 11, 3, 1, '#8a5a2b'); }
    if(it === 'truffle'){ px(ctx, 19, 18, 4, 4, '#3a2a1a'); px(ctx, 20, 19, 1, 1, '#6b4a2a'); px(ctx, 22, 20, 1, 1, '#6b4a2a'); }
    if(it === 'sack'){ px(ctx, 18, 17, 5, 6, '#c9a04a'); px(ctx, 19, 16, 3, 1, '#8a6a24'); px(ctx, 20, 19, 1, 2, '#8a6a24'); }
    if(it === 'gpu'){ px(ctx, 17, 17, 6, 4, '#2a2a2a'); px(ctx, 18, 18, 2, 2, '#ff5c9a'); px(ctx, 21, 18, 1, 2, '#ff5c9a'); }
    if(it === 'bucket'){ px(ctx, 18, 18, 5, 5, '#6b6b6b'); px(ctx, 18, 17, 5, 1, '#999'); px(ctx, 19, 18, 3, 1, '#5a3a1a'); }
    if(size){ cv.style.width = size + 'px'; cv.style.height = size + 'px'; }
    return t;
  }
  function label(t){ var p = []; if(t.hat) p.push(HAT[t.hat]); if(t.glass) p.push(GLASS[t.glass]); if(t.mouth) p.push(MOUTH[t.mouth]); if(t.item) p.push(ITEM[t.item]); if(t.mud) p.push('muddy'); if(t.spots) p.push('spotted'); return p.join(' · ') || 'clean'; }
  window.Pig = { draw: draw, traits: traits, label: label };
})();
