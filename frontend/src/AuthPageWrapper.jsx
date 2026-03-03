export default function AuthPageWrapper({
  imageUrl = "/leftSideImage.png",
  imageAlt = "leftSideImage",
  children,
}) {
  return (
    <div className="auth-page">
      <div className="left-column">
        <img src={imageUrl} alt={imageAlt} />
      </div>

      <div className="right-column bg-white">
        {children}
      </div>
    </div>
  );
}
