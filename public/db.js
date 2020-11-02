let db;

const indexedDB = 
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

//Creat a new DB request for a "budget"  database
const request = indexedDB.open("budget", 1);

//Create a new db request for a "budget" database
request.onupgradeneeded = function (event) {
    //Create object store called "pending" and set autoincrement to true
    const db = event.target.result;
    db.createObjectStore("pending", { autoincrement: true });
};

request.onsuccess = function (event) {
    db = event.target.result;

    //check to see if app is online before reading from DB
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function (event) {
    console.log("Hello" + event.target.errorCode);
};

//Then use the saveRecord function to save a record into storage of our DB
function saveRecord(record) {
    //Create a transacation on the pendning db with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");

    //Access pending object store
    const store = transaction.objectStore("pending");

    //Add record to your store with add method
    store.add(record);
}

//We also want a function that checks the database that will get all of the stored transacations
//On success of this action, we will use our API bulk post route to push all of the data to our DB

function checkDatabase() {
    //open transaction on your pending DB
    const transaction = db.transaction(["pending"], "readwrite");
    //Access your pending object store
    const store = transaction.objectStore("pending");
    //Get all records from store and set to a variable
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                },
            })
            .then((response) => response.json())
            .then(() => {
                //If successful, open a transaction of your pending DB
                const transaction = db.transaction(["pending"], "readwrite");

                //access your pending object store
                const store = transaction.objectStore("pending");

                //clear all items in your store
                store.clear();
            });
        }
    };
}

//Listen for app coming back online
window.addEventListener("online", checkDatabase);