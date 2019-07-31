import { IonicPage, NavParams } from 'ionic-angular';
import { Component, NgZone } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Events } from 'ionic-angular';
//plugin 
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

declare var SMS:any;

/*
let filter = {
  box : 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
  // following 4 filters should NOT be used together, they are OR relationship
 read : 1, // 0 for unread SMS, 1 for SMS already read
 // _id : 1234, // specify the msg id
 // address : '+9876543210', // sender's phone number
//  body : 'This is a test SMS', // content to match
  
  // following 2 filters can be used to list page up/down
  indexFrom : 0, // start from index 0
  maxCount : this.lastvalueCount, // count of SMS to return each time
}
*/

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  public allUnreadMSG:any=[];
  public showloading:boolean = true;
  public lastvalueCount:number = 10;

  public filterBox:any = "inbox";
  public filterRead:any = 0;
  public headerTitle:any="Unread";

  constructor(
    public navCtrl: NavController,
    private admobFree: AdMobFree,
    public platform:Platform,
    public zone:NgZone,
    public events: Events,
    public navparams:NavParams
  ) {

    this.showloading = true;
    let data = this.navparams.get('messageType');
    if(data){
      if(data == "read" || data == "unread"){
          this.filterBox = 'inbox';
          this.filterRead = data == "read" ? 1 : 0;
          this.headerTitle = data == "read" ? "Read" : "Unread";
      }else{
          this.filterBox = data;
          this.headerTitle = data;
      }
    }else{
      this.filterBox = 'inbox';
      this.filterRead = 0;
    }

    if(this.platform.is('cordova')){
      this.ReadListSMS();
    }

  }

  ionViewWillEnter(){
    if(this.platform.is('cordova')){
      this.prepareAllAds()
    }
  }

  

  /* GOOGLE AD-MOB Implementtion */
  // ca-app-pub-4296647029451731~4583992167
  prepareAllAds(){
    this.platform.ready().then(() => {  
      const bannerConfig: AdMobFreeBannerConfig = {
        // id:'ca-app-pub-4296647029451731/1077251173',
        id:'ca-app-pub-4296647029451731/1773687885',
        // isTesting: false,
        autoShow: true,
       };
      
      this.admobFree.banner.config(bannerConfig);
      this.admobFree.banner.prepare().then(() => {
        console.log("Home screen : Banner ad prepare successfull")
        this.admobFree.banner.show();
      }).catch(e => console.log(e));
    });
  }
  /* GOOGLE AD-MOB Implementation */

  
  /* CORDOVA PLUGIN SMS Implementation for message read*/
  ReadListSMS(){
    this.platform.ready().then((readySource) => {
       // this.startWatchSMS();
        this.listSMS(this.lastvalueCount,null); 
    });
  }
  /* CORDOVA PLUGIN SMS Implementation */

  listSMS(lastcount:number,infiniteScroll:any) {
      if(infiniteScroll == null){this.allUnreadMSG=[]; this.showloading = true; }else{}
      var filter:any={}
      if(this.filterBox == "inbox"){
        filter = {
          box:this.filterBox,
          read : this.filterRead ? this.filterRead : 0, 
          indexFrom : 0,
          maxCount : this.lastvalueCount,
        }
      }else{
        filter = {
          box : this.filterBox, 
          indexFrom : 0,
          maxCount : this.lastvalueCount,
        }
      }
      
      if(SMS) SMS.listSMS(filter, function(data){
        if(data){
            for(let i=this.allUnreadMSG.length == 0 ? 0 : this.allUnreadMSG.length+1; i<data.length; i++){
                let temp:any = {};
                temp = data[i];
                temp.itemMark = false;
                this.zone.run(()=>{
                  this.allUnreadMSG.push(temp)
                }) 
            }
            setTimeout(() => {
              this.lastvalueCount = lastcount+10;
              if(infiniteScroll == null){ this.zone.run(()=>{this.showloading = false;}) }else{infiniteScroll.complete()}
            }, 2000);
            
          // this.deleteSMS(data)
          //this.restoreSMS(data)
        }
      }.bind(this), function(err){
        if(infiniteScroll == null){ this.showloading = false; }else{infiniteScroll.complete()}
      }.bind(this));
  }

    /* infinite scroll function */
    clickInfiniteScroll(infiniteScroll){
        this.listSMS(this.lastvalueCount,infiniteScroll);
    }

    /* Mark function */
    markFunc(index,event){
      this.zone.run(()=>{
          event.preventDefault();
          event.stopPropagation();
          this.allUnreadMSG[index].itemMark = ! this.allUnreadMSG[index].itemMark;
      });
    }

    /* Go to details page function */
    gotoMsgDetails(message){
      this.navCtrl.push('MessageDetailsPage',{details:message})
    }




  //=========================================================================================

  /* IonViewWillLeave function */
  ionViewWillLeave(){
    if(this.platform.is('cordova')){
    //   this.stopWatchSMS();
      this.admobFree.banner.hide();
    }
    
  }




    /* this function is called when any Message/Notification arrived */
  // startWatchSMS(){
  //   SMS.startWatch(function() {
  //       document.addEventListener('onSMSArrive', function(e:any) {
  //           var IncomingSMS = e.data;
  //           this.listSMS();
  //       }.bind(this));
  //   }.bind(this), function() {
  //     console.warn('smsreceive: failed to start watching');
  //   }.bind(this));    
  // }

  /* Close SMS Watch for Message/Notification arrived */
  // stopWatchSMS(){
  //   SMS.stopWatch(function() {
  //     //console.log("successfully stop watching")
  //  }, function() {
  //    console.warn('smsreceive: failed to start watching');
  //  });   
  // }


    /* Delete SMS */
    // deleteSMS(data){
    //   //console.log("all data in delete section : ", data);
    //   // let sms = data.pop();
    //   if(SMS) SMS.deleteSMS({
    //     // _id : sms["_id"]
    //     _id:data[0]["_id"]
    //   }, function( n ){
    //     //console.log("Message deleted index is  : ", n)
    //   }, function(err){
    //     //console.log("Message deleted error  : ",err);
    //   });
    // }

    /* Restore SMS */
    // restoreSMS(data){
    //   if(SMS) SMS.restoreSMS(data, function( n ){
    //     // clear the list if restore successfully
    //     //console.log("Restore SMS   : ", n)
    //   }, function(err){
    //     //console.log("Restore error   : ", err)
    //   });
    // }
  

    // reloadSMS(){
    //   this.showloading = true;
    //   this.listSMS();
    // }



}
