import {Directive, ElementRef, HostBinding, HostListener, OnInit} from '@angular/core';

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective implements OnInit {
    @HostBinding('class.show')
    isOpened = false;

    constructor(private elRef: ElementRef) {}

    ngOnInit() {}

    @HostListener('document:click', ['$event'])
    toggleOpen(event: Event) {
        console.log(this.elRef);
        console.log(event);
        this.isOpened = this.elRef.nativeElement.contains(event.target) ? !this.isOpened : false;
    }

}
