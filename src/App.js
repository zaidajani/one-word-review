import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import BadWordsFilter from "bad-words";
import { firebaseConfig } from "./firebase";

import firebase from "firebase/app";
import "firebase/firestore";

import { WordWall } from "./screens/wordwall.screen";

firebase.initializeApp(
  firebaseConfig
);

const firestore = firebase.firestore();

const Frontpage = (text) => {
  const navigate = useNavigate();
  const messageRef = firestore.collection("Reviews");
  const filter = new BadWordsFilter();
  const [formvalue, setFormValue] = React.useState("");

  const sendmessage = async () => {
    if (filter.isProfane(text)) {
      alert("Inappropriate wordings used.");
      return setFormValue("");
    }

    if (formvalue.length >= 30) {
      alert("Your text must be less than 30 characters");
      setFormValue("");
      return;
    }

    if (formvalue.length == 0) {
      alert("Enter something");
      setFormValue("");
      return;
    }

    await messageRef.add({
      text: formvalue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    alert("Posted");
    navigate("/wordwall");
  };
  return (
    <>
      <div className="header">Review our event in one word</div>
      <div className="bottom">
        <input
          className="txtin"
          placeholder="Anything less than 30 characters"
          value={formvalue}
          onChange={(e) => {
            setFormValue(e.target.value);
          }}
        />
        <div className="button" onClick={sendmessage}>
          Yes! Post it.
        </div>
      </div>
    </>
  );
}

function App() {
  const messageRef = firestore.collection("Reviews");
  const [reviewArray, setReviewArray] = React.useState([]);

  const write = async () => {
    messageRef.orderBy("createdAt").onSnapshot((querySnapshot) => {
      let reviews = [];
      querySnapshot.forEach((doc) => {
        reviews.push(doc.data());
      });
      reviews = reviews.reverse();
      setReviewArray(reviews);
    });
  };

  write();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Frontpage />}
          />
          <Route
            path="/wordwall"
            element={<WordWall greetings={reviewArray} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
