import { useEffect, useRef } from 'react';
import { useGame } from '@/game/store';
import { fmt } from '@/game/engine';
import { zoneById } from '@/game/monsters';
import { getClassById } from '@/game/classes';
import { PETS } from '@/game/pets';
import type { FxEvent } from '@/game/types';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
  color: string;
  gravity?: number;
  kind?: 'spark' | 'ring' | 'text' | 'slash';
  text?: string;
}

interface TileDecor {
  x: number;
  icon: string;
  size: number;
  phase: number;
}

const imageCache: Record<string, HTMLImageElement> = {};

function getImageAsset(src: string): HTMLImageElement | null {
  if (!src) return null;
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
  const shake = useRef<number>(0);
  const playerLunge = useRef<number>(0);
  const monsterHit = useRef<number>(0);
  const time = useRef<number>(0);
  const lastZone = useRef<string>('');
  const tiles = useRef<TileDecor[]>([]);
  const ambient = useRef<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number; phase: number }[]>([]);
  const lastProcessedFxId = useRef<number>(0);

  useEffect(() => {
    // Preload background assets
    getImageAsset('/backgrounds/abyss.jpg');
    getImageAsset('/backgrounds/dark_forest.jpg');
    getImageAsset('/backgrounds/volcano.jpg');
    getImageAsset('/backgrounds/mine.jpg');
    getImageAsset('/backgrounds/swamp.jpg');
    getImageAsset('/backgrounds/desert.jpg');
    getImageAsset('/backgrounds/vault.jpg');
    getImageAsset('/backgrounds/grotto.jpg');
    getImageAsset('/backgrounds/castle.jpg');
    getImageAsset('/backgrounds/peaks.jpg');
    getImageAsset('/backgrounds/catacombs.jpg');
    getImageAsset('/backgrounds/garden.jpg');
    getImageAsset('/backgrounds/throne.jpg');
    getImageAsset('/backgrounds/astral.jpg');

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
      const px = W * 0.25, py = H * 0.68;
      const mx = W * 0.75, my = H * 0.68;
      const P = particles.current;

      const burst = (x: number, y: number, n: number, color: string, speed: number, size = 3, grav = 300) => {
        for (let i = 0; i < n; i++) {
          const a = Math.random() * Math.PI * 2;
          const v = (0.3 + Math.random() * 0.7) * speed;
          P.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - speed * 0.3, life: 0, maxLife: 0.4 + Math.random() * 0.5, size: size * (0.5 + Math.random()), color, gravity: grav, kind: 'spark' });
        }
      };

      const floatText = (x: number, y: number, text: string, color: string, size: number) => {
        P.push({ x: x + (Math.random() - 0.5) * 30, y, vx: (Math.random() - 0.5) * 20, vy: -70, life: 0, maxLife: 1.1, size, color, gravity: 0, kind: 'text', text });
      };

      switch (fx.type) {
        case 'playerHit':
          burst(mx, my - 30, 14, fx.color ?? '#e2e8f0', 200);
          P.push({ x: mx - 20, y: my - 30, vx: 0, vy: 0, life: 0, maxLife: 0.25, size: 45, color: '#e2e8f0', gravity: 0, kind: 'slash' });
          floatText(mx, my - 95, `-${fmt(typeof fx.value === 'number' ? fx.value : parseFloat(fx.value as any) || 0)}`, fx.color ?? '#fff', 22);
          monsterHit.current = 0.15; playerLunge.current = 0.18;
          break;
        case 'crit':
          burst(mx, my - 30, 35, '#facc15', 320, 4);
          P.push({ x: mx - 30, y: my - 40, vx: 0, vy: 0, life: 0, maxLife: 0.35, size: 65, color: '#facc15', gravity: 0, kind: 'slash' });
          floatText(mx, my - 105, `💥 ${fmt(typeof fx.value === 'number' ? fx.value : parseFloat(fx.value as any) || 0)}`, '#facc15', 34);
          shake.current = Math.max(shake.current, 9);
          monsterHit.current = 0.22; playerLunge.current = 0.22;
          break;
        case 'monsterHit':
          burst(px, py - 30, 14, '#f87171', 200);
          floatText(px, py - 95, `-${fmt(typeof fx.value === 'number' ? fx.value : parseFloat(fx.value as any) || 0)}`, '#f87171', 22);
          shake.current = Math.max(shake.current, 5);
          break;
        case 'dodge':
          floatText(px, py - 85, '💨 Уворот!', '#38bdf8', 18);
          break;
        case 'heal':
          burst(px, py - 30, 18, '#4ade80', 140, 3, -100);
          floatText(px, py - 95, fx.text ?? '+HP', '#4ade80', 22);
          break;
        case 'skill':
          burst(mx, my - 30, 24, fx.color ?? '#c084fc', 250);
          floatText(mx, my - 100, fx.text ?? '', fx.color ?? '#c084fc', 20);
          playerLunge.current = 0.15;
          break;
        case 'loot':
          P.push({ x: mx, y: my - 50, vx: 0, vy: -120, life: 0, maxLife: 1.4, size: 20, color: fx.color ?? '#facc15', gravity: 0, kind: 'text', text: `✨ ${fx.text}` });
          break;
        case 'levelup':
          burst(px, py - 20, 45, '#facc15', 280, 4, -150);
          floatText(px, py - 110, `⬆️ ${fx.text}`, '#facc15', 28);
          shake.current = 7;
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

      // Handle Fx Queue without state update (tracking lastProcessedFxId)
      if (s.fxQueue && s.fxQueue.length > 0) {
        const rect = canvas.getBoundingClientRect();
        s.fxQueue.forEach(fx => {
          if (fx.id > lastProcessedFxId.current) {
            spawnFx(fx, rect.width, rect.height);
            lastProcessedFxId.current = fx.id;
          }
        });
      }

      // Re-init ambient if zone changed
      if (lastZone.current !== s.zoneId) {
        lastZone.current = s.zoneId;
        const rect = canvas.getBoundingClientRect();
        const W = rect.width, H = rect.height;

        ambient.current = Array.from({ length: 32 }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 18,
          vy: -12 - Math.random() * 28,
          size: 1.5 + Math.random() * 3,
          alpha: 0.2 + Math.random() * 0.7,
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
          size: 16 + Math.random() * 14,
          phase: Math.random() * Math.PI * 2,
        }));
      }

      // Update timers
      if (shake.current > 0) shake.current = Math.max(0, shake.current - dt * 25);
      if (playerLunge.current > 0) playerLunge.current = Math.max(0, playerLunge.current - dt);
      if (monsterHit.current > 0) monsterHit.current = Math.max(0, monsterHit.current - dt);

      // Canvas dimensions
      const rect = canvas.getBoundingClientRect();
      const W = rect.width, H = rect.height;

      // Camera Shake
      const sx = (Math.random() - 0.5) * shake.current * 2;
      const sy = (Math.random() - 0.5) * shake.current * 2;

      ctx.save();
      ctx.translate(sx, sy);

      // ===== DRAW BACKGROUND =====
      const theme = zone.theme;
      const bgImg = theme.artSrc ? getImageAsset(theme.artSrc) : null;

      if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.drawImage(bgImg, 0, 0, W, H);
        const bgOverlay = ctx.createLinearGradient(0, 0, 0, H);
        bgOverlay.addColorStop(0, 'rgba(15,23,42,0.3)');
        bgOverlay.addColorStop(0.5, 'rgba(15,23,42,0.1)');
        bgOverlay.addColorStop(1, 'rgba(15,23,42,0.6)');
        ctx.fillStyle = bgOverlay;
        ctx.fillRect(0, 0, W, H);
      } else {
        const grad = ctx.createLinearGradient(0, 0, 0, H * 0.7);
        grad.addColorStop(0, theme.skyTop);
        grad.addColorStop(1, theme.skyBottom);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H * 0.7);

        const gGrad = ctx.createLinearGradient(0, H * 0.65, 0, H);
        gGrad.addColorStop(0, theme.ground);
        gGrad.addColorStop(1, theme.groundDark);
        ctx.fillStyle = gGrad;
        ctx.fillRect(0, H * 0.65, W, H * 0.35);

        ctx.strokeStyle = `${theme.groundDark}aa`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, H * 0.65);
        ctx.bezierCurveTo(W * 0.3, H * 0.63, W * 0.7, H * 0.67, W, H * 0.65);
        ctx.stroke();

        ctx.font = "16px 'Century Gothic', sans-serif";
        tiles.current.forEach(t => {
          const y = H * 0.68 + Math.sin(t.phase + time.current) * 2;
          ctx.fillText(t.icon, t.x, y);
        });
      }

      // Ambient Particles
      ambient.current.forEach(p => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;

        const a = p.alpha * (0.6 + Math.sin(time.current * 3 + p.phase) * 0.4);
        ctx.fillStyle = theme.particles.replace(/[\d\.]+\)$/, `${a.toFixed(2)})`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // ===== DRAW PLAYER =====
      const px = W * 0.25;
      const py = H * 0.68;
      const lunge = playerLunge.current > 0 ? Math.sin((playerLunge.current / 0.18) * Math.PI) * 75 : 0;
      const bob = Math.sin(time.current * 3) * 4;
      const breatheScaleX = 1 + Math.sin(time.current * 2.5) * 0.02;
      const breatheScaleY = 1 - Math.sin(time.current * 2.5) * 0.02;
      const weaponIcon = s.equipment.weapon?.icon ?? '⚔️';
      const heroColor = heroClass?.color ?? '#facc15';

      // Pedestal Ellipse Shadow
      ctx.save();
      ctx.translate(px + lunge, py + 36);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath(); ctx.ellipse(0, 0, 65, 14, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = heroColor;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(0, 0, 60, 12, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      // Shield Aura Ring
      if (s.shield > 0) {
        ctx.save();
        ctx.translate(px + lunge, py + bob);
        ctx.strokeStyle = 'rgba(253,230,138,0.9)';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#fde68a';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(0, -20, 72 + Math.sin(time.current * 4) * 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // ENLARGED HERO SPRITE (160px Size)
      ctx.save();
      ctx.translate(px + lunge, py + bob - 20);
      ctx.scale(breatheScaleX, breatheScaleY);

      // Rotating Class Crest Halo Ring
      ctx.save();
      ctx.rotate(time.current * 0.6);
      ctx.strokeStyle = `${heroColor}aa`;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, 68, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      const heroImg = heroClass?.artSrc ? getImageAsset(heroClass.artSrc) : null;
      const size = 160; // Enlarged Player Sprite Size

      if (heroImg) {
        // Multi-layer glowing aura
        ctx.save();
        ctx.shadowColor = heroColor;
        ctx.shadowBlur = 28;
        ctx.strokeStyle = heroColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, size / 2 + 5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(heroImg, -size / 2, -size / 2, size, size);
        ctx.restore();
      } else {
        ctx.font = "95px 'Century Gothic', CenturyGothic, sans-serif";
        ctx.textAlign = 'center';
        ctx.fillText(heroClass?.icon ?? '🧝', 0, 26);
      }

      // Floating Weapon with Attack Swing Arc
      const wBob = Math.cos(time.current * 4) * 5;
      const wRot = playerLunge.current > 0 ? Math.sin((playerLunge.current / 0.22) * Math.PI) * -0.8 : 0;
      ctx.save();
      ctx.translate(85, -20 + wBob);
      ctx.rotate(wRot);
      ctx.font = "42px 'Century Gothic', CenturyGothic, sans-serif";
      ctx.textAlign = 'center';
      ctx.shadowColor = heroColor;
      ctx.shadowBlur = 14;
      ctx.fillText(weaponIcon, 0, 0);
      ctx.restore();

      ctx.restore();

      // Player Name & Level Badge (Positioned ABOVE the 160px sprite)
      ctx.save();
      ctx.fillStyle = '#fef08a';
      ctx.font = "bold 13px 'Century Gothic', CenturyGothic, sans-serif";
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.95)';
      ctx.shadowBlur = 8;
      ctx.fillText(`${s.characterName || 'Герой'} · Ур. ${s.level}`, px, py - 135);
      ctx.fillStyle = heroColor;
      ctx.font = "bold 11.5px 'Century Gothic', CenturyGothic, sans-serif";
      ctx.fillText(`${heroClass?.icon ?? ''} ${heroClass?.name ?? 'Искатель'}`, px, py - 118);
      ctx.restore();

      // Player HP/Mana Bar
      const barW = 140;
      ctx.fillStyle = 'rgba(15,23,42,0.9)';
      ctx.fillRect(px - barW / 2 - 2, py + 52, barW + 4, 18);
      ctx.strokeStyle = 'rgba(51,65,85,0.9)';
      ctx.strokeRect(px - barW / 2 - 2, py + 52, barW + 4, 18);

      // HP Fill
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(px - barW / 2, py + 54, barW * Math.max(0, s.hp / s.derived.maxHp), 8);
      // Mana Fill
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(px - barW / 2, py + 63, barW * Math.max(0, s.mana / s.derived.maxMana), 5);

      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 8.5px font-mono";
      ctx.textAlign = 'center';
      ctx.fillText(`${fmt(Math.round(s.hp))}/${fmt(s.derived.maxHp)}`, px, py + 61);

      // ===== DRAW ENLARGED ACTIVE PET COMPANION =====
      const activePetId = s.activePetId ?? 'pet_dragon';
      if (activePetId) {
        const petDef = PETS.find(p => p.id === activePetId);
        if (petDef) {
          const petLvl = s.petLvl ?? 1;
          const evoTier = petLvl >= 30 ? 3 : petLvl >= 15 ? 2 : 1;
          const evoBadge = evoTier === 3 ? '👑' : evoTier === 2 ? '🔥' : '🐣';
          const petSize = evoTier === 3 ? 48 : evoTier === 2 ? 40 : 32; // Enlarged Pet Sizes

          // Pet Companion Position with Attack Strike Animation
          const petStrike = playerLunge.current > 0 ? Math.sin((playerLunge.current / 0.22) * Math.PI) * 60 : 0;
          const petX = px - 110 + lunge * 0.7 + petStrike;
          const petY = py + Math.sin(time.current * 4.5) * 10 - 25;

          ctx.save();
          // Pulsing Outer Celestial Aura Ring
          const pRing = petSize + 12 + Math.sin(time.current * 5) * 4;
          const pGrad = ctx.createRadialGradient(petX, petY, 2, petX, petY, pRing);
          pGrad.addColorStop(0, `${petDef.color}bb`);
          pGrad.addColorStop(0.6, `${petDef.color}44`);
          pGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = pGrad;
          ctx.beginPath(); ctx.arc(petX, petY, pRing, 0, Math.PI * 2); ctx.fill();

          ctx.strokeStyle = petDef.color;
          ctx.lineWidth = evoTier === 3 ? 3.5 : 2.5;
          ctx.shadowColor = petDef.color;
          ctx.shadowBlur = 22;
          ctx.beginPath(); ctx.arc(petX, petY, petSize, 0, Math.PI * 2); ctx.stroke();

          // Pet Icon Sprite
          ctx.font = `${petSize + 12}px 'Century Gothic', CenturyGothic, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(petDef.icon, petX, petY + petSize * 0.35);

          // Pet Name, Tier & Level Tag
          const petCustomName = s.petCustomNames?.[activePetId] || petDef.name.split(' ')[0];
          ctx.fillStyle = '#ffffff';
          ctx.font = "bold 11px 'Century Gothic', CenturyGothic, sans-serif";
          ctx.shadowColor = 'rgba(0,0,0,0.95)';
          ctx.shadowBlur = 9;
          ctx.fillText(`${evoBadge} ${petCustomName} (Ур.${fmt(petLvl)})`, petX, petY - petSize - 10);
          ctx.restore();
        }
      }

      // ===== DRAW ENLARGED MONSTER =====
      const mx = W * 0.75;
      const my = H * 0.68;
      const mBob = Math.sin(time.current * 2.5 + 1) * 4;
      const mHitShake = monsterHit.current > 0 ? (Math.random() - 0.5) * 14 : 0;
      const mDef = s.monster.def;
      const isBoss = mDef.isBoss || mDef.isMiniBoss;

      // Monster Pedestal
      ctx.save();
      ctx.translate(mx + mHitShake, my + 38);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath(); ctx.ellipse(0, 0, isBoss ? 100 : 75, 18, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = mDef.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(0, 0, isBoss ? 92 : 68, 15, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      // Monster Character
      ctx.save();
      ctx.translate(mx + mHitShake, my + mBob);

      if (monsterHit.current > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.filter = 'brightness(2.8)';
      }

      // Check image artwork (Enlarged Monster Sprite Sizes: Normal = 185px, Boss = 240px)
      const mImg = mDef.artSrc ? getImageAsset(mDef.artSrc) : null;
      const mSize = isBoss ? 240 : 185;

      if (mImg) {
        ctx.save();
        ctx.shadowColor = mDef.color;
        ctx.shadowBlur = isBoss ? 32 : 20;
        ctx.strokeStyle = mDef.color;
        ctx.lineWidth = isBoss ? 4.5 : 3;
        ctx.beginPath();
        ctx.arc(0, -mSize / 4, mSize / 2 + 4, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, -mSize / 4, mSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(mImg, -mSize / 2, -mSize * 0.75, mSize, mSize);
        ctx.restore();
      } else {
        ctx.font = `${isBoss ? 130 : 100}px 'Century Gothic', CenturyGothic, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(mDef.icon, 0, 0);
      }

      ctx.restore();

      // Monster Name & Level Badge (Positioned ABOVE the 185px/240px monster sprite)
      ctx.save();
      ctx.fillStyle = mDef.color;
      ctx.font = `bold ${isBoss ? 15 : 13}px 'Century Gothic', CenturyGothic, sans-serif`;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.95)';
      ctx.shadowBlur = 8;
      ctx.fillText(`${mDef.name} (Ур.${s.monster.level})`, mx, my - (isBoss ? 200 : 150));
      ctx.restore();

      // Monster HP Bar
      const mBarW = isBoss ? 180 : 140;
      ctx.fillStyle = 'rgba(15,23,42,0.9)';
      ctx.fillRect(mx - mBarW / 2 - 2, my + 52, mBarW + 4, 16);
      ctx.strokeStyle = 'rgba(51,65,85,0.9)';
      ctx.strokeRect(mx - mBarW / 2 - 2, my + 52, mBarW + 4, 16);

      ctx.fillStyle = isBoss ? '#ef4444' : '#f97316';
      ctx.fillRect(mx - mBarW / 2, my + 54, mBarW * Math.max(0, s.monster.hp / s.monster.maxHp), 12);

      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 9px font-mono";
      ctx.textAlign = 'center';
      ctx.fillText(`${fmt(Math.round(s.monster.hp))}/${fmt(s.monster.maxHp)}`, mx, my + 63);

      // ===== DRAW PARTICLES =====
      const P = particles.current;
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i];
        p.life += dt;
        if (p.life >= p.maxLife) { P.splice(i, 1); continue; }

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.gravity) p.vy += p.gravity * dt;

        const progress = p.life / p.maxLife;
        const alpha = Math.max(0, 1 - progress);

        ctx.save();
        ctx.globalAlpha = alpha;

        if (p.kind === 'spark') {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(1, p.size * (1 - progress * 0.5)), 0, Math.PI * 2); ctx.fill();
        } else if (p.kind === 'slash') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 4 * (1 - progress);
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + 40, p.y + 40);
          ctx.stroke();
        } else if (p.kind === 'text' && p.text) {
          ctx.font = `bold ${p.size}px 'Century Gothic', CenturyGothic, sans-serif`;
          ctx.fillStyle = p.color;
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(0,0,0,0.95)';
          ctx.shadowBlur = 8;
          ctx.fillText(p.text, p.x, p.y);
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

  return (
    <div className="relative w-full h-[380px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group font-sans">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
