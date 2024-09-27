import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainAppComponent } from './pages/main-app/main-app.component';
import { FloatButtonsComponent } from './pages/main-app/components/float-buttons/float-buttons.component';
import { PopupContentComponent } from './pages/main-app/components/popup-content/popup-content.component';

@NgModule({
  declarations: [
    AppComponent,
    MainAppComponent,
    FloatButtonsComponent,
    PopupContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
