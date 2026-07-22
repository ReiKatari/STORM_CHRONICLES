import { useEffect, useRef } from 'react';
import { useGame } from '@/game/store';
import { zoneById, FAMILIES } from '@/game/monsters';
import type { FxEvent } from '@/game/types';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number;
  color: string; gravity: number; kind: 'spark' | 'ember' | 'snow' | 'text' | 'emoji' | 'ring' | 'bolt' | 'slash';
  text?: string; angle?: number;
}

interface AmbientP { x: number; y: number; vy: number; vx: number; size: number; alpha: number; phase: number }
interface Tile { x: number; icon: string; size: number; phase: number }

const monsterImageCache: Record<string, HTMLImageElement> = {};
function getMonsterImage(src: string): HTMLImageElement | null {
  if (!monsterImageCache[src]) {
    const img = new Image();
    img.src = src;
    monsterImageCache[src] = img;
  }
  return monsterImageCache[src].complete && monsterImageCache[src].naturalWidth > 0 ? monsterImageCache[src] : null;
}

export default function CombatCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const ambient = useRef<AmbientP[]>([]);
  const tiles = useRef<Tile[]>([]);
  const shake = useRef(0);
  const playerLunge = useRef(0);
  const monsterHit = useRef(0);
  const monsterDeath = useRef(0);
  const lastZone = useRef('');
  const time = useRef(0);

  useEffect(() => {
    // Preload monster art assets
    getMonsterImage('/monsters/dragon.jpg');
    getMonsterImage('/monsters/demon.jpg');
    getMonsterImage('/monsters/golem.jpg');
    getMonsterImage('/monsters/vampire.jpg');
    getMonsterImage('/monsters/lich.jpg');
    getMonsterImage('/monsters/spider.jpg');
    getMonsterImage('/monsters/abyss.jpg');

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const spawnFx = (fx: FxEvent, W: number, H: number) => {
      const px = W * 0.25, py = H * 0.70;
      const mx = W * 0.75, my = H * 0.70;
      const P = particles.current;

      const burst = (x: number, y: number, n: number, color: string, speed: number, size = 3, grav = 300) => {
        for (let i = 0; i < n; i++) {
          const a = Math.random() * Math.PI * 2;
          const v = speed * (0.3 + Math.random() * 0.7);
          P.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - speed * 0.3, life: 0, maxLife: 0.4 + Math.random() * 0.5, size: size * (0.5 + Math.random()), color, gravity: grav, kind: 'spark' });
        }
      };

      const floatText = (x: number, y: number, text: string, color: string, size: number) => {
        P.push({ x: x + (Math.random() - 0.5) * 30, y, vx: (Math.random() - 0.5) * 20, vy: -70, life: 0, maxLife: 1.1, size, color, gravity: 0, kind: 'text', text });
      };

      switch (fx.type) {
        case 'playerHit':
          burst(mx, my - 30, 12, fx.color ?? '#e2e8f0', 180);
          P.push({ x: mx - 20, y: my - 30, vx: 0, vy: 0, life: 0, maxLife: 0.25, size: 40, color: '#e2e8f0', gravity: 0, kind: 'slash' });
          floatText(mx, my - 80, `-${fx.value}`, fx.color ?? '#fff', 20);
          monsterHit.current = 0.15; playerLunge.current = 0.18;
          break;
        case 'crit':
          burst(mx, my - 30, 30, '#facc15', 300, 4);
          P.push({ x: mx - 30, y: my - 40, vx: 0, vy: 0, life: 0, maxLife: 0.35, size: 60, color: '#facc15', gravity: 0, kind: 'slash' });
          floatText(mx, my - 90, `💥 ${fx.value}`, '#facc15', 32);
          shake.current = Math.max(shake.current, 8);
          monsterHit.current = 0.22; playerLunge.current = 0.22;
          break;
        case 'monsterHit':
          burst(px, py - 30, 12, '#f87171', 190);
          floatText(px, py - 80, `-${fx.value}`, '#f87171', 20);
          shake.current = Math.max(shake.current, 4);
          break;
        case 'dodge':
          floatText(px, py - 80, '💨 Уворот!', '#4ade80', 18);
          break;
        case 'heal':
          for (let i = 0; i < 16; i++) P.push({ x: px + (Math.random() - 0.5) * 60, y: py - Math.random() * 40, vx: 0, vy: -50 - Math.random() * 40, life: 0, maxLife: 0.9, size: 14, color: '#4ade80', gravity: 0, kind: 'emoji', text: fx.skillFx === 'shield' ? '🛡️' : '✚' });
          if (fx.value) floatText(px, py - 90, `+${fx.value}`, '#4ade80', 22);
          if (fx.skillFx === 'shield') P.push({ x: px, y: py - 30, vx: 0, vy: 0, life: 0, maxLife: 0.8, size: 10, color: '#fde68a', gravity: 0, kind: 'ring' });
          break;
        case 'skill': {
          const c = fx.color ?? '#fff';
          floatText(mx, my - 90, `-${fx.value}`, c, 24);
          shake.current = Math.max(shake.current, 7);
          monsterHit.current = 0.25;
          const kind = fx.skillFx;
          if (kind === 'fire' || kind === 'meteor') {
            if (kind === 'meteor') {
              for (let i = 0; i < 30; i++) P.push({ x: mx + 120 + Math.random() * 60, y: -20, vx: -260 - Math.random() * 120, vy: 320 + Math.random() * 120, life: 0, maxLife: 0.6, size: 5, color: '#fb923c', gravity: 0, kind: 'ember' });
            }
            burst(mx, my - 30, 32, '#f97316', 250, 5, 150);
            burst(mx, my - 30, 16, '#facc15', 190, 4, 100);
          } else if (kind === 'ice') {
            for (let i = 0; i < 26; i++) { const a = Math.random() * Math.PI * 2; P.push({ x: mx, y: my - 30, vx: Math.cos(a) * 220, vy: Math.sin(a) * 220, life: 0, maxLife: 0.5, size: 4, color: '#7dd3fc', gravity: 0, kind: 'snow' }); }
          } else if (kind === 'lightning') {
            for (let i = 0; i < 4; i++) P.push({ x: mx, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0.28, size: my - 30, color: '#facc15', gravity: 0, kind: 'bolt' });
            burst(mx, my - 30, 18, '#fde047', 240, 4, 80);
          } else if (kind === 'poison') {
            for (let i = 0; i < 20; i++) P.push({ x: mx + (Math.random() - 0.5) * 60, y: my - Math.random() * 50, vx: 0, vy: -45, life: 0, maxLife: 1, size: 6, color: '#84cc16', gravity: -30, kind: 'ember' });
          } else if (kind === 'blood') {
            burst(px, py - 30, 12, '#dc2626', 170, 4, 200);
            burst(mx, my - 30, 34, '#dc2626', 320, 6, 250);
          } else if (kind === 'summon') {
            for (let i = 0; i < 3; i++) P.push({ x: px - 80, y: py - 10 - i * 14, vx: 320 + i * 60, vy: 0, life: 0, maxLife: 0.8, size: 28, color: '#94a3b8', gravity: 0, kind: 'emoji', text: '🐺' });
            burst(mx, my - 30, 24, c, 230, 4, 150);
          } else {
            burst(mx, my - 30, 20, c, 250, 4, 120);
            P.push({ x: mx, y: my - 30, vx: 0, vy: 0, life: 0, maxLife: 0.3, size: 50, color: c, gravity: 0, kind: 'ring' });
          }
          break;
        }
        case 'death': {
          if (fx.value === -1) {
            burst(px, py - 30, 35, '#f87171', 280, 5, 250);
            shake.current = 10;
          } else {
            const n = fx.value === 2 ? 70 : fx.value === 1 ? 40 : 24;
            burst(mx, my - 30, n, '#facc15', fx.value === 2 ? 400 : 280, 5, 200);
            burst(mx, my - 30, Math.floor(n / 2), '#fff', 220, 3, 150);
            if (fx.value === 2) shake.current = 12;
            monsterDeath.current = 0.5;
          }
          break;
        }
        case 'levelup':
          for (let i = 0; i < 45; i++) P.push({ x: px + (Math.random() - 0.5) * 100, y: py, vx: (Math.random() - 0.5) * 80, vy: -200 - Math.random() * 260, life: 0, maxLife: 1.4, size: 4, color: '#facc15', gravity: 160, kind: 'spark' });
          floatText(px, py - 110, `⬆️ ${fx.text}`, '#facc15', 28);
          break;
        case 'loot':
          P.push({ x: mx, y: my - 40, vx: 0, vy: -90, life: 0, maxLife: 1.3, size: 24, color: fx.color ?? '#fff', gravity: 0, kind: 'emoji', text: fx.text ?? '🎁' });
          break;
        case 'bossSpawn':
          floatText(W / 2, H * 0.3, `💀 ${fx.text}`, '#f87171', 30);
          shake.current = 10;
          break;
        case 'quest':
          floatText(W / 2, H * 0.25, fx.text ?? '📜', fx.color ?? '#fbbf24', 22);
          break;
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time.current += dt;

      const s = useGame.getState();
      const zone = zoneById(s.zoneId);
      const rect = canvas.getBoundingClientRect();
      const W = rect.width, H = rect.height;
      if (W < 10) return;

      // rebuild tiles when zone changes
      if (lastZone.current !== zone.id) {
        lastZone.current = zone.id;
        tiles.current = [];
        for (let i = 0; i < 24; i++) {
          tiles.current.push({ x: Math.random() * W, icon: zone.theme.tiles[i % zone.theme.tiles.length], size: 14 + Math.random() * 20, phase: Math.random() * Math.PI * 2 });
        }
        ambient.current = [];
        for (let i = 0; i < 36; i++) {
          ambient.current.push({ x: Math.random() * W, y: Math.random() * H, vy: -10 - Math.random() * 16, vx: (Math.random() - 0.5) * 8, size: 1.2 + Math.random() * 2.5, alpha: 0.3 + Math.random() * 0.5, phase: Math.random() * Math.PI * 2 });
        }
      }

      // drain fx queue
      if (s.fxQueue.length > 0) {
        s.fxQueue.forEach(fx => spawnFx(fx, W, H));
        s.clearFx();
      }

      // ---- render ----
      ctx.save();
      if (shake.current > 0.1) {
        ctx.translate((Math.random() - 0.5) * shake.current, (Math.random() - 0.5) * shake.current);
        shake.current *= 0.88;
      }

      // sky background gradient
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, zone.theme.skyTop);
      sky.addColorStop(1, zone.theme.skyBottom);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // ambient particles
      ambient.current.forEach(p => {
        p.y += p.vy * dt; p.x += p.vx * dt + Math.sin(time.current + p.phase) * 0.3;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(time.current * 2 + p.phase));
        ctx.fillStyle = zone.theme.particles;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // ground line
      const gy = H * 0.74;
      const gg = ctx.createLinearGradient(0, gy, 0, H);
      gg.addColorStop(0, zone.theme.ground);
      gg.addColorStop(1, zone.theme.groundDark);
      ctx.fillStyle = gg;
      ctx.fillRect(0, gy, W, H - gy);

      // fog overlay
      ctx.fillStyle = zone.theme.fog;
      ctx.fillRect(0, gy - 25, W, 28);

      // floor tiles
      tiles.current.forEach(t => {
        const bob = Math.sin(time.current * 1.5 + t.phase) * 2;
        ctx.font = `${t.size}px 'Century Gothic', CenturyGothic, sans-serif`;
        ctx.globalAlpha = 0.8;
        ctx.fillText(t.icon, t.x, gy + 12 + bob + (t.phase % 1) * (H - gy - 20));
      });
      ctx.globalAlpha = 1;

      const m = s.monster;
      const px = W * 0.25, py = H * 0.68;
      const mx = W * 0.75, my = H * 0.68;

      // timers
      playerLunge.current = Math.max(0, playerLunge.current - dt);
      monsterHit.current = Math.max(0, monsterHit.current - dt);
      monsterDeath.current = Math.max(0, monsterDeath.current - dt);

      // ===== PLAYER PEDESTAL & VISUALS =====
      const bob = Math.sin(time.current * 3) * 3;
      const lunge = playerLunge.current > 0 ? Math.sin((playerLunge.current / 0.22) * Math.PI) * 28 : 0;
      const weaponItem = s.equipment['weapon'];
      const weaponIcon = weaponItem?.icon ?? '⚔️';

      // Runic Hero Pedestal
      ctx.save();
      ctx.translate(px + lunge, py + 26);
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.beginPath(); ctx.ellipse(0, 0, 42, 12, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(56,189,248,0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(0, 0, 38 + Math.sin(time.current * 2) * 2, 10, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      // Hero Character
      ctx.save();
      ctx.translate(px + lunge, py + bob);
      ctx.textAlign = 'center';

      // Shield Aura Ring
      if (s.shield > 0) {
        ctx.strokeStyle = 'rgba(253,230,138,0.9)';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#fde68a';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(0, -12, 46 + Math.sin(time.current * 4) * 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Character Sprite
      ctx.font = "58px 'Century Gothic', CenturyGothic, sans-serif";
      ctx.fillText('🧝', 0, 0);

      // Weapon Floating Beside Hero
      const wBob = Math.cos(time.current * 4) * 3;
      ctx.font = "24px 'Century Gothic', CenturyGothic, sans-serif";
      ctx.fillText(weaponIcon, 32, -18 + wBob);

      ctx.restore();

      // Player Name & Level Badge
      ctx.fillStyle = '#fef08a';
      ctx.font = "bold 11px 'Century Gothic', CenturyGothic, sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText(`Герой · Ур. ${s.level}`, px, py - 60);

      // Player HP/Mana Bar
      const barW = 110;
      ctx.fillStyle = 'rgba(15,23,42,0.85)';
      ctx.fillRect(px - barW / 2 - 2, py + 38, barW + 4, 16);
      ctx.strokeStyle = 'rgba(51,65,85,0.8)';
      ctx.strokeRect(px - barW / 2 - 2, py + 38, barW + 4, 16);

      // HP Bar Fill
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(px - barW / 2, py + 40, barW * Math.max(0, s.hp / s.derived.maxHp), 7);
      // Mana Bar Fill
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(px - barW / 2, py + 48, barW * Math.max(0, s.mana / s.derived.maxMana), 4);

      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 9px 'Century Gothic', CenturyGothic, sans-serif";
      ctx.fillText(`${Math.ceil(s.hp)} / ${s.derived.maxHp}`, px, py + 46);

      // ===== MONSTER PEDESTAL & VISUALS =====
      const isBoss = !!m.def.isBoss;
      const isMini = !!m.def.isMiniBoss;
      const isBig = isBoss || isMini;
      const mSize = isBoss ? 86 : isMini ? 72 : 54;
      const mBob = Math.sin(time.current * 2.4 + 1) * (isBig ? 5 : 3);
      const hitOffset = monsterHit.current > 0 ? (Math.random() - 0.5) * 10 : 0;
      const deathScale = monsterDeath.current > 0 ? monsterDeath.current / 0.5 : 1;

      // Select generated artwork or family art mapping
      const famDef = FAMILIES.find(f => f.id === m.def.family);
      let mImgSrc = famDef?.artSrc ?? null;
      if (!mImgSrc) {
        if (isBoss) mImgSrc = Math.floor(m.level / 5) % 2 === 0 ? '/monsters/dragon.jpg' : '/monsters/demon.jpg';
        else if (isMini || m.def.family === 'golem' || m.level > 20) mImgSrc = '/monsters/golem.jpg';
      }

      const mImg = mImgSrc ? getMonsterImage(mImgSrc) : null;

      // Monster Pedestal
      ctx.save();
      ctx.translate(mx + hitOffset, my + (isBig ? 32 : 24));
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.beginPath(); ctx.ellipse(0, 0, isBig ? 48 : 34, 12, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = isBoss ? 'rgba(239,68,68,0.8)' : isMini ? 'rgba(192,132,252,0.8)' : 'rgba(74,222,128,0.6)';
      ctx.lineWidth = isBoss ? 3 : 2;
      ctx.beginPath(); ctx.ellipse(0, 0, (isBig ? 44 : 30) + Math.sin(time.current * 3) * 3, 10, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      // Monster Sprite / Artwork Token
      ctx.save();
      ctx.translate(mx + hitOffset, my + mBob);
      ctx.scale(deathScale, deathScale);

      if (monsterHit.current > 0) {
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 24;
      } else if (isBoss) {
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 30 + Math.sin(time.current * 4) * 10;
      } else if (isMini) {
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 20;
      }

      if (mImg) {
        // Draw artwork monster inside glowing circular token
        const radius = mSize / 2 + 10;
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, -mSize / 2, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(mImg, -radius, -mSize / 2 - radius, radius * 2, radius * 2);
        ctx.restore();

        // Token Outer Border Glow
        ctx.strokeStyle = isBoss ? '#ef4444' : isMini ? '#c084fc' : '#38bdf8';
        ctx.lineWidth = isBoss ? 4 : 3;
        ctx.beginPath();
        ctx.arc(0, -mSize / 2, radius, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Fallback Emoji Monster Sprite
        ctx.textAlign = 'center';
        ctx.font = `${mSize}px 'Century Gothic', CenturyGothic, sans-serif`;
        ctx.fillText(m.def.icon, 0, 0);
      }

      // Boss / MiniBoss Crown/Star Badge Above Head
      ctx.textAlign = 'center';
      if (isBoss) {
        ctx.font = "26px 'Century Gothic', CenturyGothic, sans-serif";
        ctx.fillText('👑', 0, -mSize * 0.95);
      } else if (isMini) {
        ctx.font = "22px 'Century Gothic', CenturyGothic, sans-serif";
        ctx.fillText('⭐', 0, -mSize * 0.9);
      }

      ctx.restore();

      // Monster HP Bar & Info
      const mBarW = isBig ? 160 : 110;
      const barTop = my - mSize - (isBig ? 34 : 22);

      ctx.fillStyle = 'rgba(15,23,42,0.85)';
      ctx.fillRect(mx - mBarW / 2 - 2, barTop, mBarW + 4, 14);
      ctx.strokeStyle = isBoss ? 'rgba(239,68,68,0.8)' : 'rgba(51,65,85,0.8)';
      ctx.strokeRect(mx - mBarW / 2 - 2, barTop, mBarW + 4, 14);

      const hpp = Math.max(0, m.hp / m.maxHp);
      const hpg = ctx.createLinearGradient(mx - mBarW / 2, 0, mx + mBarW / 2, 0);
      hpg.addColorStop(0, isBoss ? '#dc2626' : '#ef4444');
      hpg.addColorStop(1, isBoss ? '#f97316' : '#fb923c');
      ctx.fillStyle = hpg;
      ctx.fillRect(mx - mBarW / 2, barTop + 2, mBarW * hpp, 10);

      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 9px 'Century Gothic', CenturyGothic, sans-serif";
      ctx.fillText(`${Math.ceil(Math.max(0, m.hp))} / ${m.maxHp}`, mx, barTop + 10);

      // Monster Title Tag
      ctx.fillStyle = isBoss ? '#fca5a5' : isMini ? '#e9d5ff' : '#e2e8f0';
      ctx.font = `bold ${isBig ? 12 : 10}px 'Century Gothic', CenturyGothic, sans-serif`;
      ctx.fillText(`${m.def.name} (Ур.${m.level})`, mx, barTop - 6);

      // ===== PARTICLES & SPELL FX =====
      const P = particles.current;
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i];
        p.life += dt;
        if (p.life >= p.maxLife) { P.splice(i, 1); continue; }
        const t = p.life / p.maxLife;
        p.vy += p.gravity * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        ctx.globalAlpha = 1 - t;

        if (p.kind === 'text') {
          ctx.font = `bold ${p.size}px 'Century Gothic', CenturyGothic, sans-serif`;
          ctx.strokeStyle = 'rgba(0,0,0,0.8)';
          ctx.lineWidth = 4;
          ctx.strokeText(p.text!, p.x, p.y);
          ctx.fillStyle = p.color;
          ctx.fillText(p.text!, p.x, p.y);
        } else if (p.kind === 'slash') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 4 * (1 - t);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * t, -Math.PI / 4, Math.PI / 4);
          ctx.stroke();
        } else if (p.kind === 'emoji') {
          ctx.font = `${p.size}px 'Century Gothic', CenturyGothic, sans-serif`;
          ctx.fillText(p.text!, p.x, p.y);
        } else if (p.kind === 'ring') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 5 * (1 - t);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + t * 60, 0, Math.PI * 2);
          ctx.stroke();
        } else if (p.kind === 'bolt') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 4 * (1 - t) + 1;
          ctx.shadowColor = p.color; ctx.shadowBlur = 12;
          ctx.beginPath();
          let bx = p.x, by = 0;
          ctx.moveTo(bx, by);
          while (by < p.size) {
            by += 14 + Math.random() * 12;
            bx = p.x + (Math.random() - 0.5) * 36;
            ctx.lineTo(bx, by);
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.kind === 'ember' ? 8 : 4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - t * 0.6), 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}
