type ProfilePictureProps = {
  src: string;
  name: string;
};

function ProfilePicture({ src, name }: ProfilePictureProps) {
  const firstLetter = name.trim().charAt(0).toUpperCase() || "P";

  if (src) {
    return (
      <img
        className="profile-picture"
        src={src}
        alt={name}
        draggable="false"
      />
    );
  }

  return (
    <span className="profile-picture profile-picture-fallback">
      {firstLetter}
    </span>
  );
}

export default ProfilePicture;
