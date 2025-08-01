/* eslint-disable indent */
/* eslint-disable init-declarations */
import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular/standalone";

@Injectable({
  providedIn: "root",
})
export class UtilsService {  
  constructor(private toastController: ToastController) {}
    orderBy(array: any[], prop: string, type = "dec") {
    return array.sort((a: any, b: any) => {
      if (a[prop] === null || a[prop] === "null") {
        a[prop] = "";
      }
      if (b[prop] === null || b[prop] === "null") {
        b[prop] = "";
      }
      if (type === "dec") {
        return String(a[prop]).toUpperCase() < String(b[prop]).toUpperCase()
          ? 1
          : String(a[prop]).toUpperCase() === String(b[prop]).toUpperCase()
            ? 0
            : -1;
      } else {
        return String(a[prop]).toUpperCase() > String(b[prop]).toUpperCase()
          ? 1
          : String(a[prop]).toUpperCase() === String(b[prop]).toUpperCase()
            ? 0
            : -1;
      }
    });
  }

  async showToast(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'bottom',
    });
    await toast.present();
  }
}