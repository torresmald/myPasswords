import { Injectable, signal } from '@angular/core';
import { ModalType } from '../interfaces/modal.interface';
import { Password } from '@/passwords/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modal$ = signal(false);
  private title$ = signal('');
  private modalType$ = signal<ModalType | null>(null);
  private passwordId$ = signal<string>('');
  private categoryId$ = signal<string>('');
  private password$ = signal<string>('');

  public modal = this.modal$.asReadonly();
  public title = this.title$.asReadonly();
  public modalType = this.modalType$.asReadonly();
  public passwordId = this.passwordId$.asReadonly();
  public categoryId = this.categoryId$.asReadonly();
  public password = this.password$.asReadonly();

  public showModal(condition: boolean = false) {
    this.modal$.set(condition);

    // Si se cierra el modal, limpiar datos
    if (!condition) {
      this.setTitle('');
      this.setModalType(null);
      this.passwordId$.set('');
      this.password$.set('');
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
    this.passwordId$.set('');
    this.showModal(true);
  }

  public openViewPasswordModal(passwordId: string) {
    this.setTitle('Password Details');
    this.setModalType('view-password');
    this.passwordId$.set(passwordId);
    this.showModal(true);
  }

  public openViewPasswordModalData(password: Password) {
    this.setTitle('Password Data');
    this.setModalType('view-password-data');
    this.passwordId$.set(password.id);
    this.password$.set(password.password!);
    this.showModal(true);
  }

  public openAddCategoryModal() {
    this.setTitle('Add New Category');
    this.setModalType('add-category');
    this.passwordId$.set('');
    this.showModal(true);
  }

  public openUpdateDataCategoryModal(categoryId: string) {
    this.setTitle('Update Category');
    this.setModalType('update-data-category');
    this.categoryId$.set(categoryId);
    this.showModal(true);
  }

  public openUpdateDataPasswordModal(passwordId: string) {
    this.setTitle('Update Password');
    this.setModalType('update-data-password');
    this.passwordId$.set(passwordId);
    this.showModal(true);
  }

  public openDeletePassword(passwordId: string) {
    this.setTitle('Are you sure you want to delete the Password?');
    this.setModalType('delete-password');
    this.passwordId$.set(passwordId);
    this.showModal(true);
  }

  public openDeleteCategory(categoryId: string) {
    this.setTitle('Are you sure you want to delete the Category?');
    this.setModalType('delete-category');
    this.categoryId$.set(categoryId);
    this.showModal(true);
  }

  public resetModal() {
    this.setTitle('');
    this.setModalType(null);
    this.showModal(false);
    this.passwordId$.set('');
    this.password$.set('');
    this.password$.set('');
  }
}
