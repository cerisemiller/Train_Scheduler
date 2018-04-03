var config = {
    apiKey: "AIzaSyD1hk-1NW7awE0xwh_7MnY6MD2bXLkn7Bg",
    authDomain: "train-scheduler-db178.firebaseapp.com",
    databaseURL: "https://train-scheduler-db178.firebaseio.com",
    projectId: "train-scheduler-db178",
    storageBucket: "train-scheduler-db178.appspot.com",
    messagingSenderId: "917190528542"
  };
  firebase.initializeApp(config);

  var trainData = firebase.database();

  // Button Click Event
  $("#add-train-btn").on("click", function() {
    let trainName = $("#train-name-input").val().trim();
    let destination = $("#destination-input").val().trim();
    let firstTrain = $("#first-train-input").val().trim();
    let frequency = $("#frequency-input").val().trim();

    let newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
    }

    trainData.ref().push(newTrain);

    return false;
  });

// Data Event
trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
    let tName = childSnapshot.val().name;
    let tDestination = childSnapshot.val().destination;
    let tFrequency = childSnapshot.val().frequency;
    let tFirstTrain = childSnapshot.val().firstTrain;

    let trainArr = tFirstTrain.split(":");
    let trainTime = moment().hours(trainArr[0]).minutes(trainArr[1]);
    let maxMoment = moment.max(moment(), trainTime);
    let tMinutes;
    let tArrival;

    if(maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
    } else {
        let differenceTimes = moment().diff(trainTime, "minutes");
        let tRemainder = differenceTimes % tFrequency;
        tMinutes = tFrequency - tRemainder;
        tArrival = moment().add(tMinutes, "m").format("mm:hh A");
    }

// Add Train Data to Table
$("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" + tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");    

});