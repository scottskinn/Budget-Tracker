let db;

const request = indexedDB.open("budget_tracker", 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function (event) {
    // save a reference to the database
    const db = event.target.result;
    // create an object store (table) called update_budget
    db.createObjectStore("update_budget", {
        autoIncrement: true
    });
};

request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {
        // uploadBudget(); 
    }
};

request.onerror = function (event) {
    // log error here
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(["update_budget"], "readwrite");

    const budgetObjectStore = transaction.objectStore("update_budget");

    budgetObjectStore.add(record);
}