import { Component } from "@angular/core";
import { VerificationWidgetComponent } from "./verification-widget.component";
import { environment } from "../environments/environment";
import type { WebSdkCompleteResult, WebSdkError, WebSdkEvent } from "./legitimuz";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [VerificationWidgetComponent],
  template: `
    <app-verification-widget
      [sdkUrl]="sdkUrl"
      (ready)="status = 'pronto'"
      (event)="onEvent($event)"
      (complete)="onComplete($event)"
      (cancel)="status = 'cancelado'"
      (error)="onError($event)"
    ></app-verification-widget>

    <p>{{ status }}</p>
    <ul>
      @for (entry of log; track $index) {
        <li>{{ entry }}</li>
      }
    </ul>
  `,
})
export class AppComponent {
  sdkUrl = environment.sdkUrl;
  status = "montando";
  log: string[] = [];

  onEvent(e: WebSdkEvent) {
    this.log.push(e.type);
  }

  // "o fluxo terminou", não "deu certo": status é "submitted" ou "abandoned"
  onComplete(r: WebSdkCompleteResult) {
    this.status = `fim: ${r.status}`;
  }

  onError(e: WebSdkError) {
    this.status = `erro ${e.code}`;
    this.log.push(e.user_message);
  }
}
