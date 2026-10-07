import { CenterPillFillButton } from "../../components/ui/Buttons";

export default function NotFound() {
  return (
    <>
      <div className="mt-8 flex flex-col justify-center items-center gap-10">
        <h1 className="text-2xl md:text-3xl lg:text-5xl text-center p-2">
          We couldn't find the page you're looking for :(
        </h1>
        <div className=" flex justify-center items-center">
          <CenterPillFillButton to="/">Go Home?</CenterPillFillButton>
        </div>
      </div>
    </>
  );
}
