import { Toaster } from "react-hot-toast";
import Header from "../header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Header>
        <main
          style={{ backgroundColor: "var(--background-color)", flexGrow: 1 }}
        >
          {children}
        </main>
      </Header>
    </>
  );
};

export default Layout;
