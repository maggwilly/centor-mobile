import { Component } from '@angular/core';
import { NavController, IonicPage, ViewController  } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-accordion-list',
  templateUrl: 'accordion-list.html',
})
export class AccordionListPage {
  items = [
    {
      name: 'Score',
      description: "le <b>score</b> représente la moyenne obtenue à l'issue de la dernière évaluation."
    },
    {
      name: 'Objectifs',
      description: "C'est le nombre d'objectifs déjà <b>assimilés</b> par rapport au total prévu dans le programme."
    },
    {
      name: 'Programme',
      description: "C'est la proportion du programme déjà <b>couvert</b> par rapport au programme de préparation prévu. "
    },
    {
      name: 'Rang',
      description: "Votre <b>position actuelle</b> par rapport aux autres futures concourants évalués au même moment."
    },
    {
      name: 'Challengeurs',
      description: "C'est le nombre de concourants actuellement aux <b>même niveau</b> de préparation que vous."
    }
    ,
    {
      name: 'Candidats',
      description: "Il s'agit du <b>nombre officiel</b> de candidats actuellement inscrits au même concours."
    }
    ,
    {
      name: 'Reuissite',
      description: "Taux de réussite déterminé par le nombre total de personnes ayant obtenu un score supérieur ou égale à 10"
    }

    ,
    {
      name: 'Temps',
      description:  "Le temps total mis pour terminer la dernière séance d'évaluation."
    }   
  ]
  constructor(public navCtrl: NavController, public viewCtrl: ViewController) { }

  dismiss(data?: any) {
    this.viewCtrl.dismiss(data);
  }  

}
