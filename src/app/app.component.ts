import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-pwa';
  apiData: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('https://jsonplaceholder.typicode.com/todos/').subscribe(
      (res: any) => {
        this.apiData = res; // 'res' already contains the data, so no need for '.data'
        console.log("data--", res);
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
