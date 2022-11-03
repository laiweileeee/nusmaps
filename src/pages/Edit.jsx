import React, { useEffect, useState } from "react";
import Create from "./Create";
import { useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import moment from "moment";

const Edit = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [event, setEvent] = useState();

  useEffect(() => {
    const fetchEvent = async () => {
      const docRef = doc(db, "events", searchParams.get("id"));
      const docSnap = await getDoc(docRef);
      docSnap.data();

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvent(docSnap.data());
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        console.log(error); //TODO: add snackbar
      }
    };

    fetchEvent();
  }, [searchParams.get("id")]);

  return event ? (
    <Create
      event={{
        ...event,
        eventId: searchParams.get("id"),
        startDateTime: moment(event?.startDateTime.toDate()).format(
          "yyyy-MM-DDThh:mm"
        ),
        endDateTime: moment(event?.endDateTime.toDate()).format(
          "yyyy-MM-DDThh:mm"
        ),
        coordinates: [event?.latitude, event?.longitude],
      }}
    />
  ) : (
    <></>
  );
};

export default Edit;
