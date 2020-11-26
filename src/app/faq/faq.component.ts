import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  pinkBorder = [false, false, false, false, false, false, false, false];
  constructor() { }

  ngOnInit(): void {
  }

  setBorder(idx: number): void {
    const prevState = this.pinkBorder[idx];
    this.pinkBorder = [false, false, false, false, false, false, false, false];
    this.pinkBorder[idx] = !prevState;
  }
}
