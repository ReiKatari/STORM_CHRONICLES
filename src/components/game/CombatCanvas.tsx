import { useEffect, useRef } from 'react';
import { useGame } from '@/game/store';
import { zoneById } from '@/game/monsters';
import { getClassById } from '@/game/classes';
import { PETS } from '@/game/pets';
import { fmt } from '@/game/engine';
import type { FxEvent } from '@/game/types';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number;
  color: string; gravity: number; kind: 'spark' | 'ember' | 'snow' | 'text' | 'emoji' | 'ring' | 'bolt' | 'slash';
  text?: string; angle?: number;
}

interface HeroParticle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number;
  color: string; icon?: string;
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
  const heroParticles = useRef<HeroParticle[]>([]);
  const ambient = useRef<AmbientP[]>([]);
  const tiles = useRef<Tile[]>([]);
  const shake = useRef(0);
  const playerLunge = useRef(0);
  const monsterHit = useRef(0);
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
    getImageAsset('/monsters/slime.jpg');
    getImageAsset('/monsters/goblin.jpg');
    getImageAsset('/monsters/skeleton.jpg');
    getImageAsset('/monsters/orc.jpg');
    getImageAsset('/monsters/hydra.jpg');
    getImageAsset('/monsters/minotaur.jpg');
    getImageAsset('/monsters/wolf.jpg');
    getImageAsset('/monsters/zombie.jpg');
    getImageAsset('/monsters/spider_queen.jpg');
    getImageAsset('/monsters/goblin_king.jpg');
    getImageAsset('/monsters/fire_elemental.jpg');
    getImageAsset('/monsters/ghost.jpg');
    getImageAsset('/monsters/rat.jpg');
    getImageAsset('/monsters/bandit.jpg');
    getImageAsset('/monsters/cultist.jpg');
    getImageAsset('/monsters/bear.jpg');
    getImageAsset('/monsters/elemental_ice.jpg');
    getImageAsset('/monsters/mimic.jpg');
    getImageAsset('/monsters/knight.jpg');
    getImageAsset('/monsters/treant.jpg');
    getImageAsset('/monsters/wyvern.jpg');
    getImageAsset('/monsters/archdemon.jpg');
    getImageAsset('/monsters/chimera.jpg');
    getImageAsset('/monsters/basilisk.jpg');
    getImageAsset('/monsters/phoenix.jpg');

    // Preload background artwork assets
    getImageAsset('/backgrounds/forest.jpg');
    getImageAsset('/backgrounds/volcano.jpg');
    getImageAsset('/backgrounds/abyss.jpg');
    getImageAsset('/backgrounds/mine.jpg');
    getImageAsset('/backgrounds/swamp.jpg');
    getImageAsset('/backgrounds/desert.jpg');
    getImageAsset('/backgrounds/vault.jpg');

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
          floatText(mx, my - 80, `-${fmt(typeof fx.value === 'number' ? fx.value : parseFloat(fx.value as any) || 0)}`, fx.color ?? '#fff', 20);
          monsterHit.current = 0.15; playerLunge.current = 0.18;
          break;
        case 'crit':
          burst(mx, my - 30, 30, '#facc15', 300, 4);
          P.push({ x: mx - 30, y: my - 40, vx: 0, vy: 0, life: 0, maxLife: 0.35, size: 60, color: '#facc15', gravity: 0, kind: 'slash' });
          floatText(mx, my - 90, `💥 ${fmt(typeof fx.value === 'number' ? fx.value : parseFloat(fx.value as any) || 0)}`, '#facc15', 32);
          shake.current = Math.max(shake.current, 8);
          monsterHit.current = 0.22; playerLunge.current = 0.22;
          break;
        case 'monsterHit':
          burst(px, py - 30, 12, '#f87171', 190);
          floatText(px, py - 80, `-${fmt(typeof fx.value === 'number' ? fx.value : parseFloat(fx.value as any) || 0)}`, '#f87171', 20);
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
      const skyTop = zone?.theme?.skyTop || '#0f172a';
      const skyBottom = zone?.theme?.skyBottom || '#1e293b';
      const accentColor = zone?.theme?.ground || '#38bdf8';
      const particleColor = zone?.theme?.particles || 'rgba(56,189,248,0.5)';

      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, skyTop);
      grad.addColorStop(0.65, skyBottom);
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // ===== DRAW HIGH QUALITY GENERATED ARTWORK BACKGROUND =====
      const zoneId = s.zoneId;
      const bgPath = (zoneId === 'volcano' || zoneId === 'demons' || zoneId === 'abyss_core')
        ? '/backgrounds/volcano.jpg'
        : (zoneId === 'abyss' || zoneId === 'void' || zoneId === 'space')
        ? '/backgrounds/abyss.jpg'
        : (zoneId === 'mine' || zoneId === 'hidden_vault')
        ? '/backgrounds/vault.jpg'
        : zoneId === 'swamp'
        ? '/backgrounds/swamp.jpg'
        : zoneId === 'desert'
        ? '/backgrounds/desert.jpg'
        : '/backgrounds/forest.jpg';
      const bgImg = getImageAsset(bgPath);
      if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.save();
        ctx.globalAlpha = 0.90;
        ctx.drawImage(bgImg, 0, 0, W, H);
        ctx.restore();
      }

      // Distant horizon glow
      const horizonG = ctx.createRadialGradient(W / 2, H * 0.6, 10, W / 2, H * 0.6, W * 0.6);
      horizonG.addColorStop(0, `${accentColor}33`);
      horizonG.addColorStop(1, 'transparent');
      ctx.fillStyle = horizonG;
      ctx.fillRect(0, 0, W, H);

      const groundY = H * 0.68;

      // ===== DRAW UNIQUE ZONE ENVIRONMENT LANDSCAPE =====
      if (zoneId === 'forest') {
        // Dark Forest Pine Tree Silhouettes
        ctx.fillStyle = '#06201b';
        const numTrees = 8;
        for (let i = 0; i < numTrees; i++) {
          const tx = (i / (numTrees - 1)) * W;
          const th = 80 + (i % 3) * 20;
          ctx.beginPath();
          ctx.moveTo(tx, groundY);
          ctx.lineTo(tx - 25, groundY);
          ctx.lineTo(tx, groundY - th);
          ctx.lineTo(tx + 25, groundY);
          ctx.fill();
        }
        // Glowing Spore Particles
        for (let i = 0; i < 5; i++) {
          const sx = (W * 0.1) + ((i * 180 + time.current * 20) % (W * 0.8));
          const sy = groundY - 30 - Math.sin(time.current + i) * 20;
          ctx.fillStyle = '#4ade80';
          ctx.shadowColor = '#4ade80';
          ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
        }
      } else if (zoneId === 'hills') {
        // Rolling Hills Curves
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.quadraticCurveTo(W * 0.25, groundY - 35, W * 0.5, groundY - 15);
        ctx.quadraticCurveTo(W * 0.75, groundY + 10, W, groundY - 25);
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
      } else if (zoneId === 'mine') {
        // Cavern Roof Stalactites & Wall Crystals
        ctx.fillStyle = '#292524';
        for (let i = 0; i < 7; i++) {
          const cx = (i / 6) * W;
          ctx.beginPath();
          ctx.moveTo(cx - 15, 0); ctx.lineTo(cx + 15, 0); ctx.lineTo(cx, 40 + (i % 4) * 15); ctx.fill();
        }
        // Glowing Wall Crystals
        ctx.fillStyle = '#c084fc';
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 12;
        [0.15, 0.4, 0.7, 0.88].forEach(pct => {
          ctx.beginPath(); ctx.arc(W * pct, groundY - 20, 5, 0, Math.PI * 2); ctx.fill();
        });
        ctx.shadowBlur = 0;
      } else if (zoneId === 'swamp') {
        // Murky Swamp Water Mist
        const swampG = ctx.createLinearGradient(0, groundY - 30, 0, groundY);
        swampG.addColorStop(0, 'transparent');
        swampG.addColorStop(1, 'rgba(54, 83, 20, 0.6)');
        ctx.fillStyle = swampG;
        ctx.fillRect(0, groundY - 30, W, 30);
      } else if (zoneId === 'desert') {
        // Sand Dunes & Pyramid Horizon
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.moveTo(W * 0.6, groundY);
        ctx.lineTo(W * 0.75, groundY - 50);
        ctx.lineTo(W * 0.9, groundY);
        ctx.fill();
      } else if (zoneId === 'volcano' || zoneId === 'demons') {
        // Molten Lava River
        const lavaG = ctx.createLinearGradient(0, groundY, W, groundY);
        lavaG.addColorStop(0, '#ef4444');
        lavaG.addColorStop(0.5, '#f97316');
        lavaG.addColorStop(1, '#ef4444');
        ctx.fillStyle = lavaG;
        ctx.fillRect(W * 0.4, groundY + 15, W * 0.2, 10);
      } else if (zoneId === 'frost' || zoneId === 'ice') {
        // Aurora Borealis Sky Glow
        const auroraG = ctx.createLinearGradient(0, 0, W, 0);
        auroraG.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
        auroraG.addColorStop(0.5, 'rgba(74, 222, 128, 0.35)');
        auroraG.addColorStop(1, 'rgba(168, 85, 247, 0.25)');
        ctx.fillStyle = auroraG;
        ctx.fillRect(0, 20, W, 70);
      } else if (zoneId === 'abyss') {
        // Void Space Nebula & Rift
        const riftG = ctx.createRadialGradient(W / 2, H * 0.35, 10, W / 2, H * 0.35, 120);
        riftG.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
        riftG.addColorStop(1, 'transparent');
        ctx.fillStyle = riftG;
        ctx.fillRect(0, 0, W, H);
      }

      // Floor ground (subtle shadow gradient over background artwork)
      const groundG = ctx.createLinearGradient(0, groundY - 20, 0, H);
      groundG.addColorStop(0, 'transparent');
      groundG.addColorStop(0.3, 'rgba(15, 23, 42, 0.35)');
      groundG.addColorStop(1, 'rgba(2, 6, 23, 0.65)');
      ctx.fillStyle = groundG;
      ctx.fillRect(0, groundY - 20, W, H - groundY + 20);

      // Ground border line
      ctx.strokeStyle = `${accentColor}88`;
      ctx.lineWidth = 1.5;
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

      // Ambient particles
      ambient.current.forEach(p => {
        p.x += (p.vx + Math.sin(time.current + p.phase) * 10) * dt;
        p.y += p.vy * dt;
        if (p.y < 0) { p.y = H; p.x = Math.random() * W; }
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = p.alpha * (0.6 + Math.sin(time.current * 2 + p.phase) * 0.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // ===== DRAW HERO PLAYER =====
      const px = W * 0.25;
      const py = H * 0.68;
      const bob = Math.sin(time.current * 3.5) * 4;
      const breatheScaleX = 1 + Math.sin(time.current * 4) * 0.03;
      const breatheScaleY = 1 - Math.sin(time.current * 4) * 0.03;

      const lunge = playerLunge.current > 0 ? Math.sin((playerLunge.current / 0.22) * Math.PI) * 32 : 0;
      const weaponItem = s.equipment['weapon'];
      const weaponIcon = weaponItem?.icon ?? '⚔️';
      const heroColor = heroClass?.color ?? '#facc15';

      // Spawn Class Aura Particles
      if (Math.random() < 0.35) {
        heroParticles.current.push({
          x: px + (Math.random() - 0.5) * 40,
          y: py - 10 + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 15,
          vy: -25 - Math.random() * 20,
          life: 0,
          maxLife: 0.8 + Math.random() * 0.6,
          size: 2 + Math.random() * 3,
          color: heroColor,
          icon: heroClass?.icon,
        });
      }

      // Draw Hero Class Aura Particles
      for (let i = heroParticles.current.length - 1; i >= 0; i--) {
        const hp = heroParticles.current[i];
        hp.life += dt;
        if (hp.life >= hp.maxLife) { heroParticles.current.splice(i, 1); continue; }
        hp.x += hp.vx * dt;
        hp.y += hp.vy * dt;
        const progress = hp.life / hp.maxLife;

        ctx.save();
        ctx.globalAlpha = (1 - progress) * 0.7;
        ctx.fillStyle = hp.color;
        ctx.shadowColor = hp.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(hp.x, hp.y, hp.size * (1 - progress * 0.4), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Hero Pedestal Aura Rings
      ctx.save();
      ctx.translate(px + lunge, py + 24);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath(); ctx.ellipse(0, 0, 46, 13, 0, 0, Math.PI * 2); ctx.fill();

      // Pulsing outer aura ring
      const ringSize = 42 + Math.sin(time.current * 3) * 4;
      const ringG = ctx.createRadialGradient(0, 0, 5, 0, 0, ringSize);
      ringG.addColorStop(0, `${heroColor}66`);
      ringG.addColorStop(1, 'transparent');
      ctx.fillStyle = ringG;
      ctx.beginPath(); ctx.ellipse(0, 0, ringSize, 12, 0, 0, Math.PI * 2); ctx.fill();

      ctx.strokeStyle = heroColor;
      ctx.lineWidth = 2;
      ctx.shadowColor = heroColor;
      ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.ellipse(0, 0, ringSize, 10, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      // Shield Aura Ring
      if (s.shield > 0) {
        ctx.save();
        ctx.translate(px + lunge, py + bob);
        ctx.strokeStyle = 'rgba(253,230,138,0.9)';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#fde68a';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(0, -20, 52 + Math.sin(time.current * 4) * 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Hero Character Portrait Avatar Sprite
      ctx.save();
      ctx.translate(px + lunge, py + bob - 20);
      ctx.scale(breatheScaleX, breatheScaleY);

      // Rotating Class Crest Halo Ring
      ctx.save();
      ctx.rotate(time.current * 0.6);
      ctx.strokeStyle = `${heroColor}88`;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, 42, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      const heroImg = heroClass?.artSrc ? getImageAsset(heroClass.artSrc) : null;
      const size = 110;

      if (heroImg) {
        // Multi-layer glowing aura
        ctx.save();
        ctx.shadowColor = heroColor;
        ctx.shadowBlur = 22;
        ctx.strokeStyle = heroColor;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(0, 0, size / 2 + 4, 0, Math.PI * 2);
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
        ctx.font = "80px 'Century Gothic', CenturyGothic, sans-serif";
        ctx.textAlign = 'center';
        ctx.fillText(heroClass?.icon ?? '🧝', 0, 20);
      }

      // Floating Weapon with Attack Swing Arc
      const wBob = Math.cos(time.current * 4) * 4;
      const wRot = playerLunge.current > 0 ? Math.sin((playerLunge.current / 0.22) * Math.PI) * -0.8 : 0;
      ctx.save();
      ctx.translate(62, -15 + wBob);
      ctx.rotate(wRot);
      ctx.font = "32px 'Century Gothic', CenturyGothic, sans-serif";
      ctx.textAlign = 'center';
      ctx.shadowColor = heroColor;
      ctx.shadowBlur = 10;
      ctx.fillText(weaponIcon, 0, 0);
      ctx.restore();

      ctx.restore();

      // Player Name & Level Badge (Positioned ABOVE the 110px sprite)
      ctx.save();
      ctx.fillStyle = '#fef08a';
      ctx.font = "bold 12px 'Century Gothic', CenturyGothic, sans-serif";
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.95)';
      ctx.shadowBlur = 6;
      ctx.fillText(`${s.characterName || 'Герой'} · Ур. ${s.level}`, px, py - 110);
      ctx.fillStyle = heroColor;
      ctx.font = "bold 11px 'Century Gothic', CenturyGothic, sans-serif";
      ctx.fillText(`${heroClass?.icon ?? ''} ${heroClass?.name ?? 'Искатель'}`, px, py - 95);
      ctx.restore();

      // Player HP/Mana Bar
      const barW = 120;
      ctx.fillStyle = 'rgba(15,23,42,0.85)';
      ctx.fillRect(px - barW / 2 - 2, py + 48, barW + 4, 16);
      ctx.strokeStyle = 'rgba(51,65,85,0.8)';
      ctx.strokeRect(px - barW / 2 - 2, py + 48, barW + 4, 16);

      // HP Fill
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(px - barW / 2, py + 50, barW * Math.max(0, s.hp / s.derived.maxHp), 7);
      // Mana Fill
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(px - barW / 2, py + 58, barW * Math.max(0, s.mana / s.derived.maxMana), 4);

      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 8px font-mono";
      ctx.textAlign = 'center';
      ctx.fillText(`${fmt(Math.round(s.hp))}/${fmt(s.derived.maxHp)}`, px, py + 56);

      // ===== DRAW ACTIVE PET COMPANION =====
      const activePetId = s.activePetId ?? 'pet_dragon';
      if (activePetId) {
        const petDef = PETS.find(p => p.id === activePetId);
        if (petDef) {
          const petX = px - 80 + lunge * 0.4;
          const petY = py + Math.sin(time.current * 4) * 6 - 15;
          ctx.save();
          // Pet Aura
          ctx.shadowColor = petDef.color;
          ctx.shadowBlur = 16;
          ctx.fillStyle = `${petDef.color}44`;
          ctx.beginPath(); ctx.arc(petX, petY, 22, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = petDef.color;
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(petX, petY, 20, 0, Math.PI * 2); ctx.stroke();
          // Pet Icon
          ctx.font = "28px 'Century Gothic', CenturyGothic, sans-serif";
          ctx.textAlign = 'center';
          ctx.fillText(petDef.icon, petX, petY + 9);
          // Pet Name & Level Tag
          const petCustomName = s.petCustomNames?.[activePetId] || petDef.name.split(' ')[0];
          ctx.fillStyle = petDef.color;
          ctx.font = "bold 9.5px 'Century Gothic', CenturyGothic, sans-serif";
          ctx.shadowColor = 'rgba(0,0,0,0.95)';
          ctx.shadowBlur = 5;
          ctx.fillText(`${petCustomName} (Ур.${s.petLvl ?? 1})`, petX, petY - 26);
          ctx.restore();
        }
      }

      // ===== DRAW MONSTER =====
      const mx = W * 0.75;
      const my = H * 0.68;
      const mBob = Math.sin(time.current * 2.5 + 1) * 3;
      const mHitShake = monsterHit.current > 0 ? (Math.random() - 0.5) * 12 : 0;
      const mDef = s.monster.def;
      const isBoss = mDef.isBoss || mDef.isMiniBoss;

      // Monster Pedestal
      ctx.save();
      ctx.translate(mx + mHitShake, my + 32);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath(); ctx.ellipse(0, 0, isBoss ? 75 : 55, 14, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = mDef.color;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(0, 0, isBoss ? 70 : 50, 12, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      // Monster Character
      ctx.save();
      ctx.translate(mx + mHitShake, my + mBob);

      if (monsterHit.current > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.filter = 'brightness(2.5)';
      }

      // Check image artwork (Increased Monster Sprite Sizes: Normal = 130px, Boss = 175px)
      const mImg = mDef.artSrc ? getImageAsset(mDef.artSrc) : null;
      const mSize = isBoss ? 175 : 130;

      if (mImg) {
        ctx.save();
        ctx.shadowColor = mDef.color;
        ctx.shadowBlur = isBoss ? 28 : 16;
        ctx.strokeStyle = mDef.color;
        ctx.lineWidth = isBoss ? 4 : 2.5;
        ctx.beginPath();
        ctx.arc(0, -mSize / 4, mSize / 2 + 3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, -mSize / 4, mSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(mImg, -mSize / 2, -mSize * 0.75, mSize, mSize);
        ctx.restore();
      } else {
        ctx.font = `${isBoss ? 95 : 75}px 'Century Gothic', CenturyGothic, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(mDef.icon, 0, 0);
      }

      ctx.restore();

      // Monster Name & Level Badge (Positioned ABOVE the 130px/175px monster sprite)
      ctx.save();
      ctx.fillStyle = mDef.color;
      ctx.font = `bold ${isBoss ? 14 : 12}px 'Century Gothic', CenturyGothic, sans-serif`;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.95)';
      ctx.shadowBlur = 6;
      ctx.fillText(`${mDef.name} (Ур.${s.monster.level})`, mx, my - (isBoss ? 165 : 125));
      ctx.restore();
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
      ctx.fillText(`${fmt(s.monster.hp)}/${fmt(s.monster.maxHp)}`, mx, my + 47);

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
