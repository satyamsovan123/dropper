import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UploadFilesComponent } from './components/upload-files/upload-files.component';
import { ViewFilesComponent } from './components/view-files/view-files.component';
import { ErrorComponent } from './components/error/error.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'upload-files', component: UploadFilesComponent },
  { path: 'view-files', component: ViewFilesComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
