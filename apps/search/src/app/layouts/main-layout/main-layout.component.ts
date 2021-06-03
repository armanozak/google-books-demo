import { CommonModule } from '@angular/common';
import { Component, Inject, NgModule, Optional } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ToolbarColor } from '../common/models/toolbar-color.model';
import { TOOLBAR_COLOR } from '../common/tokens/toolbar-color.token';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  public readonly toolbarColor: ToolbarColor;

  constructor(@Optional() @Inject(TOOLBAR_COLOR) toolbarColor: ToolbarColor) {
    this.toolbarColor = toolbarColor || ToolbarColor.Primary;
  }
}

@NgModule({
  exports: [MainLayoutComponent],
  declarations: [MainLayoutComponent],
  imports: [CommonModule, RouterModule, MatToolbarModule],
})
export class MainLayoutModule {}
