import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  collection,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import { sendemail_request } from "./send_mail.js";
const firebaseConfig = {
  apiKey: "AIzaSyAJ1mrcBYnl_M2bG7vfpSwlcm5NnpzsohQ",
  authDomain: "blood-bank-25293.firebaseapp.com",
  databaseURL: "https://blood-bank-25293-default-rtdb.firebaseio.com",
  projectId: "blood-bank-25293",
  storageBucket: "blood-bank-25293.appspot.com",
  messagingSenderId: "422166227123",
  appId: "1:422166227123:web:801967eb7004a2341a28c6",
  measurementId: "G-TKT0F7M4WL",
};
initializeApp(firebaseConfig);
const db = getFirestore();

function get_value_gender() {
  if (document.getElementById("Male").checked) {
    return "male";
  }
  if (document.getElementById("Female").checked) {
    return "female";
  }
  if (document.getElementById("Others").checked) {
    return "others";
  }
}

function get_request() {
  console.log("getting");
  const patient_name = document.getElementById("Patient_name").value;
  const Hospital_name = document.getElementById("Hospital_name").value;
  const patient_required_date = new Date(
    document.getElementById("required_date").value
  );
  const patient_gender = get_value_gender();
  const patient_email = document.getElementById("patient_email").value;
  const purpose_request = document.getElementById("purpose_request").value;
  const no_of_units = document.getElementById("no_of_units").value;
  const patient_age = document.getElementById("patient_dob").value;
  const select = document.getElementById("Blood_group_request");
  const patient_blood = select.options[select.selectedIndex].value;
  return [
    no_of_units, //1
    patient_name, //2
    Hospital_name,//3
    patient_age,//4
    patient_gender,//5
    patient_email,//6
    purpose_request,//7
    patient_blood,//8
    patient_required_date,//9
  ];
}

// function get_age(dob) {
//   console.log("checking");
//   var dob_year = dob.getFullYear();
//   function getAge(birthYear) {
//     var currentDate = new Date();
//     var currentYear = currentDate.getFullYear();
//     var age = currentYear - birthYear;
//     return age;
//   }
//   var calculatedAge = getAge(dob_year);
//   return calculatedAge;
// }

async function add_to_request() {
  console.log("called");
  const request_data = get_request();
  console.log(request_data);
  let flag = 0;
  if (flag == 0) {
    request_data.forEach((element) => {
      if (element == "Invalid Date") {
        flag = 1;
      } else if (!element) {
        flag = 1;
      } else if (element.length == 0) {
        flag = 1;
      }
    });
  }
  if (!request_data[5].includes("@")) {
    flag = 1;
  }
  if (flag == 1) {
    alert("Please fill all the fields properly.");
    return 0;
  }
  const time = String(new Date());
  console.log(time);
  const dbRef = collection(db, "Request");
  console.log("adding");
  await setDoc(
    doc(
      collection(dbRef, time, request_data[7]+ "_request"),
      time + "_" + String(request_data[5])
    ),
    {
      Name: request_data[1],
      Hospital_Name: request_data[2],
      age: request_data[3],
      required_date: String(request_data[8]),
      Gender: request_data[4],
      Email: request_data[5],
      Purpose: request_data[6],
      Blood_group: request_data[7],
      Date_of_creation: time,
      No_of_Units: request_data[0],
    }
  )
    .then((docRef) => {
      console.log("Document has been added successfully");
      alert("We have registered your request. Redirecting to Home.");
      sendemail_request(request_data[5]);
      setTimeout(myURL, 100);
      function myURL() {
        location.href = "Homepage.html";
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
export { add_to_request };
