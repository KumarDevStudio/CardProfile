# profileCard

1. Imports
jsx
Copy code
import React, { useEffect, useReducer } from "react";
import axios from "axios";
import "./UserPhotoGallery.css";

React: The main library for building the user interface.
useEffect: A hook that runs side effects in function components. It is used here to fetch data when the component mounts.
useReducer: A hook to manage state using a reducer function. It is an alternative to useState for more complex state logic.
axios: A promise-based HTTP client for making requests to external APIs.
"./UserPhotoGallery.css": A CSS file to style the gallery.



2. Action Types
jsx
Copy code
const FETCH_START = "FETCH_START";
const FETCH_SUCCESS = "FETCH_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";

These constants are used as action types to handle different states of the data fetching process (start, success, failure).




3. Reducer Function (galleryReducer)
jsx
Copy code
const galleryReducer = (state, action) => {
  switch (action.type) {
    case FETCH_START:
      return { ...state, loading: true, users: [], photos: [] };
    case FETCH_SUCCESS:
      return { ...state, loading: false, users: action.users, photos: action.photos };
    case FETCH_FAILURE:
      return { ...state, loading: false, users: [], photos: [], error: action.error };
    default:
      return state;
  }
};

Reducer function: This function manages the state of the component based on dispatched actions.
FETCH_START: When the data fetching starts, it sets loading to true and clears any previous users and photos.
FETCH_SUCCESS: When data fetching is successful, it updates the state with the fetched users and photos, and sets loading to false.
FETCH_FAILURE: If there is an error during fetching, it sets loading to false, clears the data, and stores the error message.






4. UserPhotoCard Component
jsx
Copy code
const UserPhotoCard = ({ user, photo }) => {
  return (
    <div className="user-photo-card">
      <div className="photo-info">
        <img src={photo.thumbnailUrl} alt={photo.title} />
      </div>
      <div className="user-info">
        <h6>{user.name}</h6>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <p>City: {user.address.city}</p>
      </div>
    </div>
  );
};

UserPhotoCard is a functional component that receives user and photo as props.
It returns JSX that displays a user’s details (name, email, phone, city) and a corresponding image (photo).




5. Main Component (UserPhotoGallery)
jsx
Copy code
const UserPhotoGallery = () => {
  const initialState = {
    users: [],
    photos: [],
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(galleryReducer, initialState);

initialState: Defines the initial state for the component, with users, photos, loading, and error.
useReducer: The reducer is used to manage the state based on different actions. state contains the current state, and dispatch is a function to trigger actions.





6. Fetching Data with useEffect
jsx
Copy code
  useEffect(() => {
    const fetchUsersAndPhotos = async () => {
      dispatch({ type: FETCH_START });

      try {
        const [userResponse, photoResponse] = await Promise.all([
          axios.get("https://jsonplaceholder.typicode.com/users"),
          axios.get("https://jsonplaceholder.typicode.com/photos?_limit=10"),
        ]);

        dispatch({
          type: FETCH_SUCCESS,
          users: userResponse.data,
          photos: photoResponse.data,
        });

      } catch (error) {
        dispatch({
          type: FETCH_FAILURE,
          error: error.message,
        });
      }
    };

    fetchUsersAndPhotos();
  }, []);

useEffect is used to perform the data fetching when the component mounts.
fetchUsersAndPhotos: An asynchronous function that fetches users and photos.
Promise.all is used to fetch both users and photos concurrently.
If both requests are successful, it dispatches a FETCH_SUCCESS action with the fetched data.
If there is an error during the fetch, it dispatches a FETCH_FAILURE action with the error message.






7. Conditional Rendering
jsx
Copy code
  if (state.loading) {
    return <div>Loading users and photos...</div>;
  }

  if (state.error) {
    return <div>Error: {state.error}</div>;
  }

  if (state.users.length === 0 || state.photos.length === 0) {
    return <div>No users or photos available.</div>;
  }

If the component is still loading data (loading is true), it displays a loading message.
If an error occurs during fetching, it displays the error message.
If there are no users or photos, it displays a message saying that no data is available.








8. Combining Data and Rendering the Gallery
jsx
Copy code
  const combinedData = state.users.map((user, index) => ({
    user,
    photo: state.photos[index % state.photos.length],
  }));

  return (
    <div className="user-photo-gallery">
      {combinedData.map(({ photo, user }) => (
        <UserPhotoCard key={user.id} user={user} photo={photo} />
      ))}
    </div>
  );
};

combinedData: This combines each user with a corresponding photo. The index % state.photos.length ensures that photos are cycled through if there are more users than photos.
Rendering: It maps over combinedData and renders a UserPhotoCard component for each user-photo pair.






9. Export
jsx
Copy code
export default UserPhotoGallery;
The UserPhotoGallery component is exported so it can be used in other parts of the application.
