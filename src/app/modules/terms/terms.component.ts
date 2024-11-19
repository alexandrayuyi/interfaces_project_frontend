import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [],
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnChanges {
  @Input() htmlContent = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['htmlContent']) {
      this.updateContent();
    }
  }

  updateContent() {
    const wysiwygContent = document.getElementById('wysiwyg-content');
      if (wysiwygContent && this.htmlContent) {
        wysiwygContent.innerHTML = this.htmlContent;
    }
  }
}