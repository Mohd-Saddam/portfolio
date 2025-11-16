import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/portfolio.model';
import { ScrollAnimationDirective } from '../../directives/scroll-animation.directive';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, ScrollAnimationDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  /**
   * Projects that are production-ready, often with live links.
   * Expect Project.id, Project.name, Project.description, Project.technologies, etc.
   */
  @Input() productionProjects: Project[] = [];

  /**
   * Sample or demo projects to show experiments or prototypes.
   */
  @Input() sampleProjects: Project[] = [];
}
