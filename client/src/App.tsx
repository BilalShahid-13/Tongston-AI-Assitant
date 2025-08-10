// src/App.tsx
import { useEffect } from "react";
import Navbar from "./components/header/navbar";
import { Layout } from "./components/sidebar/layout";
import { useCurriculumStore } from "./store/curriculumStore";

function App() {
  const { loadExcel } = useCurriculumStore();
  useEffect(() => {
    loadExcel();
  }, []);

  return (
    <>
      <Navbar />
      <Layout />
    </>
  );
}

export default App;
