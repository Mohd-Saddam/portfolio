import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class NavbarComponent {
  themeService = inject(ThemeService);
  isDarkTheme = this.themeService.isDarkTheme;

  // Mobile drawer state
  /** Whether the mobile navigation drawer is open */
  mobileMenuOpen = false;

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenu(): void {
    this.mobileMenuOpen = false;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}

/**
 * NavbarComponent
 * - toggleMenu opens the mobile drawer on small devices
 * - closeMenu closes the drawer
 * - toggleTheme delegates to ThemeService to switch themes
 */
