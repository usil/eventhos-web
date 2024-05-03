import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'safeJson'
})
export class SafeJsonPipe implements PipeTransform {
  transform(objToParse: Record<string, any>): string {
    return JSON.stringify(this.objectObfuscate(environment.rawSensibleParams, objToParse), null, 4);
  }

  objectDeepKeys(obj: Record<string, any>, foundKeys: any, sensibleParams: string[]){
    for (const [key, value] of Object.entries(obj)) {
      if(typeof value === 'object'){
        this.objectDeepKeys(value, foundKeys, sensibleParams);
      }else{
        for(var sensibleParam of sensibleParams){
          if(key.toUpperCase() == sensibleParam.toUpperCase()){
            obj[key] = "*****";
          }
        }
      }
    }
  }

  objectObfuscate(rawSensibleParams: any, object: Record<string, any>) {
    console.log(environment);

    if (!rawSensibleParams || !object || typeof object !== "object") {
        return object;
    }
    var sensibleParams = rawSensibleParams.replace(/\s+/g, '').split(",");
    let keys: string[] = [];
    this.objectDeepKeys(object, keys, sensibleParams);

    return object;
  }
}