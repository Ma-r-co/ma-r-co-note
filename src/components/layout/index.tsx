import React from "react";
import GlobalStyle from "../../style/GlobalStyle";
import Wrapper from "./style";
import Header from "../header";
import Footer from "../footer";
import { PageProps } from "gatsby";

interface LayoutProps {
  location: PageProps["location"];
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  const { location, children } = props;
  let isHome;
  const rootPath = `${__PATH_PREFIX__}/`;
  if (location.pathname === rootPath) {
    isHome = true;
  } else {
    isHome = false;
  }
  return (
    <Wrapper>
      <Header className={isHome ? "isHome" : "notHome"} isHome={isHome} />
      <main className={isHome ? "isHome content" : "notHome content"}>
        {children}
      </main>
      <Footer />
      <GlobalStyle />
    </Wrapper>
  );
};

export default Layout;
