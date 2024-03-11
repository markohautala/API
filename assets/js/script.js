

const API_KEY = "uC2PXFIn3sIsCThGrVNxPzZxmuU";

const API_URL = "https://ci-jshint.herokuapp.com/api";

const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

function processOptions(form) {
    let optArray = []; // Create an empty array to hold the options
    
    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            optArray.push(entry[1]); // If the entry is an option, push it to the array
        }
    }
    form.delete("options"); // Delete the options key from the form data
    form.append("options", optArray.join()); // Append the options array to the form data as a string¨

    return form; // Return the modified form data
}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform"))); // Create a new FormData object from the form

    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                                 },
                        body: form  // Pass the form data to the request body
                        })

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data); // Display the exception before throwing the error
        throw new Error(data.error);
    }
}

function displayErrors(data) {
    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading; // Set the innerText of the resultsModalTitle to the heading
    document.getElementById("results-content").innerHTML = results; // Set the innerHTML of the results-content div to the results
    resultsModal.show(); // Show the modal
}

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        displayException(data); // Display the exception before throwing the error
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    let heading = "API Key Status:";
    let results = `<div>Your key is valid until:</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}

function displayException(data) {
    let heading = `An Exception Occurred`; // Set the heading to the error message
    results = `<div>The API returned status code as: ${data.status_code}</div>`; // Set the results to the error message
    results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
    results += `<div>Error message: <strong>${data.error}</strong></div>`;

    document.getElementById("resultsModalTitle").innerText = heading; // Set the innerText of the resultsModalTitle to the heading
    document.getElementById("results-content").innerHTML = results; // Set the innerHTML of the results-content div to the results
    resultsModal.show(); // Show the modal

}