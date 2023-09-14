import Navbar from "weaviate-gui/components/navbar";
import { type AppType } from "next/dist/shared/lib/utils";
import "weaviate-gui/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />;
    </>
  );
};

export default MyApp;
