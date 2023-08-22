import { useState } from "react";
import { Auth } from "./components/Auth";
import { db, auth, storage } from "./firebase/config";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import "./App.css";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [todos, setTodos] = useState([]);

  // New Movie StatesonChange={(e) => set}
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  // Update Title State
  const [updatedTitle, setUpdatedTitle] = useState("");

  // File Upload State

  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db, "movies");

  console.log(auth?.currentUser?.uid);

  const getMoviesList = async () => {
    // Reaf the Data
    // Set the Movie list

    try {
      const data = await getDocs(moviesCollectionRef);
      const filterData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTodos(filterData);
    } catch (err) {
      console.error(err);
    }
  };

  useState(() => {
    getMoviesList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
      });
      getMoviesList();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMoviesList();
  };

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: updatedTitle });
    getMoviesList();
  };

  const uploadFile = async () => {
    if (!fileUpload) return;

    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div>
        <Auth />
        <div>
          <input
            placeholder="Movie Title..."
            onChange={(e) => setNewMovieTitle(e.target.value)}
          />
          <input
            placeholder="Release Date..."
            type="number"
            onChange={(e) => setNewReleaseDate(Number(e.target.value))}
          />

          <input
            type="checkbox"
            checked={isNewMovieOscar}
            onChange={() => setIsNewMovieOscar((prevValue) => !prevValue)}
          />
          <label> Received an Oscar </label>
          <button onClick={onSubmitMovie}> Submit Movie </button>
        </div>
        <ul style={{ display: "flex", flexWrap: "wrap" }}>
          {todos.map((todo) => (
            <li
              style={{
                listStyle: "none",
                border: "1px solid white",
                width: "150px",
              }}
              key={todo.id}
            >
              <h2>{todo.title}</h2>
              <p>Date: {todo.releaseDate}</p>
              <p>Win Oscar: {todo.receivedAnOscar ? "Yes" : "No"}</p>

              <button
                style={{
                  background: "red",
                  padding: "5px 10px",
                  outline: "none",
                  margin: "10px 0",
                }}
                onClick={() => deleteMovie(todo.id)}
              >
                Delete
              </button>

              <input
                style={{ width: "100%" }}
                placeholder="New Title..."
                onChange={(e) => setUpdatedTitle(e.target.value)}
              />
              <button
                style={{
                  background: "lightblue",
                  padding: "5px 10px",
                  outline: "none",
                  color: "black",
                  margin: "10px 0",
                }}
                onClick={() => updateMovieTitle(todo.id)}
              >
                {" "}
                Update{" "}
              </button>
            </li>
          ))}
        </ul>

        <div>
          <input
            type="file"
            onChange={(e) => setFileUpload(e.target.files[0])}
          />
          <button onClick={uploadFile}>Upload File</button>
        </div>
      </div>
    </>
  );
}

export default App;
