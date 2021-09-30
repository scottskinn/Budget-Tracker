let db;

const request = indexedDB.open("budget_tracker", 1);

// this event will emit if the database version changes (nonexistent to version 1, v1 to v2, etc.)
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
        uploadBudget(); 
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
};

function uploadBudget() {
    const transaction = db.transaction(["update_budget"], "readwrite");

    const budgetObjectStore = transaction.objectStore("update_budget");

    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                  Accept: "application/json, text/plain, */*",
                  "Content-Type": "application/json"
                },
            })
            .then(response => response.json())
            .then((serverResponse) => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction([update_budget], 'readwrite');
                const budgetObjectStore = transaction.objectStore('update_budget');

                alert('Budget has been updated!')
            })
            .catch((err) => {
                console.log(err);
            });
        }
    };
}

window.addEventListener('online', uploadBudget);