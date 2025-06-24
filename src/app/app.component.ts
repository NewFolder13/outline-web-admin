import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {NgbToast} from "@ng-bootstrap/ng-bootstrap";
import {ToastService} from "./core/services/toast.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgbToast],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'outline-web-admin';

  constructor(public readonly toastService: ToastService) {
  }
}
