import { Component, OnInit, ChangeDetectionStrategy, ViewChild, EmbeddedViewRef, ViewContainerRef, TemplateRef, Renderer2 } from '@angular/core';
import { testimonials } from '@kk/core';
import $clamp from 'clamp-js';

@Component({
  selector: 'kk-testimonial-slider',
  templateUrl: './testimonial-slider.component.html',
  styleUrls: ['./testimonial-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestimonialSliderComponent implements OnInit {

  public testimonials = testimonials;

  public currentIndex = -1;

  private _currentView: EmbeddedViewRef<any>;

  @ViewChild('ViewContainer', { static: true, read: ViewContainerRef })
  private _viewContainer: ViewContainerRef;

  @ViewChild('Template', { static: true, read: TemplateRef })
  private _template: TemplateRef<any>;

  private _animating = false;

  constructor(private _renderer: Renderer2) { }

  ngOnInit(): void {
    this.next(true);
  }

  public next(initial = false): void {
    this.currentIndex = this.currentIndex === testimonials.length - 1 ? 0 : this.currentIndex + 1;
    this.slide('slide-out-left', initial ? '' : 'slide-in-left');
  }

  public prev(): void {
    this.currentIndex = this.currentIndex === 0 ? testimonials.length - 1 : this.currentIndex - 1;
    this.slide('slide-out-right', 'slide-in-right');
  }

  private slide(slideOutClass: string, slideInClass: string) {
    if (!this._animating) {
      this._animating = true;
      let insertIndex = 0;
      if (this._currentView) {
        insertIndex = 1;
        this._renderer.addClass(this._currentView.rootNodes[0], slideOutClass);
        this.removeView();
      } else {
        setTimeout(() => {
          this._animating = false;
        }, 1000);
      }
      this._currentView = this._viewContainer.createEmbeddedView(
        this._template,
        { t: testimonials[this.currentIndex] },
        insertIndex
      );
      if (slideInClass) {
        $clamp(this._currentView.rootNodes[0].children[0], { clamp: 3 });
        this._renderer.addClass(this._currentView.rootNodes[0], slideInClass);
      }
    }
  }

  private removeView() {
    setTimeout(() => {
      this._viewContainer.remove(0);
      this._animating = false;
    }, 1000);
  }

}
