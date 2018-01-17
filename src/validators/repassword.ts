import { FormControl } from '@angular/forms';

export class RepasswordValidator {

    static isValid(control: FormControl){
      if (control.value == control.root.value['password']) {
        console.log('passwords  match');
        return null;
    } 
      return {"invalidRepassword": true};
    }

}