(() => {
  'use strict';
  const WIDTH = 2172;
  const HEIGHT = 724;
  const MAX_ZOOM = 1.8;
  const ROOT = '../../../art/moonlit_psd_20261005_v2_raw/layer_sources/';
  const layers = [
    { name: '天空', ratio: 0.3, file: 'exec-94477409-2d97-4ffe-94ac-7ed6b13aa590.png' },
    { name: '远山', ratio: 0.8, file: 'exec-933386cf-d4a2-473b-a3d8-e9c943399806.png' },
    { name: '地面树木走廊', ratio: 1, file: 'exec-23db4183-120a-4142-8aea-afcbf4370303.png' },
    { name: '桥栏杆前景', ratio: 1, file: 'exec-c82fb659-2bf7-414a-a322-2e532ea7a749.png' },
  ];
  const stage = document.getElementById('stage');
  const canvas = document.getElementById('scene');
  const ctx = canvas.getContext('2d', { alpha: false });
  const slider = document.getElementById('zoom');
  const readout = document.getElementById('readout');
  const pointers = new Map();
  let zoom = 1;
  let cameraX = 0; // Source-image pixels, relative to panorama center.
  let lastPointerX = null;
  let lastPinchDistance = null;
  let framePending = false;
  let loadError = false;

  function scale() {
    return Math.max(stage.clientWidth / WIDTH, stage.clientHeight / HEIGHT) * zoom;
  }
  function maxCameraX() {
    return Math.max(0, (WIDTH - stage.clientWidth / scale()) / 2);
  }
  function clampCamera() {
    cameraX = Math.max(-maxCameraX(), Math.min(maxCameraX(), cameraX));
  }
  function requestDraw() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(draw);
  }
  function draw() {
    framePending = false;
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#10172b';
    ctx.fillRect(0, 0, w, h);
    clampCamera();
    const s = scale();
    const y = (h - HEIGHT * s) / 2;
    // All layers share one source coordinate system and one zoom. Their x motion differs by ratio.
    for (const layer of layers) {
      if (!layer.image?.complete || !layer.image.naturalWidth) continue;
      const x = (w - WIDTH * s) / 2 - cameraX * s * layer.ratio;
      ctx.drawImage(layer.image, x, y, layer.image.naturalWidth * s, layer.image.naturalHeight * s);
    }
    if (loadError) {
      ctx.fillStyle = '#fff';
      ctx.font = '15px system-ui';
      ctx.fillText('图片加载失败，请通过本地服务器打开此预览。', 16, h / 2);
    }
    readout.textContent = `${zoom.toFixed(2)}×`;
    slider.value = String(zoom);
  }
  function setZoom(value) {
    zoom = Math.max(1, Math.min(MAX_ZOOM, value));
    clampCamera();
    requestDraw();
  }
  function pointerValues() { return [...pointers.values()]; }
  canvas.addEventListener('pointerdown', event => {
    canvas.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1) lastPointerX = event.clientX;
    if (pointers.size === 2) {
      const [a, b] = pointerValues();
      lastPinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
    }
  });
  canvas.addEventListener('pointermove', event => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1) {
      if (lastPointerX !== null) cameraX -= (event.clientX - lastPointerX) / scale();
      lastPointerX = event.clientX;
      clampCamera();
      requestDraw();
    } else if (pointers.size === 2) {
      const [a, b] = pointerValues();
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (lastPinchDistance && distance > 0) setZoom(zoom * distance / lastPinchDistance);
      lastPinchDistance = distance;
    }
  });
  function release(event) {
    pointers.delete(event.pointerId);
    lastPinchDistance = null;
    lastPointerX = pointers.size === 1 ? pointerValues()[0].x : null;
  }
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('wheel', event => {
    event.preventDefault();
    setZoom(zoom * (event.deltaY > 0 ? 0.92 : 1.08));
  }, { passive: false });
  slider.addEventListener('input', () => setZoom(Number(slider.value)));
  document.getElementById('minus').addEventListener('click', () => setZoom(zoom - 0.1));
  document.getElementById('plus').addEventListener('click', () => setZoom(zoom + 0.1));
  document.getElementById('reset').addEventListener('click', () => { cameraX = 0; setZoom(1); });
  new ResizeObserver(requestDraw).observe(stage);
  for (const layer of layers) {
    layer.image = new Image();
    layer.image.onload = requestDraw;
    layer.image.onerror = () => { loadError = true; requestDraw(); };
    layer.image.src = ROOT + layer.file;
  }
  requestDraw();
  // Read-only state for checking the preview with browser automation.
  window.parallaxPreview = { getState: () => ({ zoom, cameraX, maxCameraX: maxCameraX(), ratiosFrontToBack: [1, 1, 0.8, 0.3], loaded: layers.map(x => !!x.image.naturalWidth) }) };
})();
