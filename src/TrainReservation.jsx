import { useState } from "react";
import Header from "./Header";
import TrainData from "./Assets/TrainData.json";
import emailjs from 'emailjs-com';

const getUniqueStations = () => {
  // Extract stations from the TrainData
  const fromStations = new Set();
  const toStations = new Set();

  TrainData.forEach((record) => {
    fromStations.add(record["fromStation"]);
    toStations.add(record["toStation"]);
  });

  // Convert Sets to Arrays and return as an object
  return {
    uniqueFromStations: Array.from(fromStations),
    uniqueToStations: Array.from(toStations),
  };
};



export default function TrainReservation() {
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  async function sendEmail(userrOtp){
    console.log(userOtp);
    const templateParams = {
      to_email: userEmail,
      otp: userrOtp,
    };
    
    try {
      await emailjs.send(
        'service_vlh4mvg',    // Replace with your EmailJS Service ID
        'template_9vnfrxu',   // Replace with your EmailJS Template ID
        templateParams,
        '1wDNRHxwreD5quKb7'     // Replace with your EmailJS Public Key
      );
    } catch (error) {
      console.log(error);
    }
  }

  function handleGenerateOTP(e){
    let currOtp = generateOTP();
    sendEmail(currOtp)
    .catch((err)=>{
      console.log(err);
    })
    setUserOtp(currOtp);
  }

  function handleFromChange(e) {
    setSelectedFrom(e.target.value);
  }

  function handleToChange(e) {
    setSelectedTo(e.target.value);
  }

  function handleGetTrains(e) {
    let requiredTrains = [];
    for (let train of TrainData) {
      if (
        train.fromStation === SelectedFrom &&
        train.toStation === SelectedTo
      ) {
        requiredTrains.push(train);
      }
    }
    console.log(requiredTrains);
    setCurrTrain(requiredTrains);
  }

  function handleBookTrain(e) {
    setSelectedTrain(e);
  }

  function handleEmailChange(e) {
    // console.log(e.target.value);
    setUserEmail(e.target.value);
  }

  let [From, setFrom] = useState(getUniqueStations().uniqueFromStations);
  let [To, setTo] = useState(getUniqueStations().uniqueToStations);
  let [SelectedFrom, setSelectedFrom] = useState("--Select--");
  let [SelectedTo, setSelectedTo] = useState("--Select--");
  let [displayTrain, setDisplayTrain] = useState(false);
  let [currTrain, setCurrTrain] = useState([]);
  let [selectedTrain, setSelectedTrain] = useState({});
  let [userEmail, setUserEmail] = useState("");
  let [userOtp, setUserOtp] = useState("");

  return (
    <>
      <Header />
      {/* <-- Select Station--> */}
      <div className="row m-5">
        <div className="col-4">
          <div className="form-floating">
            <select
              className="form-select"
              id="floatingSelect"
              aria-label="Floating label select example"
              onChange={handleFromChange}
            >
              <option value={SelectedFrom}>--Select--</option>
              {From.map((station, index) => (
                <option key={index} value={station}>
                  {station}
                </option>
              ))}
            </select>
            <label htmlFor="floatingSelect">From Station</label>
          </div>
        </div>
        <div className="col-4">
          <div className="form-floating">
            <select
              className="form-select"
              id="floatingSelect"
              aria-label="Floating label select example"
              onChange={handleToChange}
            >
              <option value={SelectedTo}>--Select--</option>
              {To.map((station, index) => (
                <option key={index} value={station}>
                  {station}
                </option>
              ))}
            </select>
            <label htmlFor="floatingSelect">To Station</label>
          </div>
        </div>
        <div className="col-4 align-items-left justify-content-center d-flex flex-column">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleGetTrains}
          >
            Get Trains
          </button>
        </div>
      </div>

      <div className="m-5">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>From Station</th>
              <th>To Station</th>
              <th>Avilable Seats</th>
              <th>Train Name</th>
              <th>Duration</th>
              <th>Arrival Time</th>
              <th>Departure Time</th>
              <th>Book Train</th>
            </tr>
          </thead>
          <tbody>
            {currTrain.map((value, index) => (
              <tr key={index}>
                <td>{value.fromStation}</td>
                <td>{value.toStation}</td>
                <td>{value.availableSeats}</td>
                <td>{value.trainName}</td>
                <td>{value.duration}</td>
                <td>{value.arrivalTime}</td>
                <td>{value.departureTime}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                    onClick={() => {
                      handleBookTrain(value);
                    }}
                  >
                    Book Train
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        class="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">
                Book - {selectedTrain.trainName}
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="card text-center">
                <div class="card-header">{selectedTrain.trainName}</div>
                <div class="card-body">
                  <h5 class="card-title">
                    Avilable Seats = {selectedTrain.availableSeats}
                  </h5>
                  <p class="card-text">
                    {selectedTrain.departureTime} || {selectedTrain.arrivalTime}{" "}
                    || {selectedTrain.duration}
                  </p>
                </div>
                <div class="card-footer text-body-secondary">
                  {selectedTrain.fromStation} - {selectedTrain.toStation}
                </div>
              </div>
              <div class="form-floating mt-3">
                <input
                  type="email"
                  class="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  onChange={handleEmailChange}
                  value={userEmail}
                  required
                />
                <label for="floatingInput">Email address</label>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop11"
                onClick={handleGenerateOTP}
              >
                Book with OTP
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="staticBackdrop11"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">
                Enter OTP
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="card text-center">
                <div class="card-header">{selectedTrain.trainName}</div>
                <div class="card-body">
                  <h5 class="card-title">
                    Avilable Seats = {selectedTrain.availableSeats}
                  </h5>
                </div>
                <div class="card-footer text-body-secondary">
                  {selectedTrain.fromStation} - {selectedTrain.toStation}
                </div>
              </div>
              <div class="form-floating mt-5">
                <input
                  type="number"
                  class="form-control"
                  id="floatingPassword"
                  placeholder="Enter OTP"
                />
                <label for="floatingPassword">Enter OTP</label>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
