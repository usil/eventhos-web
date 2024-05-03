import { NgModule } from '@angular/core';
import { SafeJsonPipe } from './safe-json.pipe';
@NgModule({
  declarations: [SafeJsonPipe],
  exports: [SafeJsonPipe]
})
export class SharedModule {}
