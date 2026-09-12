/* Web Worker: proof of monkey. sha256(seed:nonce) must be below the target. */
var running = false, seed = '', nonce = 0, target = null, batch = 400;
function hex(buf){ var a = new Uint8Array(buf), s = ''; for(var i = 0; i < a.length; i++) s += (a[i] < 16 ? '0' : '') + a[i].toString(16); return s; }
function below(h, t){ return h <= t; }
async function loop(){
  var enc = new TextEncoder(), t0 = performance.now(), n = 0;
  while(running){
    for(var i = 0; i < batch; i++){
      var h = hex(await crypto.subtle.digest('SHA-256', enc.encode(seed + ':' + nonce)));
      n++;
      if(below(h, target)){ postMessage({ type: 'found', hash: h, nonce: nonce, seed: seed }); nonce++; break; }
      nonce++;
    }
    var dt = (performance.now() - t0) / 1000;
    if(dt > .5){ postMessage({ type: 'rate', rate: n / dt, nonce: nonce }); t0 = performance.now(); n = 0; }
    await new Promise(function(r){ setTimeout(r, 0); });
  }
}
onmessage = function(e){ var m = e.data;
  if(m.type === 'start'){ seed = m.seed; nonce = m.nonce || 0; target = m.target; if(!running){ running = true; loop(); } }
  if(m.type === 'target'){ target = m.target; }
  if(m.type === 'stop'){ running = false; }
};
