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
  itemsPerView = 3;
  private intervalId?: number;
  private resizeHandler = () => this.updateItemsPerView();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Setup items per view first, then start auto-scroll
    this.updateItemsPerView();
    this.startAutoScroll();
    window.addEventListener('resize', this.resizeHandler);
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
    window.removeEventListener('resize', this.resizeHandler);
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
   * Update the itemsPerView value based on window width.
   * - mobile: 1, tablet/smaller desktop: 2, large screens: 3
   */
  private updateItemsPerView(): void {
    const width = window.innerWidth;
    if (width <= 768) {
      this.itemsPerView = 1;
    } else if (width <= 1024) {
      this.itemsPerView = 2;
    } else {
      this.itemsPerView = 3;
    }
    // ensure currentIndex is within bounds after resizing
    const maxStartIdx = Math.max(0, this.testimonials.length - this.itemsPerView);
    // clamp index instead of resetting to 0 to prevent occasional blank
    this.currentIndex = Math.min(this.currentIndex, maxStartIdx);
  }
}
