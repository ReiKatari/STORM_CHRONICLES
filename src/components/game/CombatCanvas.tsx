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
  const manualAttack = useGame(s => s.manualAttack);
  const manualBlock = useGame(s => s.manualBlock);
  const manualFlee = useGame(s => s.manualFlee);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const shake = useRef<number>(0);
  const playerLunge = useRef<number>(0);
  const monsterHit = useRef<number>(0);
  const time = useRef<number>(0);
  const lastZone = useRef<string>('');
  const tiles = useRef<TileDecor[]>([]);
  const ambient = useRef<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number; phase: number }[]>([]);
  const processedFxIds = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Preload background assets
    getImageAsset('/backgrounds/hills.jpg');
    getImageAsset('/backgrounds/sea.jpg');
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

    // Preload monster & pet art assets
    getImageAsset('/monsters/wisp.jpg');
    getImageAsset('/monsters/storm_elemental.jpg');
    getImageAsset('/monsters/harpy.jpg');
    getImageAsset('/pets/pet_dragon.jpg');
    getImageAsset('/pets/pet_wolf.jpg');
    getImageAsset('/pets/pet_golem.jpg');
    getImageAsset('/pets/pet_spirit.jpg');
    getImageAsset('/pets/pet_mech.jpg');

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

      // Correct FX assignments:
      // monsterHit / crit / skill -> player attacks monster (particles & text at monster pos mx, my)
      // playerHit -> monster attacks player (particles & text at player pos px, py)
      switch (fx.type) {
        case 'monsterHit':
          burst(mx, my - 40, 16, '#f87171', 220);
          P.push({ x: mx - 20, y: my - 40, vx: 0, vy: 0, life: 0, maxLife: 0.25, size: 45, color: '#f87171', gravity: 0, kind: 'slash' });
          floatText(mx, my - 95, `-${fmt(typeof fx.value === 'number' ? fx.value : parseFloat(fx.value as any) || 0)}`, '#f87171', 22);
          monsterHit.current = 0.20; playerLunge.current = 0.22;
          break;
        case 'crit':
          burst(mx, my - 40, 38, '#facc15', 340, 4);
          P.push({ x: mx - 30, y: my - 50, vx: 0, vy: 0, life: 0, maxLife: 0.35, size: 70, color: '#facc15', gravity: 0, kind: 'slash' });
          floatText(mx, my - 105, `💥 ${fmt(typeof fx.value === 'number' ? fx.value : parseFloat(fx.value as any) || 0)}`, '#facc15', 34);
          shake.current = Math.max(shake.current, 10);
          monsterHit.current = 0.25; playerLunge.current = 0.25;
          break;
        case 'skill': {
          const sId = fx.skillId || '';
          const col = fx.color || '#c084fc';
          floatText(mx, my - 110, fx.text ?? '✨ СКИЛЛ', col, 26);
          monsterHit.current = 0.26;
          playerLunge.current = 0.24;

          // 1. HOLY / LIGHT SKILLS (Paladin / Priest / Judgement)
          if (sId.includes('holy') || sId.includes('sun') || sId.includes('divine') || sId.includes('judgement') || sId.includes('pal_') || col === '#facc15' || col === '#fde047') {
            for (let i = 0; i < 18; i++) {
              P.push({ x: mx + (Math.random() - 0.5) * 45, y: Math.random() * my, vx: (Math.random() - 0.5) * 10, vy: 280 + Math.random() * 220, life: 0, maxLife: 0.45, size: 3 + Math.random() * 5, color: '#fde047', gravity: 0, kind: 'spark' });
            }
            burst(mx, my - 30, 45, '#facc15', 320, 4, -60);
            P.push({ x: mx - 30, y: my - 60, vx: 0, vy: 0, life: 0, maxLife: 0.4, size: 90, color: '#fde047', gravity: 0, kind: 'slash' });
            shake.current = Math.max(shake.current, 8);
          }
          // 2. FIRE / METEOR SKILLS (Mage / Elementalist)
          else if (sId.includes('fire') || sId.includes('meteor') || sId.includes('flame') || col === '#ef4444' || col === '#fb923c') {
            burst(mx, my - 40, 55, '#ef4444', 400, 5, 60);
            burst(mx, my - 40, 35, '#f97316', 340, 4, -90);
            P.push({ x: mx - 40, y: my - 60, vx: 0, vy: 0, life: 0, maxLife: 0.38, size: 95, color: '#fb923c', gravity: 0, kind: 'slash' });
            shake.current = Math.max(shake.current, 12);
          }
          // 3. ICE / FROST SKILLS (Frost Nova / Ice Touch)
          else if (sId.includes('frost') || sId.includes('ice') || col === '#38bdf8' || col === '#a5f3fc') {
            burst(mx, my - 40, 50, '#38bdf8', 280, 3, -130);
            burst(mx, my - 40, 30, '#a5f3fc', 360, 4, 30);
            P.push({ x: mx - 30, y: my - 50, vx: 0, vy: 0, life: 0, maxLife: 0.45, size: 80, color: '#a5f3fc', gravity: 0, kind: 'slash' });
            shake.current = Math.max(shake.current, 7);
          }
          // 4. SHADOW / POISON / ASSASSIN SKILLS
          else if (sId.includes('shadow') || sId.includes('poison') || sId.includes('ass') || col === '#a855f7' || col === '#22c55e') {
            burst(mx, my - 40, 45, col, 300, 3, 30);
            P.push({ x: mx - 25, y: my - 55, vx: 0, vy: 0, life: 0, maxLife: 0.32, size: 85, color: col, gravity: 0, kind: 'slash' });
            P.push({ x: mx + 15, y: my - 35, vx: 0, vy: 0, life: 0, maxLife: 0.32, size: 85, color: col, gravity: 0, kind: 'slash' });
            shake.current = Math.max(shake.current, 9);
          }
          // 5. BERSERKER / WHIRLWIND / EXECUTE SKILLS
          else if (sId.includes('ber') || sId.includes('cleave') || sId.includes('whirl') || sId.includes('execute')) {
            burst(mx, my - 40, 50, '#dc2626', 380, 4, 40);
            P.push({ x: mx - 35, y: my - 65, vx: 0, vy: 0, life: 0, maxLife: 0.35, size: 100, color: '#dc2626', gravity: 0, kind: 'slash' });
            P.push({ x: mx + 35, y: my - 25, vx: 0, vy: 0, life: 0, maxLife: 0.35, size: 100, color: '#ef4444', gravity: 0, kind: 'slash' });
            shake.current = Math.max(shake.current, 15);
          }
          // 6. DEFAULT UNIQUE SKILL BURST
          else {
            burst(mx, my - 40, 40, col, 320, 4);
            P.push({ x: mx - 25, y: my - 50, vx: 0, vy: 0, life: 0, maxLife: 0.35, size: 80, color: col, gravity: 0, kind: 'slash' });
            shake.current = Math.max(shake.current, 8);
          }
          break;
        }
        case 'petHit':
          burst(mx - 30, my - 40, 22, fx.color ?? '#38bdf8', 240, 3);
          floatText(mx - 20, my - 90, fx.text ?? '🐾 ПИТОМЕЦ', fx.color ?? '#38bdf8', 22);
          monsterHit.current = 0.18;
          break;
        case 'playerHit':
          burst(px, py - 30, 14, '#ef4444', 200);
          floatText(px, py - 95, `-${fmt(typeof fx.value === 'number' ? fx.value : parseFloat(fx.value as any) || 0)}`, '#ef4444', 22);
          shake.current = Math.max(shake.current, 6);
          break;
        case 'dodge':
          floatText(px, py - 85, '💨 Уворот!', '#38bdf8', 18);
          break;
        case 'heal':
          burst(px, py - 30, 25, '#4ade80', 160, 3, -110);
          floatText(px, py - 95, fx.text ?? '+HP', '#4ade80', 24);
          break;
        case 'loot':
          P.push({ x: mx, y: my - 50, vx: 0, vy: -120, life: 0, maxLife: 1.4, size: 20, color: fx.color ?? '#facc15', gravity: 0, kind: 'text', text: `✨ ${fx.text}` });
          break;
        case 'levelup':
          burst(px, py - 20, 60, '#facc15', 340, 5, -160);
          burst(px, py - 20, 35, '#4ade80', 260, 4, -120);
          floatText(px, py - 115, `✨ ${fx.text}`, '#facc15', 30);
          shake.current = 10;
          break;
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      time.current += dt;

      playerLunge.current = Math.max(0, playerLunge.current - dt);
      monsterHit.current = Math.max(0, monsterHit.current - dt);
      shake.current = Math.max(0, shake.current - dt * 25);

      const s = useGame.getState();
      const zone = zoneById(s.zoneId);
      const heroClass = s.classId ? getClassById(s.classId) : null;

      // Handle Fx Queue (using Set tracking to guarantee no skipped animation events)
      if (s.fxQueue && s.fxQueue.length > 0) {
        const rect = canvas.getBoundingClientRect();
        s.fxQueue.forEach(fx => {
          if (!processedFxIds.current.has(fx.id)) {
            processedFxIds.current.add(fx.id);
            spawnFx(fx, rect.width, rect.height);
          }
        });
        if (processedFxIds.current.size > 200) {
          processedFxIds.current.clear();
        }
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
      const attackPhase = (s.playerAtk ?? 0) % 1.0;
      const atkLunge = Math.sin(attackPhase * Math.PI) * 65;
      const lunge = (playerLunge.current > 0 ? Math.sin((playerLunge.current / 0.18) * Math.PI) * 75 : 0) + atkLunge;
      const bob = Math.sin(time.current * 3) * 4;
      const breatheScaleX = 1 + Math.sin(time.current * 2.5) * 0.02;
      const breatheScaleY = 1 - Math.sin(time.current * 2.5) * 0.02;
      const weaponIcon = s.equipment.weapon?.icon ?? '⚔️';
      const heroColor = heroClass?.color ?? '#facc15';

      // Pedestal Ellipse Shadow
      ctx.save();
      ctx.translate(px + lunge, py + 36);
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.beginPath(); ctx.ellipse(0, 0, 65, 14, 0, 0, Math.PI * 2); ctx.fill();
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

      const heroImg = heroClass?.artSrc ? getImageAsset(heroClass.artSrc) : null;
      const size = 160;

      if (heroImg) {
        ctx.save();
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

      // Player Name & Level Badge Plate (Positioned ABOVE the 160px sprite)
      ctx.save();
      const pBadgeW = 165, pBadgeH = 34;
      const pBx = px - pBadgeW / 2, pBy = py - 150;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = heroColor;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = heroColor;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(pBx, pBy, pBadgeW, pBadgeH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = "bold 12px 'Century Gothic', CenturyGothic, sans-serif";
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.95)';
      ctx.shadowBlur = 4;
      ctx.fillText(`${s.characterName || 'Герой'} · Ур. ${s.level}`, px, pBy + 15);

      ctx.fillStyle = heroColor;
      ctx.font = "bold 10.5px 'Century Gothic', CenturyGothic, sans-serif";
      ctx.fillText(`${heroClass?.icon ?? ''} ${heroClass?.name ?? 'Искатель'}`, px, pBy + 28);
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
          const petSize = evoTier === 3 ? 48 : evoTier === 2 ? 40 : 32;

          // Pet Companion Position with Attack Strike Animation
          const petStrike = playerLunge.current > 0 ? Math.sin((playerLunge.current / 0.22) * Math.PI) * 60 : 0;
          const petX = px - 110 + lunge * 0.7 + petStrike;
          const petY = py + Math.sin(time.current * 4.5) * 10 - 25;

          ctx.save();
          // Pet Sprite (Clean image without colored stroke circles)
          const petImg = petDef.artSrc ? getImageAsset(petDef.artSrc) : null;
          if (petImg) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(petX, petY, petSize, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(petImg, petX - petSize, petY - petSize, petSize * 2, petSize * 2);
            ctx.restore();
          } else {
            ctx.font = `${petSize + 12}px 'Century Gothic', CenturyGothic, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(petDef.icon, petX, petY + petSize * 0.35);
          }

          // Pet Name & Level Badge Plate
          const petCustomName = s.petCustomNames?.[activePetId] || petDef.name.split(' ')[0];
          const petTextStr = `${evoBadge} ${petCustomName} (Ур.${fmt(petLvl)})`;
          const ptBadgeW = 145, ptBadgeH = 22;
          const ptBx = petX - ptBadgeW / 2, ptBy = petY - petSize - 26;

          ctx.save();
          ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
          ctx.strokeStyle = petDef.color;
          ctx.lineWidth = 1.5;
          ctx.shadowColor = petDef.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.roundRect(ptBx, ptBy, ptBadgeW, ptBadgeH, 8);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = "bold 10.5px 'Century Gothic', CenturyGothic, sans-serif";
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(0,0,0,0.95)';
          ctx.shadowBlur = 5;
          ctx.fillText(petTextStr, petX, ptBy + 15);
          ctx.restore();
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
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.beginPath(); ctx.ellipse(0, 0, isBoss ? 100 : 75, 18, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Monster Character
      ctx.save();
      ctx.translate(mx + mHitShake, my + mBob);

      if (monsterHit.current > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.filter = 'brightness(2.8)';
      }

      // Check image artwork (Clean image without colored stroke outlines)
      const mImg = mDef.artSrc ? getImageAsset(mDef.artSrc) : null;
      const mSize = isBoss ? 240 : 185;

      if (mImg) {
        ctx.save();
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

      // Monster Name & Level Badge Plate (Positioned ABOVE the monster sprite)
      ctx.save();
      const mTextStr = `${mDef.name} (Ур.${s.monster.level})`;
      const mBadgeW = isBoss ? 210 : 170, mBadgeH = 26;
      const mBy = my - (isBoss ? 215 : 165);
      const mBx = mx - mBadgeW / 2;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = mDef.color;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = mDef.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(mBx, mBy, mBadgeW, mBadgeH, 9);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = mDef.color;
      ctx.font = `bold ${isBoss ? 13 : 11.5}px 'Century Gothic', CenturyGothic, sans-serif`;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.95)';
      ctx.shadowBlur = 5;
      ctx.fillText(mTextStr, mx, mBy + 17);
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

      {/* COMPACT TOP-CENTER OVERLAY COMBAT ACTION BUTTONS & TURN BADGE */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1">
        <div className="text-[9px] font-black uppercase text-amber-300 tracking-wider bg-slate-950/90 px-2.5 py-0.5 rounded-full border border-amber-500/40 shadow-lg font-mono">
          ⚔️ РУЧНОЙ БОЙ • ВАШ ХОД
        </div>
        <div className="flex items-center gap-1.5 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-md">
          <button
            onClick={manualAttack}
            className="rpg-button-gold px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shadow-lg active:scale-95 transition-all hover:scale-105"
            title="Нанести удар оружием по монстру"
          >
            <span className="text-sm">⚔️</span>
            <span>Удар</span>
          </button>

          <button
            onClick={manualBlock}
            className="rpg-button-primary px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shadow-lg active:scale-95 transition-all hover:scale-105"
            title="Получить щит и заблокировать 75% урона ответного удара"
          >
            <span className="text-sm">🛡️</span>
            <span>Блок</span>
          </button>

          <button
            onClick={manualFlee}
            className="rpg-button-danger px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shadow-lg active:scale-95 transition-all hover:scale-105"
            title="Отступить из боя на 1 этап локации"
          >
            <span className="text-sm">🏃</span>
            <span>Убежать</span>
          </button>
        </div>
      </div>
    </div>
  );
}
