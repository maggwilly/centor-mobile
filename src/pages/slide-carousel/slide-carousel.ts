import { Component, ViewChild  } from '@angular/core';

import { NavController, Slides, IonicPage, ViewController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-slide-carousel',
  templateUrl: 'slide-carousel.html'
})
export class SlideCarouselPage {
  @ViewChild('mySlider') slider: Slides;
  mySlideOptions = {
   // slidesPerView: 'auto',
  //  watchSlidesVisibility: true,
   centeredSlides: true,
  // observer: true,
  //  passiveListeners: false,
    // loop: true,
   //  lazyLoading: true,
    spaceBetween: 9
  };

  city1: any = {
    name: "Accedez à l'ensemble des offres disponibles",
    image: 'assets/images/help/om1.png',
  };

  city2: any = {
    name: "Choisir parmi les offres celle qui vous convient",
    image: 'assets/images/help/om2.png',
  };

  city3: any = {
    name: 'Composez le #150*4*4*VOTRE_CODE_SECRET# sur votre télephone',
    image: 'assets/images/help/om3.png',
  };

  city4: any = {
    name: 'Obtenir un  code de paiment de 06 chiffres par SMS.',
    image: 'assets/images/help/om4.png',
  };
  city5: any = {
    name: 'Accédez à la page de paiment, remplir les champs et validez',
    image: 'assets/images/help/om5.png',
  };

  city6: any = {
    name: 'Recevez la confirmation de votre paiment par SMS.',
    image: 'assets/images/help/om6.png',
  };

  // Starting with an empty slider
  citiesSlides: any = [];

  // cities: any = {city1, city2, city3, city4};
  cities: any = [];

  // water: any = {water1, water2, water3, water4, water5, water6, water7};
  water: any = [];

  toggle: number = 0;

  constructor(public navCtrl: NavController , public viewCtrl: ViewController,) {
    this.cities = [this.city1, this.city2, this.city3, this.city4, this.city5, this.city6];
    this.citiesSlides = this.cities;
  }

  dismiss(data?: any) {
    this.viewCtrl.dismiss(data);
  }  

  currentIndex = 0;

  nextSlide() {
    this.slider.slideNext();
  }

  previousSlide() {
    this.slider.slidePrev();
  }

  onSlideChanged() {
    this.currentIndex = this.slider.getActiveIndex();
    console.log('Slide changed! Current index is', this.currentIndex);
  }

}
