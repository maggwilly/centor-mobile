
export class Utils {

/**Evalue une partie traitees*/
static setScore(partie:any,ref?:{uid:any}){
if( !this.canHasScore(partie))
      return !ref?null:new Promise(resolve=>null);
    let bareme:number=this.bareme(partie);
   let score:number=0; let trueNb:number=0;let failedNb:number=0;
   let gTime:number=0;
   let firstScore:number=0;
   let analyse:any=partie.analyse?partie.analyse:{};
 
//evaluation des scores et du temps
partie.questions.forEach(element => {
   element.nonSaved=true;
  if(this.isCorrect(element)){
        score+=bareme;
        trueNb+=1;
        }
  else
        failedNb+=1;
   if(this.isFirstCorrect(element))
        firstScore+=bareme; 
        gTime+=(element.restOfTime)?element.time*60*1000-element.restOfTime:0;
         //console.log(element.time+' '+element.restOfTime);  
  });
analyse.note=score; 
analyse.firstNote=firstScore;
analyse.time=gTime;
analyse.textTime=this.format(gTime);
analyse.trueNb=trueNb;
analyse.failedNb=failedNb;
analyse.objectif=trueNb*100/partie.questions.length;
partie.analyse=analyse;
/*if(ref){ 
  analyse.saved=true;
  return ref.af.database.object('/parties/result/'+partie.id+'/'+partie.matiere.concours.id+'/'+ref.uid).update(partie.analyse); 
 }*/
  return  analyse; 
}

static bareme(partie:any):number{
  let bareme=0;
 if((partie.questions&&partie.questions.length)) 
     bareme=20/partie.questions.length;
 return bareme;
}



/**Evalue une matiere en fonction des parties considerees comme faites
 * L'evaluation ne prend en compte que les prties deja traitees et ignore celle pas encore traitees
 */
static setNotes(matiere:any,ref?:{uid:any}){
      if(!this.canHasNote(matiere))
           return !ref?null:new Promise(resolve=>null);

 let score:number=0;
 let   nbreParties:number=0, objectif:number=0; let analyse:any={};
 matiere.parties.forEach(partie => {
       if(this.canHasScore(partie)){
          if(!partie.analyse)
               this.setScore(partie);
           nbreParties+=1;
           score+=partie.analyse.note;
           objectif+=partie.analyse?partie.analyse.objectif:0;
  
       }
  });
 analyse.note=(nbreParties)?score/nbreParties:null;
 analyse.objectif=(matiere.parties.length)?(objectif/matiere.parties.length):null;
 analyse.programme=(matiere.parties.length)?(nbreParties*100/matiere.parties.length):null;
 matiere.analyse=analyse;
  matiere.analyse=analyse;
 
/*if(ref){ 
  analyse.saved=true;
  return ref.af.database.object('/matieres/result/'+matiere.id+'/'+matiere.concours.id+'/'+ref.uid).update(matiere.analyse); 
}  */
  return  analyse; 
}



static setData(concours:any,ref?:{uid:any}){
             if(!this.canHasData(concours))
                return !ref?null:new Promise(resolve=>null);   
      let programme:number=0, objectif:number=0, score:number=0,coef:number=0;  let analyse:any={};
     concours.matieres.forEach(matiere => {
              if(!matiere.analyse)
                  this.setNotes(matiere);
              programme+=matiere.analyse?matiere.analyse.programme:0;
              objectif+=matiere.analyse?matiere.analyse.objectif:0;
              score+=matiere.analyse?matiere.analyse.note*matiere.poids:0;
              coef+=matiere.poids; });
  
 //concours.programme=(programme/concours.matieres.length);
 analyse.programme=(programme/concours.matieres.length);
 analyse.note=coef?(score/coef):null
 analyse.objectif=(objectif/concours.matieres.length);
 concours.analyse=analyse;
/* if(ref){ 
  analyse.saved=true;
  return ref.af.database.object('/concours/result/'+concours.programme+'/'+concours.id+'/'+ref.uid).update(concours.analyse);  
}*/
 return  analyse;  
}

/*Parcours pour voir le corrigé*/
static hasAmswer(question:any):boolean{
    
       return (question.amswer)?true:false;
}


/**Verifie si une partie peut etre considere comme faite ou pas */
static canHasScore(partie:any):boolean{

      if(partie&&partie.analyse)
          return true;
      let canHas:boolean=false;
      if(partie&&partie.questions&&partie.questions.length){
             partie.questions.forEach(question => {
           if(this.hasAmswer(question))
           canHas=  true;
           });
      }        
 //console.log('canHasScore '+canHas);
   return canHas;
}

static canHasNote(matiere:any):boolean{
        if(matiere&&matiere.analyse)
               return true;
       let canHas:boolean=false;
       if(matiere &&matiere.parties&& matiere.parties.length){
             matiere.parties.forEach(partie => {
              if( this.canHasScore(partie))
                 canHas=  true;
        });
      }
//  console.log('canHasNote '+canHas);
   return canHas;
}

static canHasData(concours:any):boolean{
          if(concours&&concours.analyse)
               return true;
       let canHas:boolean=false;
     if(concours &&concours.matieres &&concours.matieres.length){
  concours.matieres.forEach(matiere => {
     if( this.canHasNote(matiere))
           canHas=  true;
  });
      }

 
   return canHas;
}


/*Vrai si la reponse est celle de choisie */
static isThis(question:any,amswer:any):boolean{
  return (question.amswer==amswer);
}


/*Vrai si la reponse choisie est la bonne */
static isCorrect(question:any,amswer?:any):boolean{
      return amswer?(question.rep==amswer ):question.rep==question.amswer;
}


/*Vrai si la reponse choisie est la bonne */
static isFirstCorrect(question:any):boolean{
      return (question.rep==question.firstAmswer);
}

/**Affiche le temps en ms sous un format text */
static format(s,hrSep='h ',minSep='m'):string{
   let ms=s%1000;
   s=(s-ms)/1000;
   let secs=s%60;
   s=(s-secs)/60;
   let mins=s%60;
   let hrs=(s-mins)/60;mins
if(!hrs&&mins>0)
   return mins+minSep+secs;
if(!hrs&&!mins&&secs>0)
   return secs+'s';
if(!hrs&&!mins&&!secs)
   return ms+'ms';
return hrs+ hrSep+mins;
}

static remaindDays(dateText:string):number{
   let date=new Date(dateText).getTime();
   let now =Date.now();
   let remaindTime=date-now;
   let remaindDays=remaindTime%86400000;
    remaindDays=(remaindTime-remaindDays)/86400000;
return remaindDays;
}

}