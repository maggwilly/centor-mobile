import {Headers} from "@angular/http";

export const apiConfig = {
  headers : new Headers({ 'Content-Type': 'application/json'}),
  baseUrl : 'http://127.0.0.1:8000/v1/'
}
