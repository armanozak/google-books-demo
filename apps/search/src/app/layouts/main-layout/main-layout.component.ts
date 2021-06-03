import { CommonModule } from '@angular/common';
import { Component, Inject, NgModule, Optional } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { TOOLBAR_COLOR } from '../common/tokens/toolbar-color.token';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  public readonly toolbarColor?: ThemePalette;

  constructor(@Optional() @Inject(TOOLBAR_COLOR) toolbarColor: ThemePalette) {
    this.toolbarColor = toolbarColor;
  }
}

@NgModule({
  exports: [MainLayoutComponent],
  declarations: [MainLayoutComponent],
  imports: [CommonModule, RouterModule, MatToolbarModule],
})
export class MainLayoutModule {}
