import {Headers} from "@angular/http";

export const apiConfig = {
  headers : new Headers({ 'Content-Type': 'application/json'}),
  baseUrl : 'http://api.cconcours.com/v1/'
}

export const payGardeConfig ={
  serviceId:'62828464-fc9c-4908-a6ff-f0b849aeca70',
  apiKey:'UFJPRDoxYTA2ODQxNy0yNjk1LTQzNjUtOTMzZS03YWRlY2YwYTkxY2Y='
}
