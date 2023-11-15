import { ApplicationRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush, SwRegistrationOptions, SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { IndexedDBService } from './services/indexed-db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-pwa';
  apiData: any;
  private readonly publicKey = 'BKLrGCR8gog7yhdnJ_1lwUD7SG2mU58XXz67i8leelkXEPrp1CspbjnkHnmlQIQMu_kIKxWozCHnan375xsS7v0';
  private readonly privateKey = 'TNxVN5sjDPobDosVIEWg2s4xAP7_ZPtZoTS9XN_PXSI';
  emp_obj = {
    name: 'Iqbal Hossan',
    designation: 'Software Developer',
    employeId: '620162'
  }
  constructor(
    private http: HttpClient,
    private update: SwUpdate,
    private appRef: ApplicationRef,
    private swPush: SwPush,
    private indexedDBServices: IndexedDBService
  ) {
    this.updateClient();
    this.checkUpdate();
  }

  ngOnInit(): void {


    // if(!navigator.onLine){
    //   alert('Please check your internet connection');
    // }

    addEventListener('offline', (e) => {
      alert('Please check your internet connection');
    })

    addEventListener('online', (e) => {
      alert('You are online');
    })

    this.pushSubscription();

    this.swPush.messages.subscribe((message) => console.log(message));

    this.swPush.notificationClicks.subscribe(
      (({ action, notification }) => {
        window.open(notification.data.url);
        console.log(notification.data.url)
      })
    )

    this.http.get('https://jsonplaceholder.typicode.com/todos/').subscribe(
      (res: any) => {
        this.apiData = res;
        console.log("data--", res);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  updateClient() {
    if (!this.update.isEnabled) {
      console.log('Not Enabled');
      return;
    }

    this.update.available.subscribe((event) => {
      console.log('current', event.current, 'available', event.available);
      if (confirm('Update available for the app. Please confirm!')) {
        this.update.activateUpdate().then(() => document.location.reload());
      }
    });

    this.update.activated.subscribe((event) => {
      console.log(`previous`, event.previous, `current`, event.current)
    })
  }


  checkUpdate() {
    this.appRef.isStable.subscribe((isStable) => {
      if (isStable) {
        const timeInterval = interval(8 * 60 * 60 * 1000);

        timeInterval.subscribe(() => {
          this.update.checkForUpdate().then(() => console.log('checked'));
          console.log('update checked')
        })
      }
    })
  }

  pushSubscription() {
    if (!this.swPush.isEnabled) {
      console.log("Notification is not enabled");
      return;
    }
    console.log("Notification is enabled");


    this.swPush.requestSubscription({
      serverPublicKey: this.publicKey,
    }).then((sub) => { console.log(JSON.stringify(sub)) })
      .catch(err => console.log(err))
  }

  postSync() {

    if (!navigator.onLine) {
      console.log("offline")
      alert('Please check your internet connection');
      this.indexedDBServices.addEmp(this.emp_obj)
            ?.then(this.backgroundSync)
            .catch(console.log);
    } else {
      // api call
      this.http.post('http://localhost:3000/data', this.emp_obj).subscribe(
        res => {
          console.log(res);
        }, err => {
          this.indexedDBServices.addEmp(this.emp_obj)
            ?.then(this.backgroundSync)
            .catch(console.log);
          // this.backgroundSync();
        }
      )
    }
  }

  deleteSync() {
    // let emp_obj = {
    //   name: 'Iqbal Hossan',
    //   designation: 'Software Developer',
    //   employeId: '620162'
    // }
    // api call
    this.http.post('http://localhost:3000/data', this.emp_obj).subscribe(
      res => {
        console.log(res);
      }, err => {
        this.indexedDBServices.deleteUser('employee')
          ?.then(this.backgroundSync)
          .catch(console.log);
        // this.backgroundSync();
      }
    )
  }



  backgroundSync() {
    navigator.serviceWorker.ready
      .then((swRegistration) =>
        swRegistration.sync.register('post-data'))
      .catch(console.log)
  }

}
