import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Education } from '../../models/portfolio.model';
import { ScrollAnimationDirective } from '../../directives/scroll-animation.directive';

@Component({
  selector: 'app-education',
  imports: [CommonModule, ScrollAnimationDirective],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss'
})
export class EducationComponent {
  /** The educational background to display, ordered by date if available. */
  @Input() education: Education[] = [];
}
