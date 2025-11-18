import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Testimonial } from '../../models/portfolio.model';
import { ScrollAnimationDirective } from '../../directives/scroll-animation.directive';

@Component({
  selector: 'app-testimonials',
  imports: [CommonModule, ScrollAnimationDirective],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
/**
 * Testimonials Component
 * - Renders a horizontally scrollable carousel of testimonials (images + text)
 * - Handles responsive itemsPerView and auto-scrolling behavior
 */
export class TestimonialsComponent implements OnInit, OnDestroy {
  @Input() testimonials: Testimonial[] = [];
  
  currentIndex = 0;
  // Show 2 testimonials side-by-side on non-mobile screens; 1 on mobile
  itemsPerView = 2;
  private intervalId?: number;
  private resizeHandler = () => this.updateItemsPerView();
  private mediaQuery?: MediaQueryList;
  
  // Touch gesture support
  private touchStartX = 0;
  private touchEndX = 0;
  private minSwipeDistance = 50;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Setup items per view first, then start auto-scroll
    this.updateItemsPerView();
    this.startAutoScroll();
    window.addEventListener('resize', this.resizeHandler);
    // Listen for breakpoint changes (use matchMedia so switching to mobile view updates immediately)
    try {
      this.mediaQuery = window.matchMedia('(max-width: 768px)');
      // update immediately when the media query's value changes
      this.mediaQuery.addEventListener?.('change', this.resizeHandler);
      // Some older browsers use addListener
      this.mediaQuery.addListener?.(this.resizeHandler as any);
    } catch (e) {
      // ignore if matchMedia isn't available in the environment
    }
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
    window.removeEventListener('resize', this.resizeHandler);
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener?.('change', this.resizeHandler);
      this.mediaQuery.removeListener?.(this.resizeHandler as any);
    }
  }

  /** Start automatic scrolling of testimonials every 5 seconds. */
  private startAutoScroll(): void {
    // Auto-scroll every 5 seconds
    if (this.intervalId) return;
    this.intervalId = window.setInterval(() => {
      this.next();
      // ensure UI refresh in edge cases
      this.cdr.detectChanges();
    }, 5000);
  }

  private stopAutoScroll(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  // Public helpers to allow template to pause/resume scrolling
  /** Temporarily stop the auto-scroll (used on hover or pointer down). */
  pauseAutoScroll(): void {
    this.stopAutoScroll();
  }

  /** Resume the automatic carousel scrolling (starts interval again). */
  resumeAutoScroll(): void {
    this.startAutoScroll();
  }

  /** Move the carousel one window forward and update currentIndex. */
  next(): void {
    const n = this.testimonials.length;
    if (n > this.itemsPerView) {
      const maxStartIdx = n - this.itemsPerView; // highest valid start index
      const numPositions = maxStartIdx + 1; // total possible windows
      this.currentIndex = (this.currentIndex + 1) % numPositions;
      this.cdr.detectChanges();
    }
  }

  /** Move the carousel one window backward and update currentIndex. */
  prev(): void {
    const n = this.testimonials.length;
    if (n > this.itemsPerView) {
      const maxStartIdx = n - this.itemsPerView;
      const numPositions = maxStartIdx + 1;
      this.currentIndex = this.currentIndex === 0 ? numPositions - 1 : this.currentIndex - 1;
      this.cdr.detectChanges();
    }
  }

  /**
   * Get the testimonials currently visible in the carousel's viewport
   * based on the current index and the responsive itemsPerView value.
   */
  getVisibleTestimonials(): Testimonial[] {
    const n = this.testimonials.length;
    if (n <= this.itemsPerView) return this.testimonials;

    // clamp currentIndex to a safe range to avoid blank slices
    const maxStartIdx = Math.max(0, n - this.itemsPerView);
    const start = Math.min(Math.max(0, this.currentIndex), maxStartIdx);
    return this.testimonials.slice(start, start + this.itemsPerView);
  }

  /**
   * Return a safe text for testimonial to avoid empty displays.
   */
  getTestimonialText(t: Testimonial): string {
    return t.text ?? '';
  }

  /**
   * Update the itemsPerView value based on window width.
   * - mobile: 1, tablet/smaller desktop: 2, large screens: 3
   */
  private updateItemsPerView(): void {
    const width = window.innerWidth;
    if (width <= 768) {
      this.itemsPerView = 1;
    } else {
      this.itemsPerView = 2;
    }
    // ensure currentIndex is within bounds after resizing
    const maxStartIdx = Math.max(0, this.testimonials.length - this.itemsPerView);
    // clamp index instead of resetting to 0 to prevent occasional blank
    this.currentIndex = Math.min(this.currentIndex, maxStartIdx);
    // force change detection to update the visible slice immediately when resizing
    // This prevents the temporary state where the CSS is responsive but the component still
    // renders an outdated number of items until the next user/action triggers change detection.
    this.cdr.detectChanges();
  }

  /** Handle touch start event for swipe gesture */
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
    this.pauseAutoScroll();
  }

  /** Handle touch move event for swipe gesture */
  onTouchMove(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
  }

  /** Handle touch end event and detect swipe direction */
  onTouchEnd(): void {
    const swipeDistance = this.touchStartX - this.touchEndX;
    
    if (Math.abs(swipeDistance) > this.minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped left, go to next
        this.next();
      } else {
        // Swiped right, go to previous
        this.prev();
      }
    }
    
    this.resumeAutoScroll();
    this.touchStartX = 0;
    this.touchEndX = 0;
  }
}
