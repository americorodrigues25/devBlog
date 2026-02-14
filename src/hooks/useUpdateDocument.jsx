import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { updateDoc, doc } from "firebase/firestore";

const initalState = {
  loading: false,
  error: null,
  document: null,
};

const updateReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "UPDATED_DOC":
      return { loading: false, error: null, document: action.payload };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const useUpdateDocument = (docCollection) => {
  const [response, dispatch] = useReducer(updateReducer, initalState);

  //   deal with memory leak
  const [cancelled, setCancelled] = useState(false);

  const checkCanceledBeForeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const updateDocument = async (id, data) => {
    checkCanceledBeForeDispatch({
      type: "LOADING",
    });

    try {
      const docRef = await doc(db, docCollection, id);
      const updateDocument = await updateDoc(docRef, data);

      checkCanceledBeForeDispatch({
        type: "UPDATED_DOC",
        payload: updateDocument,
      });
    } catch (error) {
      checkCanceledBeForeDispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { updateDocument, response };
};
