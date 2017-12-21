$(document).ready(function () {

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyBRz6POvc-AqTeP1_3ZP15iCiNt095AL-0",
      authDomain: "fir-project-47a3c.firebaseapp.com",
      databaseURL: "https://fir-project-47a3c.firebaseio.com",
      projectId: "fir-project-47a3c",
      storageBucket: "fir-project-47a3c.appspot.com",
      messagingSenderId: "151244482577"
      };
      firebase.initializeApp(config);
    // Create a variable to reference the database
    var database = firebase.database();

    $('#button-id').on('click', function (event) {
        event.preventDefault();

        // Grabs user input
        var inputName = $("#name").val().trim();
        var inputDestination = $("#destination").val().trim();
        var inputTime = $("#time").val().trim();
        var inputFrequency = $("#frequency").val().trim();

        // Creates local "temporary" object for holding train data
        var trainValues = {
            name: inputName,
            destination: inputDestination,
            time: inputTime,
            frequency: inputFrequency
        };

        // Push new values to the database
        database.ref().push(trainValues);
        Materialize.toast('You have added a train', 3000) // 4000 is the duration of the toast

        // Clear out text fields after submit
        $("#name").val("");
        $("#destination").val("");
        $("#time").val("");
        $("#frequency").val("");

    });

    // Create a listener for value changes in the database
    database.ref().on("child_added", function (childSnapshot) {


        // User input data
        var inputName = childSnapshot.val().name;
        var inputDestination = childSnapshot.val().destination;
        var inputFrequency = childSnapshot.val().frequency;
        var inputTime = childSnapshot.val().time;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var initialTimeConv = moment(inputTime, "hh:mm").subtract(1, "years");
        // Current time
        var currentTime = moment();
        var timePretty = moment(currentTime).format("hh:mm")
        // Difference between the times
        var diffTime = moment().diff(moment(initialTimeConv), "minutes");
        // Time apart (remainder)
        var inputRemainder = diffTime % inputFrequency;
        // Minutes until train
        var minAway = inputFrequency - inputRemainder;
        // Next train
        var nextTrain = moment().add(minAway, "minutes");
        var arrivalTime = moment(nextTrain).format("hh:mm A");
        // Append all the values to the table in the HTML
        $("#trainTable").append("<tr><td>" + inputName + "</td><td>" + inputDestination + "</td><td>" + inputFrequency + "</td><td>" + arrivalTime + "</td><td>" + minAway + "</td></tr>");
    });
});
