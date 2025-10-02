import { Injectable, signal } from '@angular/core';
import { ModalType } from '../interfaces/modal.interface';
import { Password } from '@/passwords/interfaces';
import { Category } from '@/category/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modal$ = signal(false);
  private title$ = signal('');
  private modalType$ = signal<ModalType | null>(null);
  private category$ = signal<Category | null>(null);
  private password$ = signal<Password | null>(null);
  private method$ = signal<'email' | 'whatsapp'>('email');

  public modal = this.modal$.asReadonly();
  public title = this.title$.asReadonly();
  public modalType = this.modalType$.asReadonly();
  public category = this.category$.asReadonly();
  public password = this.password$.asReadonly();
  public method = this.method$.asReadonly();

  public showModal(condition: boolean = false) {
    this.modal$.set(condition);

    // Si se cierra el modal, limpiar datos
    if (!condition) {
      this.setTitle('');
      this.setModalType(null);
      this.password$.set(null);
      this.category$.set(null);
    }
  }

  public setTitle(text: string) {
    this.title$.set(text);
  }

  public setModalType(type: ModalType | null) {
    this.modalType$.set(type);
  }

  public openAddPasswordModal() {
    this.setTitle('Add New Password');
    this.setModalType('add-password');
    this.password$.set(null);
    this.showModal(true);
  }

  public openViewPasswordModal(password: Password, method: 'email' | 'whatsapp') {
    this.setTitle('Password Details');
    this.setModalType('view-password');
    this.password$.set(password);
    this.method$.set(method);
    this.showModal(true);
  }

  public openViewPasswordModalData(password: Password) {
    this.setTitle('Password Data');
    this.setModalType('view-password-data');
    this.password$.set(password);
    this.showModal(true);
  }

  public openAddCategoryModal() {
    this.setTitle('Add New Category');
    this.setModalType('add-category');
    this.password$.set(null);
    this.showModal(true);
  }

  public openUpdateDataCategoryModal(category: Category) {
    this.setTitle('Update Category');
    this.setModalType('update-data-category');
    this.category$.set(category);
    this.showModal(true);
  }

  public openUpdateDataPasswordModal(password: Password) {
    this.setTitle('Update Password');
    this.setModalType('update-data-password');
    this.password$.set(password);
    this.showModal(true);
  }

  public openDeletePassword(password: Password) {
    this.setTitle('Are you sure you want to delete the Password?');
    this.setModalType('delete-password');
    this.password$.set(password);
    this.showModal(true);
  }

  public openDeleteCategory(category: Category) {
    this.setTitle('Are you sure you want to delete the Category?');
    this.setModalType('delete-category');
    this.category$.set(category);
    this.showModal(true);
  }

  public resetModal() {
    this.setTitle('');
    this.setModalType(null);
    this.showModal(false);
    this.password$.set(null);
    this.category$.set(null);
  }
}
