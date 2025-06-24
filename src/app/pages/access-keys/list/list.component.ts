import {Component, OnInit, TemplateRef} from '@angular/core';
import {KeyManagerService} from "../../../core/services/key-manager.service";
import {AccessKey} from "../../../core/models/key.model";
import {CommonModule} from "@angular/common";
import {NgIcon, provideIcons} from "@ng-icons/core";
import {heroTrashSolid} from "@ng-icons/heroicons/solid";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgbModal, NgbModalRef, NgbProgressbar} from "@ng-bootstrap/ng-bootstrap";
import {lastValueFrom} from "rxjs";
import {ToastService} from "../../../core/services/toast.service";
import {heroPlusMini} from "@ng-icons/heroicons/mini";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    NgIcon,
    ReactiveFormsModule,
    NgbProgressbar
  ],
  viewProviders: [provideIcons({heroTrashSolid, heroPlusMini})],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {


  accessKeys: AccessKey[] = [];
  metrics: any;

  constructor(private readonly keyManagerService: KeyManagerService,
              private readonly modalService: NgbModal,
              private readonly toastIt: ToastService) {
  }


  async ngOnInit() {
    await this.getAll()
    await this.getMetrics()
  }

  async getAll() {
    this.accessKeys = await lastValueFrom(this.keyManagerService.getAll())
  }

  async getMetrics() {
    this.metrics = await lastValueFrom(this.keyManagerService.getDataUsage());
  }

  calcMetricPercent(max: number, current: number){
    return Math.ceil((current / max) * 100);
  }

  modalRef?: NgbModalRef;

  openModal(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content);
  }

  async copyShadowSocks(key: AccessKey) {
    await navigator.clipboard.writeText(key.accessUrl);
    this.toastIt.show({
      text: `لینک shadowsocks کاربر ${key.name.split('-')[0]} کپی شد`,
      classname: 'bg-secondary text-light text-end'
    });
  }

  async copyOutline(key: AccessKey) {
    await navigator.clipboard.writeText(key.outlineUrl);
    this.toastIt.show({
      text: `لینک outline کاربر ${key.name.split('-')[0]} کپی شد`,
      classname: 'bg-success text-light text-end'
    });
  }

  async showDataUsage(key: AccessKey) {
    this.keyManagerService.getDataUsage().subscribe({
      next: (resp) => {
        console.log(resp);
      }
    })
    /*this.toastIt.show({
      text: `لینک outline کاربر ${key.name.split('-')[0]} کپی شد`,
      classname: 'bg-success text-light text-end'
    });*/
  }

  createKeyFormGroup: FormGroup = new FormGroup<any>({
    'name': new FormControl(null, [Validators.required]),
    'method': new FormControl('chacha20-ietf-poly1305'),
    'password': new FormControl(null),
    'port': new FormControl(null, [Validators.required]),
    'limit': new FormControl(null),
  })

  createKey() {
    if (this.createKeyFormGroup.valid) {
      const payload = {
        ...this.createKeyFormGroup.value,
        name: this.createKeyFormGroup.value['name'] + '-' + (new Date()).toLocaleDateString('en-US')
      }
      this.keyManagerService.create(payload).subscribe({
        next: async (resp) => {
          this.modalRef?.close();
          await this.getAll();
          await this.getMetrics()
          this.toastIt.show({text: 'کلید با موفقیت ایجاد شد', classname: 'bg-success text-light text-end'});
        }
      });
    } else {
      console.log(this.createKeyFormGroup.value);
    }
  }


  deleteKey(key: AccessKey) {
    this.keyManagerService.delete(key.id).subscribe({
      next: async (resp) => {
        this.modalRef?.close();
        await this.getAll();
        await this.getMetrics()
        this.toastIt.show({
          text: `کلید کاربر ${key.name.split('-')[0]} حذف شد`,
          classname: 'bg-danger text-light text-end'
        });
      }
    })
  }


}
