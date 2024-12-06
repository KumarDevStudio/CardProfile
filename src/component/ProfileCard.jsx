

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserPhotoGallery.css";

const UserPhotoCard = ({ user, photo }) => {
  return (
    <div className="user-photo-card">
      <div className="photo-info">
        <img src={photo.thumbnailUrl} alt={photo.title} />
      </div>
      <div className="user-info">
        <h3>{user.name}</h3>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <p>City: {user.address.city}</p>
      </div>
      
    </div>
  );
};

const UserPhotoGallery = () => {
  const [users, setUsers] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersAndPhotos = async () => {
      try {
        setLoading(true);

        const [userResponse, photoResponse] = await Promise.all([
          axios.get("https://jsonplaceholder.typicode.com/users"),
          axios.get("https://jsonplaceholder.typicode.com/photos?_limit=10"),
        ]);

        setUsers(userResponse.data);
        setPhotos(photoResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setUsers([]);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndPhotos();
  }, []);

  if (loading) {
    return <div>Loading users and photos...</div>;
  }

  if (users.length === 0 || photos.length === 0) {
    return <div>No users or photos available.</div>;
  }

  const combinedData = users.map((user, index) => ({
    user,
    photo: photos[index % photos.length], 
  }));

  return (
    <div className="user-photo-gallery">
      {combinedData.map(({ photo, user}) => (
        <UserPhotoCard key={user.id} user={user} photo={photo} />
      ))}
    </div>
  );
};

export default UserPhotoGallery;