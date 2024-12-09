import React, { useEffect, useReducer } from "react";
import axios from "axios";
import "./UserPhotoGallery.css";

const FETCH_START = "FETCH_START";
const FETCH_SUCCESS = "FETCH_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";

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

const UserPhotoGallery = () => {
  const initialState = {
    users: [],
    photos: [],
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(galleryReducer, initialState);

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

  if (state.loading) {
    return <div>Loading users and photos...</div>;
  }

  if (state.error) {
    return <div>Error: {state.error}</div>;
  }

  if (state.users.length === 0 || state.photos.length === 0) {
    return <div>No users or photos available.</div>;
  }

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

export default UserPhotoGallery;
