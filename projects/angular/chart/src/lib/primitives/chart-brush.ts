import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { CartesianContext } from '../core/cartesian-context';
import { CategoricalViewportContext } from '../core/categorical-viewport-context';
import { ScatterViewportContext } from '../core/scatter-viewport-context';
import {
  indexRangeSize,
  normalizeIndexRange,
  normalizeNumericDomain,
  panIndexRange,
  panNumericDomain,
  zoomIndexRange,
  zoomNumericDomain,
  type ChartIndexRange,
  type NumericDomain,
} from '../core/viewport';
import { nearestCategoryIndex } from '../core/pointer-util';

type BrushMode = 'category-brush' | 'category-pan' | 'scatter-brush' | 'scatter-pan' | null;

interface LocalPoint {
  readonly x: number;
  readonly y: number;
}

interface ScatterBrushState {
  readonly start: LocalPoint;
  readonly current: LocalPoint;
}

interface ScatterPanState {
  readonly start: LocalPoint;
  readonly xDomain: NumericDomain;
  readonly yDomain: NumericDomain;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function sameDomain(a: NumericDomain, b: NumericDomain): boolean {
  return Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9;
}

@Component({
  selector: 'svg:g[ui-chart-brush]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'chart-brush',
    '(window:pointermove)': 'onPointerMove($event)',
    '(window:pointerup)': 'onPointerUp($event)',
    '(window:pointercancel)': 'onPointerCancel($event)',
  },
  template: `
    <svg:rect
      #hitbox
      class="fill-transparent touch-none"
      x="0"
      y="0"
      [attr.width]="width()"
      [attr.height]="height()"
      (pointerdown)="onPointerDown($event)"
      (pointermove)="onPointerMove($event)"
      (pointerup)="onPointerUp($event)"
      (pointercancel)="onPointerCancel($event)"
      (wheel)="onWheel($event)"
      (dblclick)="resetZoom()" />

    @if (categoryPreview(); as rect) {
      <svg:rect
        class="fill-foreground/10 stroke-foreground/30"
        [attr.x]="rect.x"
        [attr.y]="rect.y"
        [attr.width]="rect.width"
        [attr.height]="rect.height"
        stroke-dasharray="4 3" />
    }

    @if (scatterPreviewRect(); as rect) {
      <svg:rect
        class="fill-foreground/10 stroke-foreground/30"
        [attr.x]="rect.x"
        [attr.y]="rect.y"
        [attr.width]="rect.width"
        [attr.height]="rect.height"
        stroke-dasharray="4 3" />
    }
  `,
})
export class ChartBrush {
  private readonly hitbox = viewChild.required<ElementRef<SVGRectElement>>('hitbox');
  private readonly cart = inject(CartesianContext, { optional: true });
  private readonly categorical = inject(CategoricalViewportContext, { optional: true });
  private readonly scatter = inject(ScatterViewportContext, { optional: true });

  private readonly mode = signal<BrushMode>(null);
  private readonly activePointerId = signal<number | null>(null);
  private readonly categoryStartIndex = signal<number | null>(null);
  private readonly categoryPanStart = signal<{ coord: number; range: ChartIndexRange | null } | null>(null);
  private readonly scatterBrush = signal<ScatterBrushState | null>(null);
  private readonly scatterPan = signal<ScatterPanState | null>(null);

  protected readonly width = computed(() => this.scatter?.innerWidth() ?? this.cart?.innerWidth() ?? 0);
  protected readonly height = computed(() => this.scatter?.innerHeight() ?? this.cart?.innerHeight() ?? 0);

  protected readonly categoryPreview = computed(() => {
    const cart = this.cart;
    const viewport = this.categorical;
    const range = viewport?.brushRange();
    const scale = cart?.categoryScale();
    const categories = cart?.categories() ?? [];
    if (!cart || !viewport || !range || !scale || categories.length === 0) {
      return null;
    }

    const visibleStart = viewport.zoomRange()?.startIndex ?? 0;
    const startVisible = range.startIndex - visibleStart;
    const endVisible = range.endIndex - visibleStart;
    if (startVisible < 0 || endVisible >= categories.length) {
      return null;
    }

    const first = scale(categories[startVisible]) ?? 0;
    const last = (scale(categories[endVisible]) ?? 0) + scale.bandwidth();
    if (cart.orientation() === 'vertical') {
      return { x: Math.min(first, last), y: 0, width: Math.abs(last - first), height: cart.innerHeight() };
    }
    return { x: 0, y: Math.min(first, last), width: cart.innerWidth(), height: Math.abs(last - first) };
  });

  protected readonly scatterPreviewRect = computed(() => {
    const preview = this.scatterBrush();
    if (!preview) {
      return null;
    }
    return {
      x: Math.min(preview.start.x, preview.current.x),
      y: Math.min(preview.start.y, preview.current.y),
      width: Math.abs(preview.current.x - preview.start.x),
      height: Math.abs(preview.current.y - preview.start.y),
    };
  });

  protected onPointerDown(event: PointerEvent): void {
    if (this.activePointerId() != null) {
      return;
    }
    const local = this.localPoint(event);
    if (!local) {
      return;
    }

    if (this.scatter) {
      if (!this.scatter.fullXDomain() || !this.scatter.fullYDomain()) {
        return;
      }
      event.preventDefault();
      this.activePointerId.set(event.pointerId);
      this.hitbox().nativeElement.setPointerCapture(event.pointerId);
      this.onScatterPointerDown(event, local);
      return;
    }
    if (!this.cart || !this.categorical) {
      return;
    }

    const index = nearestCategoryIndex(
      {
        categoryScale: this.cart.categoryScale,
        categories: this.cart.categories,
        orientation: this.cart.orientation,
      },
      local.x,
      local.y,
    );
    if (index < 0) {
      return;
    }

    event.preventDefault();
    this.activePointerId.set(event.pointerId);
    this.hitbox().nativeElement.setPointerCapture(event.pointerId);

    const visibleStart = this.categorical.zoomRange()?.startIndex ?? 0;
    const absoluteIndex = visibleStart + index;
    if (event.pointerType === 'touch' && this.categorical.hasZoom()) {
      this.mode.set('category-pan');
      this.categoryPanStart.set({ coord: this.pointerAxis(local), range: this.categorical.zoomRange() });
      return;
    }

    this.mode.set('category-brush');
    this.categoryStartIndex.set(absoluteIndex);
    this.categorical.brushRange.set({ startIndex: absoluteIndex, endIndex: absoluteIndex });
  }

  protected onPointerMove(event: PointerEvent): void {
    if (this.activePointerId() !== event.pointerId) {
      return;
    }
    const local = this.localPoint(event);
    if (!local) {
      return;
    }

    if (this.mode() === 'category-brush' && this.cart && this.categorical) {
      const startIndex = this.categoryStartIndex();
      if (startIndex == null) {
        return;
      }
      const index = nearestCategoryIndex(
        {
          categoryScale: this.cart.categoryScale,
          categories: this.cart.categories,
          orientation: this.cart.orientation,
        },
        local.x,
        local.y,
      );
      if (index < 0) {
        return;
      }
      const visibleStart = this.categorical.zoomRange()?.startIndex ?? 0;
      this.categorical.brushRange.set(
        normalizeIndexRange(startIndex, visibleStart + index, this.categorical.dataCount()),
      );
      return;
    }

    if (this.mode() === 'category-pan' && this.cart && this.categorical) {
      const pan = this.categoryPanStart();
      if (!pan) {
        return;
      }
      const scale = this.cart.categoryScale();
      const step = scale?.step?.() ?? scale?.bandwidth() ?? 0;
      if (step <= 0) {
        return;
      }
      const deltaSteps = Math.round((pan.coord - this.pointerAxis(local)) / step);
      this.categorical.zoomRange.set(panIndexRange(pan.range, this.categorical.dataCount(), deltaSteps));
      return;
    }

    if (this.mode() === 'scatter-brush') {
      const preview = this.scatterBrush();
      if (!preview) {
        return;
      }
      this.scatterBrush.set({ start: preview.start, current: local });
      return;
    }

    if (this.mode() === 'scatter-pan' && this.scatter) {
      const pan = this.scatterPan();
      const xScale = this.scatter.xScale();
      const yScale = this.scatter.yScale();
      const fullX = this.scatter.fullXDomain();
      const fullY = this.scatter.fullYDomain();
      if (!pan || !xScale || !yScale || !fullX || !fullY) {
        return;
      }
      const deltaX = xScale.invert(pan.start.x) - xScale.invert(local.x);
      const deltaY = yScale.invert(pan.start.y) - yScale.invert(local.y);
      this.scatter.zoomXDomain.set(panNumericDomain(pan.xDomain, fullX, deltaX));
      this.scatter.zoomYDomain.set(panNumericDomain(pan.yDomain, fullY, deltaY));
    }
  }

  protected onPointerUp(event?: PointerEvent): void {
    if (event && this.activePointerId() !== event.pointerId) {
      return;
    }
    if (this.mode() === 'category-brush' && this.categorical) {
      const range = this.categorical.brushRange();
      if (range && indexRangeSize(range, this.categorical.dataCount()) > 1) {
        this.categorical.zoomRange.set(range);
      }
      this.categorical.brushRange.set(null);
    }

    if (this.mode() === 'scatter-brush' && this.scatter) {
      const preview = this.scatterBrush();
      const xScale = this.scatter.xScale();
      const yScale = this.scatter.yScale();
      const fullX = this.scatter.fullXDomain();
      const fullY = this.scatter.fullYDomain();
      if (preview && xScale && yScale && fullX && fullY) {
        const width = Math.abs(preview.current.x - preview.start.x);
        const height = Math.abs(preview.current.y - preview.start.y);
        if (width >= 6 && height >= 6) {
          const nextX = normalizeNumericDomain(xScale.invert(preview.start.x), xScale.invert(preview.current.x));
          const nextY = normalizeNumericDomain(yScale.invert(preview.start.y), yScale.invert(preview.current.y));
          this.scatter.zoomXDomain.set(sameDomain(nextX, fullX) ? null : nextX);
          this.scatter.zoomYDomain.set(sameDomain(nextY, fullY) ? null : nextY);
        }
      }
      this.scatterBrush.set(null);
    }

    this.mode.set(null);
    this.categoryStartIndex.set(null);
    this.categoryPanStart.set(null);
    this.scatterPan.set(null);
    if (event && this.hitbox().nativeElement.hasPointerCapture(event.pointerId)) {
      this.hitbox().nativeElement.releasePointerCapture(event.pointerId);
    }
    this.activePointerId.set(null);
  }

  protected onPointerCancel(event: PointerEvent): void {
    if (this.activePointerId() !== event.pointerId) {
      return;
    }
    if (this.hitbox().nativeElement.hasPointerCapture(event.pointerId)) {
      this.hitbox().nativeElement.releasePointerCapture(event.pointerId);
    }
    this.mode.set(null);
    this.categorical?.brushRange.set(null);
    this.scatterBrush.set(null);
    this.categoryStartIndex.set(null);
    this.categoryPanStart.set(null);
    this.scatterPan.set(null);
    this.activePointerId.set(null);
  }

  protected onWheel(event: WheelEvent): void {
    const local = this.localPoint(event);
    if (!local) {
      return;
    }
    event.preventDefault();

    if (this.scatter) {
      const xScale = this.scatter.xScale();
      const yScale = this.scatter.yScale();
      const fullX = this.scatter.fullXDomain();
      const fullY = this.scatter.fullYDomain();
      if (!xScale || !yScale || !fullX || !fullY) {
        return;
      }
      const factor = event.deltaY < 0 ? 0.8 : 1.25;
      const currentX = this.scatter.zoomXDomain() ?? fullX;
      const currentY = this.scatter.zoomYDomain() ?? fullY;
      const nextX = zoomNumericDomain(currentX, fullX, xScale.invert(local.x), factor);
      const nextY = zoomNumericDomain(currentY, fullY, yScale.invert(local.y), factor);
      this.scatter.zoomXDomain.set(sameDomain(nextX, fullX) ? null : nextX);
      this.scatter.zoomYDomain.set(sameDomain(nextY, fullY) ? null : nextY);
      return;
    }

    if (!this.cart || !this.categorical) {
      return;
    }
    const visibleIndex = nearestCategoryIndex(
      {
        categoryScale: this.cart.categoryScale,
        categories: this.cart.categories,
        orientation: this.cart.orientation,
      },
      local.x,
      local.y,
    );
    if (visibleIndex < 0) {
      return;
    }
    const anchor = (this.categorical.zoomRange()?.startIndex ?? 0) + visibleIndex;
    const factor = event.deltaY < 0 ? 0.75 : 1.25;
    this.categorical.zoomRange.set(
      zoomIndexRange(this.categorical.zoomRange(), this.categorical.dataCount(), anchor, factor),
    );
    this.categorical.brushRange.set(null);
  }

  protected resetZoom(): void {
    this.categorical?.resetZoom();
    this.scatter?.resetZoom();
    this.scatterBrush.set(null);
  }

  private onScatterPointerDown(event: PointerEvent, local: LocalPoint): void {
    const fullX = this.scatter?.fullXDomain();
    const fullY = this.scatter?.fullYDomain();
    if (!this.scatter || !fullX || !fullY) {
      return;
    }

    if (event.pointerType === 'touch' && this.scatter.hasZoom()) {
      this.mode.set('scatter-pan');
      this.scatterPan.set({
        start: local,
        xDomain: this.scatter.zoomXDomain() ?? fullX,
        yDomain: this.scatter.zoomYDomain() ?? fullY,
      });
      return;
    }

    this.mode.set('scatter-brush');
    this.scatterBrush.set({ start: local, current: local });
  }

  private localPoint(event: { clientX: number; clientY: number }): LocalPoint | null {
    const hitbox = this.hitbox()?.nativeElement;
    const width = this.width();
    const height = this.height();
    if (!hitbox || width <= 0 || height <= 0) {
      return null;
    }
    const rect = hitbox.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return null;
    }
    return {
      x: clamp(((event.clientX - rect.left) / rect.width) * width, 0, width),
      y: clamp(((event.clientY - rect.top) / rect.height) * height, 0, height),
    };
  }

  private pointerAxis(local: LocalPoint): number {
    return this.cart?.orientation() === 'horizontal' ? local.y : local.x;
  }
}
