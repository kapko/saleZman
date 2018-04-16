import { Component } from '@angular/core';

@Component({
  selector: 'app-my-work',
  templateUrl: 'my-work.html',
})

export class MyWorkPage {
  options: any[string] = ['stock', 'order', 'supply', 'payment'];
  constructor() { }

  optionsUpdate(options: any[string]): void {
    this.options = options;
  }

}
