import { useEffect, useRef } from 'react';
import { useGame } from '@/game/store';
import { zoneById, FAMILIES } from '@/game/monsters';
import { getClassById } from '@/game/classes';
import type { FxEvent } from '@/game/types';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number;
  color: string; gravity: number; kind: 'spark' | 'ember' | 'snow' | 'text' | 'emoji' | 'ring' | 'bolt' | 'slash';
  text?: string; angle?: number;
}

interface AmbientP { x: number; y: number; vy: number; vx: number; size: number; alpha: number; phase: number }
interface Tile { x: number; icon: string; size: number; phase: number }

const imageCache: Record<string, HTMLImageElement> = {};
function getImageAsset(src: string): HTMLImageElement | null {
  if (!imageCache[src]) {
    const img = new Image();
    img.src = src;
    imageCache[src] = img;
  }
  return imageCache[src].complete && imageCache[src].naturalWidth > 0 ? imageCache[src] : null;
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
    getImageAsset('/monsters/dragon.jpg');
    getImageAsset('/monsters/demon.jpg');
    getImageAsset('/monsters/golem.jpg');
    getImageAsset('/monsters/vampire.jpg');
    getImageAsset('/monsters/lich.jpg');
    getImageAsset('/monsters/spider.jpg');
    getImageAsset('/monsters/abyss.jpg');

    // Preload hero class art assets
    getImageAsset('/heroes/hero_paladin.jpg');
    getImageAsset('/heroes/hero_necromancer.jpg');
    getImageAsset('/heroes/hero_archmage.jpg');
    getImageAsset('/heroes/hero_berserker.jpg');
    getImageAsset('/heroes/hero_assassin.jpg');
    getImageAsset('/heroes/hero_ranger.jpg');
    getImageAsset('/heroes/hero_druid.jpg');
    getImageAsset('/heroes/hero_engineer.jpg');
    getImageAsset('/heroes/hero_monk.jpg');
    getImageAsset('/heroes/hero_deathknight.jpg');

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(300, rect.width || canvas.parentElement?.clientWidth || 700);
      const h = Math.max(200, rect.height || canvas.parentElement?.clientHeight || 350);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
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
          floatText(px, py - 70, '💨 Уворот!', '#38bdf8', 16);
          break;
        case 'heal':
          burst(px, py - 30, 15, '#4ade80', 120, 3, -100);
          floatText(px, py - 80, fx.text ?? '+HP', '#4ade80', 20);
          break;
        case 'skill':
          burst(mx, my - 30, 20, fx.color ?? '#c084fc', 220);
          floatText(mx, my - 85, fx.text ?? '', fx.color ?? '#c084fc', 18);
          playerLunge.current = 0.15;
          break;
        case 'loot':
          P.push({ x: mx, y: my - 40, vx: 0, vy: -120, life: 0, maxLife: 1.4, size: 18, color: fx.color ?? '#facc15', gravity: 0, kind: 'text', text: `✨ ${fx.text}` });
          break;
        case 'levelup':
          burst(px, py - 20, 40, '#facc15', 250, 4, -150);
          floatText(px, py - 100, `⬆️ ${fx.text}`, '#facc15', 26);
          shake.current = 6;
          break;
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      time.current += dt;

      const s = useGame.getState();
      const zone = zoneById(s.zoneId);
      const heroClass = s.classId ? getClassById(s.classId) : null;

      // Handle Fx Queue
      if (s.fxQueue.length > 0) {
        const rect = canvas.getBoundingClientRect();
        s.fxQueue.forEach(fx => spawnFx(fx, rect.width, rect.height));
        useGame.setState({ fxQueue: [] });
      }

      // Re-init ambient if zone changed
      if (lastZone.current !== s.zoneId) {
        lastZone.current = s.zoneId;
        const rect = canvas.getBoundingClientRect();
        const W = rect.width, H = rect.height;

        ambient.current = Array.from({ length: 28 }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 15,
          vy: -10 - Math.random() * 25,
          size: 1.5 + Math.random() * 2.5,
          alpha: 0.2 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
        }));

        const bgDecor: Record<string, string[]> = {
          slimes: ['🌿', '🌱', '🪨', '🍃'],
          rats: ['🕸️', '🪨', '🦴', '⛓️'],
          goblins: ['🪵', '⛺', '🔥', '🪨'],
          skeletons: ['💀', '🪦', '🦴', '🕯️'],
          zombies: ['🪦', '🪵', '🕯️', '🦇'],
          wolves: ['🌲', '🌳', '🪨', '🍃'],
          spiders: ['🕸️', '🕷️', '🥚', '🪨'],
          ghosts: ['🕯️', '🪦', '🔮', '⛓️'],
          demons: ['🔥', '🌋', '💀', '⛓️'],
          vampires: ['🦇', '🕯️', '⚰️', '🩸'],
          dragons: ['🌋', '🔥', '💎', '💀'],
          abyss: ['🌌', '🔮', '🌀', '👁️'],
        };
        const icons = bgDecor[s.zoneId] ?? ['🪨', '🌿'];
        tiles.current = Array.from({ length: 14 }, (_, i) => ({
          x: (i / 13) * W + (Math.random() - 0.5) * 30,
          icon: icons[Math.floor(Math.random() * icons.length)],
          size: 14 + Math.random() * 12,
          phase: Math.random() * Math.PI * 2,
        }));
      }

      // Update timers
      if (shake.current > 0) shake.current = Math.max(0, shake.current - dt * 25);
      if (playerLunge.current > 0) playerLunge.current = Math.max(0, playerLunge.current - dt);
      if (monsterHit.current > 0) monsterHit.current = Math.max(0, monsterHit.current - dt);

      const W = Math.max(300, canvas.clientWidth || canvas.parentElement?.clientWidth || 700);
      const H = Math.max(200, canvas.clientHeight || canvas.parentElement?.clientHeight || 350);

      // Clean screen with background
      ctx.clearRect(0, 0, W, H);
      ctx.save();

      if (shake.current > 0) {
        ctx.translate((Math.random() - 0.5) * shake.current, (Math.random() - 0.5) * shake.current);
      }

      // ===== DRAW BACKGROUND =====
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, zone.bgTop);
      grad.addColorStop(0.65, zone.bgBot);
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Distant horizon glow
      const horizonG = ctx.createRadialGradient(W / 2, H * 0.6, 10, W / 2, H * 0.6, W * 0.6);
      horizonG.addColorStop(0, `${zone.accentColor}33`);
      horizonG.addColorStop(1, 'transparent');
      ctx.fillStyle = horizonG;
      ctx.fillRect(0, 0, W, H);

      // Floor ground
      const groundY = H * 0.68;
      const groundG = ctx.createLinearGradient(0, groundY, 0, H);
      groundG.addColorStop(0, 'rgba(15, 23, 42, 0.9)');
      groundG.addColorStop(1, 'rgba(2, 6, 23, 0.98)');
      ctx.fillStyle = groundG;
      ctx.fillRect(0, groundY, W, H - groundY);

      // Ground border line
      ctx.strokeStyle = `${zone.accentColor}55`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(W, groundY);
      ctx.stroke();

      // Background tiles/props
      tiles.current.forEach(t => {
        const floatY = Math.sin(time.current * 1.5 + t.phase) * 2;
        ctx.font = `${t.size}px sans-serif`;
        ctx.globalAlpha = 0.45;
        ctx.fillText(t.icon, t.x, groundY + floatY);
      });
      ctx.globalAlpha = 1.0;

      // Ambient particles (embers/snow/dust)
      ambient.current.forEach(p => {
        p.x += (p.vx + Math.sin(time.current + p.phase) * 10) * dt;
        p.y += p.vy * dt;
        if (p.y < 0) { p.y = H; p.x = Math.random() * W; }
        ctx.fillStyle = zone.particleColor;
        ctx.globalAlpha = p.alpha * (0.6 + Math.sin(time.current * 2 + p.phase) * 0.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // ===== DRAW HERO PLAYER =====
      const px = W * 0.25;
      const py = H * 0.68;
      const bob = Math.sin(time.current * 3) * 3;
      const lunge = playerLunge.current > 0 ? Math.sin((playerLunge.current / 0.22) * Math.PI) * 28 : 0;
      const weaponItem = s.equipment['weapon'];
      const weaponIcon = weaponItem?.icon ?? '⚔️';

      // Hero Pedestal Ring
      const heroColor = heroClass?.color ?? '#facc15';
      ctx.save();
      ctx.translate(px + lunge, py + 24);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath(); ctx.ellipse(0, 0, 44, 12, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = heroColor;
      ctx.lineWidth = 2;
      ctx.shadowColor = heroColor;
      ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.ellipse(0, 0, 40 + Math.sin(time.current * 2) * 2, 10, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      // Shield Aura Ring
      if (s.shield > 0) {
        ctx.save();
        ctx.translate(px + lunge, py + bob);
        ctx.strokeStyle = 'rgba(253,230,138,0.9)';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#fde68a';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(0, -20, 50 + Math.sin(time.current * 4) * 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Hero Character Portrait Avatar Sprite
      ctx.save();
      ctx.translate(px + lunge, py + bob - 20);

      const heroImg = heroClass?.artSrc ? getImageAsset(heroClass.artSrc) : null;
      const size = 68;

      if (heroImg) {
        // Outer glowing aura
        ctx.save();
        ctx.shadowColor = heroColor;
        ctx.shadowBlur = 16;
        ctx.strokeStyle = heroColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, size / 2 + 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Clip circular portrait
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(heroImg, -size / 2, -size / 2, size, size);
        ctx.restore();
      } else {
        // Emoji fallback
        ctx.font = "58px 'Century Gothic', CenturyGothic, sans-serif";
        ctx.textAlign = 'center';
        ctx.fillText(heroClass?.icon ?? '🧝', 0, 15);
      }

      // Floating Weapon
      const wBob = Math.cos(time.current * 4) * 3;
      ctx.font = "24px 'Century Gothic', CenturyGothic, sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText(weaponIcon, 40, -10 + wBob);

      ctx.restore();

      // Player Name & Level Badge
      ctx.save();
      ctx.fillStyle = '#fef08a';
      ctx.font = "bold 11px 'Century Gothic', CenturyGothic, sans-serif";
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(`${s.characterName || 'Герой'} · Ур. ${s.level}`, px, py - 68);
      ctx.fillStyle = heroColor;
      ctx.font = "bold 9px 'Century Gothic', CenturyGothic, sans-serif";
      ctx.fillText(heroClass?.name ?? 'Искатель', px, py - 56);
      ctx.restore();

      // Player HP/Mana Bar
      const barW = 110;
      ctx.fillStyle = 'rgba(15,23,42,0.85)';
      ctx.fillRect(px - barW / 2 - 2, py + 38, barW + 4, 16);
      ctx.strokeStyle = 'rgba(51,65,85,0.8)';
      ctx.strokeRect(px - barW / 2 - 2, py + 38, barW + 4, 16);

      // HP Fill
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(px - barW / 2, py + 40, barW * Math.max(0, s.hp / s.derived.maxHp), 7);
      // Mana Fill
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(px - barW / 2, py + 48, barW * Math.max(0, s.mana / s.derived.maxMana), 4);

      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 8px font-mono";
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(s.hp)}/${s.derived.maxHp}`, px, py + 46);

      // ===== DRAW MONSTER =====
      const mx = W * 0.75;
      const my = H * 0.68;
      const mBob = Math.sin(time.current * 2.5 + 1) * 3;
      const mHitShake = monsterHit.current > 0 ? (Math.random() - 0.5) * 12 : 0;
      const mDef = s.monster.def;
      const isBoss = mDef.isBoss || mDef.isMiniBoss;

      // Monster Pedestal
      ctx.save();
      ctx.translate(mx + mHitShake, my + 24);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath(); ctx.ellipse(0, 0, isBoss ? 60 : 42, 12, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = mDef.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(0, 0, isBoss ? 56 : 38, 10, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      // Monster Character
      ctx.save();
      ctx.translate(mx + mHitShake, my + mBob);

      if (monsterHit.current > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.filter = 'brightness(2.5)';
      }

      // Check image artwork
      const mImg = mDef.artSrc ? getImageAsset(mDef.artSrc) : null;
      if (mImg) {
        const mSize = isBoss ? 105 : 80;
        ctx.save();
        ctx.shadowColor = mDef.color;
        ctx.shadowBlur = isBoss ? 24 : 12;
        ctx.strokeStyle = mDef.color;
        ctx.lineWidth = isBoss ? 3 : 2;
        ctx.beginPath();
        ctx.arc(0, -mSize / 4, mSize / 2 + 2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, -mSize / 4, mSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(mImg, -mSize / 2, -mSize * 0.75, mSize, mSize);
        ctx.restore();
      } else {
        ctx.font = `${isBoss ? 75 : 55}px 'Century Gothic', CenturyGothic, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(mDef.icon, 0, 0);
      }

      ctx.restore();

      // Monster Name & Level Badge
      ctx.save();
      ctx.fillStyle = mDef.color;
      ctx.font = `bold ${isBoss ? 13 : 11}px 'Century Gothic', CenturyGothic, sans-serif`;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(`${mDef.name} (Ур.${s.monster.level})`, mx, my - (isBoss ? 75 : 60));
      ctx.restore();

      // Monster HP Bar
      const mBarW = isBoss ? 150 : 110;
      ctx.fillStyle = 'rgba(15,23,42,0.85)';
      ctx.fillRect(mx - mBarW / 2 - 2, my + 38, mBarW + 4, 12);
      ctx.strokeStyle = 'rgba(51,65,85,0.8)';
      ctx.strokeRect(mx - mBarW / 2 - 2, my + 38, mBarW + 4, 12);

      const mHpPct = Math.max(0, s.monster.hp / s.monster.maxHp);
      ctx.fillStyle = isBoss ? '#ef4444' : '#f97316';
      ctx.fillRect(mx - mBarW / 2, my + 40, mBarW * mHpPct, 8);

      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 8px font-mono";
      ctx.textAlign = 'center';
      ctx.fillText(`${s.monster.hp}/${s.monster.maxHp}`, mx, my + 47);

      // ===== DRAW PARTICLES =====
      const P = particles.current;
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i];
        p.life += dt;
        if (p.life >= p.maxLife) { P.splice(i, 1); continue; }

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += p.gravity * dt;

        const progress = p.life / p.maxLife;
        const alpha = 1 - progress;

        ctx.save();
        ctx.globalAlpha = alpha;

        if (p.kind === 'spark') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
          ctx.fill();
        } else if (p.kind === 'text' && p.text) {
          ctx.fillStyle = p.color;
          ctx.font = `bold ${p.size}px 'Century Gothic', CenturyGothic, sans-serif`;
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(0,0,0,0.9)';
          ctx.shadowBlur = 6;
          ctx.fillText(p.text, p.x, p.y);
        } else if (p.kind === 'slash') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 4 * (1 - progress);
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.size, p.y + p.size);
          ctx.stroke();
        }
        ctx.restore();
      }

      ctx.restore();
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />;
}
