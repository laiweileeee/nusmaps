import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  Timestamp,
  getDocs,
} from "firebase/firestore";

export const getOngoing = async (type, creatorId, participantId) => {
  let eventsQuery = query(collection(db, "events"));

  if (type) {
    eventsQuery = query(eventsQuery, where("type", "==", type));
  }

  // get created
  if (creatorId) {
    eventsQuery = query(eventsQuery, where("creatorId", "==", creatorId));
  }

  // get joined
  if (participantId) {
    eventsQuery = query(
      eventsQuery,
      where("participants", "array-contains", participantId)
    );
  }

  eventsQuery = query(
    eventsQuery,
    where("endDateTime", ">", Timestamp.now()),
    orderBy("endDateTime", "asc")
  );

  const querySnapshot = await getDocs(eventsQuery);
  const eventsList = [];
  querySnapshot.forEach((doc) => {
    if (doc.data().startDateTime < Timestamp.now()) eventsList.push(doc);
  });

  return eventsList;
};

export const getUpcoming = async (type, creatorId, participantId) => {
  let eventsQuery = query(collection(db, "events"));

  if (type) {
    eventsQuery = query(eventsQuery, where("type", "==", type));
  }

  // get created
  if (creatorId) {
    eventsQuery = query(eventsQuery, where("creatorId", "==", creatorId));
  }

  // get joined
  if (participantId) {
    eventsQuery = query(
      eventsQuery,
      where("participants", "array-contains", participantId)
    );
  }

  eventsQuery = query(
    eventsQuery,
    where("startDateTime", ">", Timestamp.now()),
    orderBy("startDateTime", "asc")
  );

  const querySnapshot = await getDocs(eventsQuery);
  const eventsList = [];
  querySnapshot.forEach((doc) => {
    eventsList.push(doc);
  });

  return eventsList;
};

export const getPast = async (type, creatorId, participantId) => {
  let eventsQuery = query(collection(db, "events"));

  if (type) {
    eventsQuery = query(eventsQuery, where("type", "==", type));
  }

  // get created
  if (creatorId) {
    eventsQuery = query(eventsQuery, where("creatorId", "==", creatorId));
  }

  // get joined
  if (participantId) {
    eventsQuery = query(
      eventsQuery,
      where("participants", "array-contains", participantId)
    );
  }

  eventsQuery = query(
    eventsQuery,
    where("endDateTime", "<", Timestamp.now()),
    orderBy("endDateTime", "desc")
  );

  const querySnapshot = await getDocs(eventsQuery);
  const eventsList = [];
  querySnapshot.forEach((doc) => {
    eventsList.push(doc);
  });

  return eventsList;
};
