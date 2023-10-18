import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PageNotFoundComponentComponent } from './page-not-found-component/page-not-found-component.component';

@NgModule({
  exports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  declarations: [
    PageNotFoundComponentComponent
  ]
})

export class MaterialModule {}