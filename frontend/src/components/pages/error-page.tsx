import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export default function ErrorPage() {
    const navigate = useNavigate();
    // const error = useRouteError() as { statusText?: string; message?: string };

  return (
    <div className="w-full h-screen flex flex-col items-center gap-4 text-center mt-10">
        <img src="/images/ERROR_IMAGE.png" width={"30%"} height={400} />
        <h1 className="text-2xl font-bold">Ups... Something went wrong...</h1>
        <h2>The page you are trying to access is not available</h2>
        <Button onClick={() => navigate("/")} variant={"default"}>Go back to the home page</Button>

    </div>
  );
}
