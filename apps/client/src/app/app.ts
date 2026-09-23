import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private http = inject(HttpClient);

  item1 = signal('');
  item2 = signal('');
  background = signal('');
  loading = signal(false);
  imageUrl = signal('');

  onSubmit() {
    this.loading.set(true);
    this.imageUrl.set('');

    this.http
      .post<any>('http://localhost:8787/api/generate', {
        item1: this.item1(),
        item2: this.item2(),
        background: this.background(),
      })
      .subscribe({
        next: (data) => {
          console.log('Success:', data);
          if (data.image) {
            this.imageUrl.set(data.image);
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error:', error);
          this.loading.set(false);
        },
      });
  }
}
