
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appTypewriter]',
  standalone: true,
})
export class TypewriterDirective implements AfterViewInit, OnDestroy {

  @Input('appTypewriter') set inputWords(value: string[] | string) {
    if (Array.isArray(value)) this.words = value;
    else if (typeof value === 'string') this.words = value.split(',').map(w => w.trim()).filter(Boolean);
  }

  @Input() typeSpeed = 70;
  @Input() deleteSpeed = 45;
  @Input() holdTime = 1000;
  @Input() pauseBetween = 400;
  @Input() loop = true;


  @Input() startOnVisible = false;

  private words: string[] = ['Transform'];
  private wordIndex = 0;
  private charIndex = 0;
  private typing = true;

  private rafId: number | null = null;
  private timeoutId: any = null;
  private observer?: IntersectionObserver;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private zone: NgZone
  ) {}

  ngAfterViewInit(): void {

    this.renderer.setAttribute(this.el.nativeElement, 'aria-live', 'polite');

    if (!this.words.length) this.words = ['Transform'];

    this.renderer.setProperty(this.el.nativeElement, 'textContent', '');
    this.charIndex = 0;
    this.typing = true;
    this.wordIndex = 0;

    if (this.startOnVisible && typeof IntersectionObserver !== 'undefined') {
      this.zone.runOutsideAngular(() => {
        this.observer = new IntersectionObserver((entries) => {
          const visible = entries.some(e => e.isIntersecting);
          if (visible) {
            this.observer?.disconnect();
            this.startLoopOutsideAngular();
          }
        }, { rootMargin: '0px 0px -20% 0px', threshold: 0.1 });
        this.observer.observe(this.el.nativeElement);
      });
    } else {
      this.startLoopOutsideAngular();
    }
  }

  private startLoopOutsideAngular(): void {
    this.clearTimers();

    this.zone.runOutsideAngular(() => {
      const tick = (ms: number, cb: () => void) => {
        this.timeoutId = setTimeout(() => {
          this.rafId = requestAnimationFrame(cb);
        }, ms);
      };

      const step = () => {
        const current = this.words[this.wordIndex];

        if (this.typing) {
          this.renderer.setProperty(this.el.nativeElement, 'textContent', current.slice(0, this.charIndex + 1));
          this.charIndex++;
          if (this.charIndex === current.length) {
            if (this.loop) {
              this.typing = false;
              tick(this.holdTime, step);
            } else {
              this.clearTimers();
              return;
            }
          } else {
            tick(this.typeSpeed, step);
          }
        } else {
          this.renderer.setProperty(this.el.nativeElement, 'textContent', current.slice(0, this.charIndex - 1));
          this.charIndex--;
          if (this.charIndex === 0) {
            this.typing = true;
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
            tick(this.pauseBetween, step);
          } else {
            tick(this.deleteSpeed, step);
          }
        }
      };

      this.rafId = requestAnimationFrame(() => tick(0, step));
    });
  }

  private clearTimers(): void {
    if (this.timeoutId) { clearTimeout(this.timeoutId); this.timeoutId = null; }
    if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null; }
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.observer?.disconnect();
  }
}
