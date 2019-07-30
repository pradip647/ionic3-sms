import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = "HomePage";

  pages: Array<{title: string, component: any}>;
  alltypes: Array<{title: any, name: any,iconName:any}>;
  activeIndex:number;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public androidPermissions: AndroidPermissions,
    public menuCtrl:MenuController,
    public zone:NgZone
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: "HomePage" },
      // { title: 'List', component: "ListPage" }
    ];
    this.alltypes = [
      { iconName :'albums', title: "read",name:'Inbox (Read)'},
      { iconName :'md-mail-open', title: "unread",name:'Inbox (Unread)'},
      { iconName :'md-send', title: 'sent',name:'Sent'},
      { iconName :'md-copy', title: 'draft',name:'Draft'},
      { iconName :'md-pint', title: 'outbox',name:'Outbox'},
      { iconName :'md-warning', title: 'failed',name:'Failed'},
    ]
    // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if(this.platform.is('android')) {
        this.statusBar.styleBlackOpaque();
      }else{this.statusBar.styleDefault();}
      this.splashScreen.hide();
    
      if(this.platform.is('cordova')){
        this.addPermission();
      }
      
    });
  }

  addPermission(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then(
      success => console.log('Permission granted'),
    err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
    );
    
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  changeType(i,item){
    this.zone.run(()=>{
      this.activeIndex = i;  
      this.menuCtrl.close();
      this.nav.setRoot("HomePage", {messageType:item.title});
    })
    
    
    console.log(i);
  }
}
