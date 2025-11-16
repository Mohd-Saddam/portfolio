import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalInfo, SocialLink } from '../../models/portfolio.model';
import { ScrollAnimationDirective } from '../../directives/scroll-animation.directive';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, ScrollAnimationDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  /** Personal contact details (email, phone, links) - optional */
  @Input() personalInfo?: PersonalInfo;

  /** List of social links to display (GitHub, LinkedIn, etc.) */
  @Input() socialLinks: SocialLink[] = [];

  /**
   * Map a platform name to a simplified icon (emoji by default)
   * - platform: The name of the social platform (e.g., 'GitHub', 'LinkedIn')
   * Returns a single char or fallback icon to show in a text-based context.
   */
  getSocialIcon(platform: string): string {
    const icons: { [key: string]: string } = {
      'LinkedIn': '💼',
      'GitHub': '💻',
      'Twitter': '🐦',
      'Email': '📧',
      'Facebook': '👤',
      'Instagram': '📷'
    };
    return icons[platform] || '🔗';
  }
}

/**
 * ContactComponent
 * - Renders contact phone, email and social links
 * - socialLinks is optional if you want to display platform links
 */

/**
 * Note: getSocialIcon is a helper that maps platform names to emoji icons.
 * You can replace it with an SVG icon lookup if you prefer visual icons.
 */
