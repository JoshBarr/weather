import { CgSpinner } from "react-icons/cg";
import { Delayed } from "./Delayed";

export const Spinner = () => {
  return <CgSpinner className="animate-spin" color="rgba(0,0,0,0.5)" />;
};

export const SpinnerInline = () => {
  return (
    <CgSpinner className="animate-spin inline-block" color="rgba(0,0,0,0.5)" />
  );
};
