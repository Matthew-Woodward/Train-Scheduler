$(document).ready(function () {
    // Initialize Firebase
    // let config = {
    //     apiKey: "AIzaSyCOsWlmBB2O3K1uwn7mQulpaiKUXeylOK0",
    //     authDomain: "train-scheduler-31610.firebaseapp.com",
    //     databaseURL: "https://train-scheduler-31610.firebaseio.com",
    //     projectId: "train-scheduler-31610",
    //     storageBucket: "train-scheduler-31610.appspot.com",
    //     messagingSenderId: "723744902315"
    // };
    // firebase.initializeApp(config);

    // A database reference variable. 
    let database = firebase.database();

    // Variables for the onClick event
    let name;
    let destination;
    let firstTrain;
    let frequency = 0;

    $("#add-train").on("click", function () {
        event.preventDefault();
        // Storing and retreiving new train data
        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();

        // Database push
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });

    database.ref().on("child_added", function (childSnapshot) {
        let nextArr;
        let minAway;
        // Chang year so first train comes before now
        let firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        // Difference between the current and firstTrain
        let diffTime = moment().diff(moment(firstTrainNew), "minutes");
        let remainder = diffTime % childSnapshot.val().frequency;
        // Time until next train
        let minAway = childSnapshot.val().frequency - remainder;
        // Next train time
        let nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#add-row").append("<tr><td>" + childSnapshot.val().name +
            "</td><td>" + childSnapshot.val().destination +
            "</td><td>" + childSnapshot.val().frequency +
            "</td><td>" + nextTrain +
            "</td><td>" + minAway + "</td></tr>");

        // Error handling
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
        // Update HTML
        $("#name-display").html(snapshot.val().name);
        $("#email-display").html(snapshot.val().email);
        $("#age-display").html(snapshot.val().age);
        $("#comment-display").html(snapshot.val().comment);
    });
});