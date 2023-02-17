import Head from "next/head";
import styles from "@weather/styles/Home.module.css";
import { WeatherView } from "@weather/components/WeatherView";
import { GetServerSideProps } from "next";

interface WeatherAppProps {
  defaultLocations: { lat: string; long: string }[];
}

export default function WeatherApp(props: WeatherAppProps) {
  return (
    <>
      <Head>
        <title>Weather</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} bg-slate-100`}>
        <WeatherView />
      </main>
    </>
  );
}
