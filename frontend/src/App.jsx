import Navbar from "./pages/Navbar";
import Hero from "./pages/Hero";
import About from "./pages/About";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import BookDemo from "./pages/BookDemo";
import Contact from "./pages/Contact";
import Footer from "./pages/Footer";

import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <Hero />

      <About />
      <Services />
      <Pricing />
      <BookDemo />
      <Contact />

      <Footer />
    </>
  );
}

export default App;