export default function LandingFrame() {
  return (
    <>
      <iframe
        title="Math Editor"
        style={{
          width: "100%",
          height: "100vh",
        }}
        src={`${process.env.PUBLIC_URL}/math/landing.html`}
      />
    </>
  );
}
