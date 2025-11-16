import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skill, SkillCategory } from '../../models/portfolio.model';
import { ScrollAnimationDirective } from '../../directives/scroll-animation.directive';

@Component({
  selector: 'app-skills',
  imports: [CommonModule, ScrollAnimationDirective],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {
  /**
   * Flat array of skills - may be used for a simple list view.
   * Example fields: name, icon, level
   */
  @Input() skills: Skill[] = [];

  /**
   * Skill items grouped in categories. Each category has a category name
   * and an array of Skill entries.
   */
  @Input() skillItems: SkillCategory[] = [];
}
