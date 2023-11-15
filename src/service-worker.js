importScripts('./ngsw-worker.js');

self.addEventListener('sync', (event) => {
    if(event.tag === 'post-data'){
        // call method
        event.waitUntil(getDataAndSend())
    }
})

function addData(employee){
    //indexDb
    let obj = employee;

    fetch('http://localhost:3000/data', {
        method:"POST",
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    }).then(() => Promise.resolve().catch(() => Promise.reject()))
}


function getDataAndSend() {
    let db;
    const request = indexedDB.open('my-db');
    console.log("request--", request)

    request.onerror = (event) => {
      console.log('Please allow my web app to use IndexedDB 😃>>>👻');
    };
    request.onsuccess = (event) => {
      db = event.target.result;
      console.log("getdata--", event)
      getData(db);
    };
  }

  function getData(db) {
    const transaction = db.transaction(['user-store']);
    const objectStore = transaction.objectStore('user-store');
    const request = objectStore.get('employee');
    request.onerror = (event) => {
      // Handle errors!
    };
    request.onsuccess = (event) => {
      const result = event.target.result;
      if (result) {
        addData(result);
        console.log('Name of the user is ' + result.name);
      } else {
        console.log('No data found in the user-store object store.');
      }
    };
  }
  