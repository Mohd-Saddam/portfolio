import { Component, Input, OnChanges, OnDestroy, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/portfolio.model';
import { ScrollAnimationDirective } from '../../directives/scroll-animation.directive';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, ScrollAnimationDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnChanges, OnDestroy {
  /**
   * Projects that are production-ready, often with live links.
   * Expect Project.id, Project.name, Project.description, Project.technologies, etc.
   */
  @Input() productionProjects: Project[] = [];

  /**
   * Sample or demo projects to show experiments or prototypes.
   */
  @Input() sampleProjects: Project[] = [];

  // Holds the current index for rotating images per project id
  private currentImageIndex: { [projectId: string]: number } = {};

  // Timers for any project that has multiple images
  private rotationTimers = new Map<string, number>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Reset and reinitialize timers when input projects change.
    this.clearAllTimers();

    const allProjects = [...(this.productionProjects || []), ...(this.sampleProjects || [])];
    for (const project of allProjects) {
      const images = project.imageUrls && project.imageUrls.length ? project.imageUrls : [];
      if (images.length > 1) {
        // initialize index
        this.currentImageIndex[project.id] = 0;
        // start rotation timer for this project
        const timerId = window.setInterval(() => {
          const idx = (this.currentImageIndex[project.id] + 1) % images.length;
          this.currentImageIndex[project.id] = idx;
          // trigger a change detection so Angular updates the template
          this.cdr.detectChanges();
        }, 1500);
        this.rotationTimers.set(project.id, timerId);
      } else {
        // ensure index is 0 for single-image projects
        this.currentImageIndex[project.id] = 0;
      }
    }
  }

  ngOnDestroy(): void {
    this.clearAllTimers();
  }

  /** Clear all rotation timers */
  private clearAllTimers(): void {
    this.rotationTimers.forEach((timer) => clearInterval(timer));
    this.rotationTimers.clear();
    this.currentImageIndex = {};
  }

  /**
   * Return currently displayed image for a project (rotates if imageUrls length > 1)
   */
  getProjectImage(project: Project): string | undefined {
    const images = project.imageUrls && project.imageUrls.length ? project.imageUrls : [];
    const idx = this.currentImageIndex[project.id] ?? 0;
    return images[idx];
  }

}
