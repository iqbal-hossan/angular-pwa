import { ApplicationRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-pwa';
  apiData: any;

  constructor(private http: HttpClient, private update: SwUpdate, private appRef: ApplicationRef ) {
    this.updateClient();
    this.checkUpdate();
  }

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

updateClient(){
  if(!this.update.isEnabled){
    console.log('Not Enabled');
    return;
  }

  this.update.available.subscribe((event) =>{
    console.log('current', event.current, 'available', event.available);
    if(confirm('Update available for the app. Please confirm!')){
      this.update.activateUpdate().then(() => document.location.reload());
    }
  });

  this.update.activated.subscribe((event) =>{
    console.log(`previous`, event.previous, `current`, event.current)
  })
}


checkUpdate(){
  this.appRef.isStable.subscribe((isStable) =>{
    if(isStable){
      const timeInterval = interval(6 * 60 * 60 * 1000);

      timeInterval.subscribe(() =>{
        this.update.checkForUpdate().then(() => console.log('checked'));
        console.log('update checked')
      })
    }
  })
}


}
