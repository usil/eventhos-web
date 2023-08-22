import {
    AbstractControl,
  } from '@angular/forms';

export class CommonService {
  
  constructor() {}

  secretPatternValidator(control: AbstractControl) {

    if(control.value==null) return null;

    if (control.value.length < 8) {
      return { secretInvalid: "Your secret must be at least 8 characters"};
    }
    if (control.value.length > 120) {
        return { secretInvalid: "Your secret must be at max 120 characters"};
    }
    if (control.value.search(/[a-z]/) < 0) {
        return { secretInvalid: "Your secret must contain at least one lower case letter."};
    }
    if (control.value.search(/[A-Z]/) < 0) {
        return { secretInvalid: "Your secret must contain at least one upper case letter."};
    }
    
    if (control.value.search(/[0-9]/) < 0) {
        return { secretInvalid: "Your secret must contain at least one digit."};
    }
    if (control.value.search(/[!@#\$%\^&\*_-]/) < 0) {
        return { secretInvalid: "Your secret must contain at least special char: ! @ # $ % ^ & * _ -"};
    }
    return null;
  }

  severalMailsPatternValidator(control: AbstractControl) {

    if(control.value==null || control.value=="") return null;

    //TODO: tld used in mails could be more than 10 chars length  and there is no limit of levels
    // improve this regex
    
    if (control.value.search(/^[a-zA-Z_\d\.]+@[a-zA-Z_\.]+?\.[a-zA-Z]{2,10}(\s*,\s*[a-zA-Z_\d\.]+@[a-zA-Z_\.]+?\.[a-zA-Z\.]{2,10})*$/) < 0) {
      return { invalidMailsPattern: "It should contains valid emails separated with comas"};
    }

    if (control.value.length > 190) {
      return { invalidMailsPattern: "Your mails together must be at max 190 characters"};
    }    

    return null;
  }

}
