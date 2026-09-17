import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from "@angular/core";
import type {
  LegitimuzWidgetHandle,
  WebSdkCancelResult,
  WebSdkCompleteResult,
  WebSdkError,
  WebSdkEvent,
} from "./legitimuz";

/** O único componente do app que toca em window.Legitimuz. */
@Component({
  selector: "app-verification-widget",
  standalone: true,
  template: `<div #container style="height: 640px"></div>`,
})
export class VerificationWidgetComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) sdkUrl!: string;

  @Output() ready = new EventEmitter<void>();
  @Output() event = new EventEmitter<WebSdkEvent>();
  @Output() complete = new EventEmitter<WebSdkCompleteResult>();
  @Output() cancel = new EventEmitter<WebSdkCancelResult>();
  @Output() error = new EventEmitter<WebSdkError>();

  @ViewChild("container") private container!: ElementRef<HTMLDivElement>;
  private handle?: LegitimuzWidgetHandle;

  // ngAfterViewInit é o primeiro momento em que o @ViewChild existe. Montar em ngOnInit
  // falharia, porque o <div> ainda não foi criado.
  ngAfterViewInit() {
    this.handle = window.Legitimuz.mount({
      sdkUrl: this.sdkUrl,
      target: this.container.nativeElement,
      onReady: () => this.ready.emit(),
      onEvent: (e) => this.event.emit(e),
      onComplete: (r) => this.complete.emit(r),
      onCancel: (r) => this.cancel.emit(r),
      onError: (e) => this.error.emit(e),
    });
  }

  ngOnDestroy() {
    this.handle?.destroy();
  }
}
