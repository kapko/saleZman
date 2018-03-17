import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-my-work-list',
  templateUrl: 'my-work-list.html',
})

export class MyWorkListComponent {
  @Input() data: any[] = [];
  list: any[] = [];

  constructor(){}

  ngOnChanges(): void {
    if (!this.data) return;
    this.list = this.data;
  }
}
