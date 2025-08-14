import { ModalController } from '@ionic/angular/standalone';
/* eslint-disable indent */
/* eslint-disable init-declarations */
import { inject, Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular/standalone";
import { EscalaEditorComponent } from "src/app/departments/escala-editor/escala-editor.component";

@Injectable({
  providedIn: "root",
})
export class UtilsService {
  modalCtrl = inject(ModalController);

  constructor(private toastController: ToastController) { }
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

  async openModal() {
    const modalRef = await this.modalCtrl.create({
      component: EscalaEditorComponent,
      componentProps: {
        escala: null
      }
    });

    modalRef.present();

    // const { role, data } = await modalRef.onWillDismiss();



    // // Aguardar o modal ser fechado
    // const { data, role } = await modal.onWillDismiss();

    // if (role === 'confirm' && data) {
    //   // Adicionar a nova escala à lista
    //   this.escalas.push(data);

    //   // Atualizar localStorage
    //   this.saveEscalasToStorage();

    //   console.log('Nova escala criada:', data);
    // }
  }
}