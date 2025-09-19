import { computed, Injectable, signal } from '@angular/core';

type ModalType = 'add-password' | 'view-password' | 'edit-password' | 'add-category' | 'update-data';


@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modal$ = signal(false);
  private title$ = signal('');
  private modalType$ = signal<ModalType | null>(null);
  private passwordId$ = signal<string>('');

  public modal = computed(() => this.modal$());
  public title = computed(() => this.title$());
  public modalType = computed(() => this.modalType$());
  public passwordId = computed(() => this.passwordId$());

  public showModal(condition: boolean) {
    this.modal$.set(condition);

    // Si se cierra el modal, limpiar datos
    if (!condition) {
      this.modalType$.set(null);
      this.passwordId$.set('');
    }
  }

  public setTitle(text: string) {
    this.title$.set(text);
  }

  public setModalType(type: ModalType) {
    this.modalType$.set(type);
  }

  public openAddPasswordModal() {
    this.setTitle('Add New Password');
    this.setModalType('add-password');
    this.passwordId$.set('');
    this.showModal(true);
  }

  public openViewPasswordModal(passwordId: string) {
    this.setTitle('Password Details');
    this.setModalType('view-password');
    this.passwordId$.set(passwordId);
    this.showModal(true);
  }

  public openAddCategoryModal(){
    this.setTitle('Add New Category');
    this.setModalType('add-category');
    this.passwordId$.set('');
    this.showModal(true);
  }
}
