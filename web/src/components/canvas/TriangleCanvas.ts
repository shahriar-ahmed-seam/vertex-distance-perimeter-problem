import { Point, dist, heronArea, isPointInsideTriangle } from '../../core/math.js';

export interface TriangleState {
  A: Point;
  B: Point;
  C: Point;
  P: Point;
  d1: number;
  d2: number;
  d3: number;
  a: number;
  b: number;
  c: number;
  perimeter: number;
  area: number;
  isInterior: boolean;
  alpha: number; // angle APB
  beta: number;  // angle BPC
  gamma: number; // angle CPA
}

export class TriangleCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private state: TriangleState;
  private activeDrag: 'A' | 'B' | 'C' | 'P' | null = null;
  private onChange?: (state: TriangleState) => void;

  constructor(canvas: HTMLCanvasElement, onChange?: (state: TriangleState) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.onChange = onChange;

    // Initial equilateral layout scaled to canvas
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = 180;

    this.state = {
      A: { x: cx, y: cy - r },
      B: { x: cx - r * 0.866, y: cy + r * 0.5 },
      C: { x: cx + r * 0.866, y: cy + r * 0.5 },
      P: { x: cx - 15, y: cy + 25 },
      d1: 0,
      d2: 0,
      d3: 0,
      a: 0,
      b: 0,
      c: 0,
      perimeter: 0,
      area: 0,
      isInterior: true,
      alpha: 0,
      beta: 0,
      gamma: 0
    };

    this.recomputeMetrics();
    this.initEvents();
    this.render();
  }

  public setPreset(type: 'equilateral' | 'right' | 'isosceles' | 'obtuse') {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;

    if (type === 'equilateral') {
      const r = 180;
      this.state.A = { x: cx, y: cy - r };
      this.state.B = { x: cx - r * 0.866, y: cy + r * 0.5 };
      this.state.C = { x: cx + r * 0.866, y: cy + r * 0.5 };
      this.state.P = { x: cx, y: cy + 20 };
    } else if (type === 'right') {
      this.state.A = { x: cx - 180, y: cy - 140 };
      this.state.B = { x: cx - 180, y: cy + 160 };
      this.state.C = { x: cx + 180, y: cy + 160 };
      this.state.P = { x: cx - 80, y: cy + 40 };
    } else if (type === 'isosceles') {
      this.state.A = { x: cx, y: cy - 200 };
      this.state.B = { x: cx - 140, y: cy + 160 };
      this.state.C = { x: cx + 140, y: cy + 160 };
      this.state.P = { x: cx, y: cy + 40 };
    } else if (type === 'obtuse') {
      this.state.A = { x: cx - 180, y: cy + 120 };
      this.state.B = { x: cx - 60, y: cy - 140 };
      this.state.C = { x: cx + 220, y: cy + 140 };
      this.state.P = { x: cx - 30, y: cy + 50 };
    }

    this.recomputeMetrics();
    this.render();
    if (this.onChange) this.onChange(this.state);
  }

  public getState(): TriangleState {
    return this.state;
  }

  private recomputeMetrics() {
    const { A, B, C, P } = this.state;

    this.state.d1 = dist(P, A);
    this.state.d2 = dist(P, B);
    this.state.d3 = dist(P, C);

    this.state.c = dist(A, B);
    this.state.a = dist(B, C);
    this.state.b = dist(C, A);

    this.state.perimeter = this.state.a + this.state.b + this.state.c;
    this.state.area = heronArea(this.state.a, this.state.b, this.state.c);
    this.state.isInterior = isPointInsideTriangle(P, A, B, C);

    // Subtended angles at P
    const ang = (p1: Point, p2: Point) => {
      const v1x = p1.x - P.x;
      const v1y = p1.y - P.y;
      const v2x = p2.x - P.x;
      const v2y = p2.y - P.y;
      const dot = v1x * v2x + v1y * v2y;
      const det = v1x * v2y - v1y * v2x;
      let a = Math.atan2(det, dot);
      if (a < 0) a += 2 * Math.PI;
      return a;
    };

    this.state.alpha = ang(A, B);
    this.state.beta = ang(B, C);
    this.state.gamma = ang(C, A);
  }

  private initEvents() {
    const getPos = (e: MouseEvent): Point => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    };

    this.canvas.addEventListener('mousedown', (e) => {
      const pos = getPos(e);
      const hit = (p: Point, r = 24) => dist(pos, p) <= r;

      if (hit(this.state.P, 18)) {
        this.activeDrag = 'P';
      } else if (hit(this.state.A)) {
        this.activeDrag = 'A';
      } else if (hit(this.state.B)) {
        this.activeDrag = 'B';
      } else if (hit(this.state.C)) {
        this.activeDrag = 'C';
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.activeDrag) return;
      const pos = getPos(e);

      // Clamp within canvas bounds
      const pad = 20;
      pos.x = Math.max(pad, Math.min(this.canvas.width - pad, pos.x));
      pos.y = Math.max(pad, Math.min(this.canvas.height - pad, pos.y));

      this.state[this.activeDrag] = pos;
      this.recomputeMetrics();
      this.render();
      if (this.onChange) this.onChange(this.state);
    });

    window.addEventListener('mouseup', () => {
      this.activeDrag = null;
    });
  }

  public render() {
    const { ctx, canvas } = this;
    const { A, B, C, P, d1, d2, d3, a, b, c, isInterior } = this.state;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridStep = 40;
    for (let x = 0; x < canvas.width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Triangle fill & edges
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(C.x, C.y);
    ctx.closePath();

    ctx.fillStyle = isInterior ? 'rgba(56, 189, 248, 0.08)' : 'rgba(239, 68, 68, 0.06)';
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Distance rays from P
    const drawRay = (target: Point, color: string, label: string, distVal: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(P.x, P.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();

      // Label at midpoint
      const mx = (P.x + target.x) / 2;
      const my = (P.y + target.y) / 2;

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(mx, my, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.font = 'bold 11px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, mx, my);
      ctx.restore();
    };

    drawRay(A, '#38bdf8', 'd₁', d1);
    drawRay(B, '#10b981', 'd₂', d2);
    drawRay(C, '#f59e0b', 'd₃', d3);

    // Side length text annotations
    const drawSideLabel = (p1: Point, p2: Point, label: string) => {
      const mx = (p1.x + p2.x) / 2;
      const my = (p1.y + p2.y) / 2;
      ctx.save();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, mx, my);
      ctx.restore();
    };

    drawSideLabel(A, B, `c = ${c.toFixed(1)}`);
    drawSideLabel(B, C, `a = ${a.toFixed(1)}`);
    drawSideLabel(C, A, `b = ${b.toFixed(1)}`);

    // Draw Vertices
    const drawVertex = (p: Point, label: string) => {
      ctx.save();
      // Glow halo
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 15px Outfit, sans-serif';
      ctx.fillText(label, p.x + 12, p.y - 12);
      ctx.restore();
    };

    drawVertex(A, 'A');
    drawVertex(B, 'B');
    drawVertex(C, 'C');

    // Draw Point P
    ctx.save();
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(P.x, P.y, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(P.x, P.y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fb7185';
    ctx.font = 'bold 16px Outfit, sans-serif';
    ctx.fillText('P', P.x + 14, P.y + 6);
    ctx.restore();
  }
}
