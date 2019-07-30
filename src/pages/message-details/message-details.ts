import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { File } from '@ionic-native/file';
//pdf
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { FileOpener } from '@ionic-native/file-opener';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@IonicPage()
@Component({
  selector: 'page-message-details',
  templateUrl: 'message-details.html',
})
export class MessageDetailsPage {
  public messageDetails:any;
  public pdfObj:any;
  public loading:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events,
    public platform:Platform,
    private file: File,
    public plt:Platform,
    private fileOpener: FileOpener,
    public loadingCtrl:LoadingController
  ) {
    this.messageDetails = this.navParams.get('details');
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Preparing PDF ...'
    });
    this.loading.present();
  }

  hideLoading(){
    this.loading.dismiss();
  }


  printFunc(){
    this.showLoading();

    var send_date = new Date(this.messageDetails.date_sent);
    var docDefinition = {
      content: [
        {
          text: this.messageDetails.address,
          style: 'header'
        },
        send_date,
        this.messageDetails.body
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.downloadPdf();

  }

  /* Download PDF */
  downloadPdf(){
    if (this.plt.is('cordova')) {
      // if (this.plt.is('ios')) {
      //     this.pdfObj.getBuffer((buffer) => {
      //         var blob = new Blob([buffer], { type: 'application/pdf' });
      //         this.file.writeFile(this.file.dataDirectory , this.messageDetails.address+'.pdf', blob, { replace: true })
      //         .then(fileEntry => {
      //           console.log("download complete IOS : ", fileEntry)
      //         }).catch((error)=>{
      //           console.log("pdf download error : " , error)
      //         });
      //     });
      // }else 
      if (this.plt.is('android')) {
          this.pdfObj.getBuffer((buffer) => {
              var blob = new Blob([buffer], { type: 'application/pdf' });
              this.file.writeFile('file:///storage/emulated/0/download/' , this.messageDetails.address+'.pdf', blob, { replace: true })
              .then(fileEntry => {
                this.hideLoading();
                this.fileOpener.open(fileEntry.nativeURL, 'application/pdf')
                // nativeURL
                console.log("download complete ANDROID : ", fileEntry)
              }).catch((error)=>{
                this.hideLoading();
                console.log("pdf download error : " , error)
            });
          });
      } 
  }else{
    console.log("Platform is not cordova ..so download is not possible")
  }

  }

}
