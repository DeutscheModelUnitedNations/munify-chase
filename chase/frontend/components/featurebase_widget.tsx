"use client"; // NextJS 13 requires this. Remove if you are using NextJS 12 or lower
import { useEffect } from "react";
import Script from "next/script";

const Featurebase = () => {
  useEffect(() => {
    const win = window as any;

    if (typeof win.Featurebase !== "function") {
      win.Featurebase = function () {
        // eslint-disable-next-line prefer-rest-params
        (win.Featurebase.q = win.Featurebase.q || []).push(arguments);
      };
    }
    win.Featurebase("initialize_portal_widget", {
      organization: 'dmun', // required
      placement: 'right', // optional
      fullScreen: false, // optional
      initialPage: 'MainView', // optional (MainView, RoadmapView, CreatePost, PostsView, ChangelogView)
    });
  }, []);

  return (
    <>
      <Script src="https://do.featurebase.app/js/sdk.js" id="featurebase-sdk" />
    </>
  );
};

export default Featurebase;