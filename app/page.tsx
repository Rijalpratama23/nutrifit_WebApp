import Image from "next/image";
import LandingPage from "./(landing)/page";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-light font-primary">
      <LandingPage />
      
    </div>
  );
}
