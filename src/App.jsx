// components:

import { TicTacToe } from "./sections/games/TicTacToe.jsx";
import { Countdown } from "./sections/tools/Countdown.jsx";
import { MouseGame } from "./sections/games/MouseGame.jsx";
import { Clicker } from "./sections/games/Clicker.jsx";
import { useLayoutEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Nav from "./sections/navigation/Nav.tsx";
import { ToDoList } from "./sections/tools/TodoList.jsx";
import { SidewaysSam } from "./sections/games/SidewaysSam.jsx";
import { UltimateTicTacToe } from "./sections/games/UltimateTicTacToe.jsx";
import { Pokedex } from "./sections/games/Pokedex.jsx";
import { VideoTranslator } from "./sections/tools/VideoTranslator.jsx";
import { VideoRater } from "./sections/tools/VideoRater.jsx";
import { BaseConverter } from "./sections/tools/BetterBaseConverter.tsx";
import Games from "./sections/games/Games.tsx";
import Tools from "./sections/tools/Tools.tsx";
import Comments from "./Comments.jsx";
import Login from "./sections/home/Login.jsx";
import Register from "./sections/home/Register.jsx";
import Tos from "./sections/home/Tos.jsx";
import Account from "./sections/home/Account.jsx";
import { NO_COMMENTS_PAGES } from "./sections/utils/constants.ts";
import { getSection } from "./sections/utils/section.ts";
import FrontPage from "./sections/home/FrontPage.jsx";
import Project from "./sections/projects/Projects.jsx";
import ProjectCaseStudy from "./sections/projects/ProjectCaseStudy.tsx";
import ContactMe from "./sections/home/ContactMe.tsx";
import Footer from "./sections/Footer.tsx";
import NotFound from "./sections/home/NotFound.jsx";
function App() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    document.documentElement.dataset.section = getSection(pathname);
  }, [pathname]);
  return (
    // min-h-dvh + flex-col with a flex-1 main keeps the footer pinned to the bottom on short pages
    <div className="flex min-h-dvh flex-col">
      <Nav />
      <main className="flex-1">
        {/* Actual content */}
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
          <Route path="/countdown" element={<Countdown />} />
          <Route path="/todo" element={<ToDoList />} />
          <Route path="/mouse" element={<MouseGame />} />
          <Route path="/clicker" element={<Clicker />} />
          <Route path="/ultimatetictactoe" element={<UltimateTicTacToe />} />
          <Route path="/sidewayssam" element={<SidewaysSam />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/videotranslator" element={<VideoTranslator />} />
          <Route path="/videorater" element={<VideoRater />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/projects/:slug" element={<ProjectCaseStudy />} />
          <Route path="/games" element={<Games />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/baseconverter" element={<BaseConverter />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tos" element={<Tos />} />
          <Route path="/account" element={<Account />} />
          <Route path="/contactme" element={<ContactMe />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
        {/* Comments */}
        <Routes>
          {NO_COMMENTS_PAGES.map((page) => {
            return <Route key={page} path={page} element={<></>} />;
          })}
          <Route path="/*" element={<Comments />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
