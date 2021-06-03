import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TOOLBAR_COLOR } from './layouts/common/tokens/toolbar-color.token';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
  ],
  providers: [
    {
      provide: TOOLBAR_COLOR,
      useValue: 'primary',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
