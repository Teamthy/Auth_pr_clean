export default function AuthPageWrapper({
  imageUrl = "/leftSideImage.jpg",
  imageAlt = "leftSideImage",
  compact = false,
  children,
}) {
  const frameClassName = compact ? "auth-frame auth-frame--compact" : "auth-frame";
  const pageClassName = compact ? "auth-page auth-page--compact" : "auth-page";

  return (
    <div className="auth-shell">
      <div className={frameClassName}>
        <div className={pageClassName}>
          <div className="left-column">
            <img src={imageUrl} alt={imageAlt} />
          </div>

          <div className="right-column bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
