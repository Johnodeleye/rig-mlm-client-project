import { Suspense } from "react";
import Register from "./components/Register";
import { Shield } from "lucide-react";

const Page = () => {
  return (
    <Suspense fallback={      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#0660D3] rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div className="text-[#0660D3] font-semibold">Working...</div>
          <div className="mt-4 w-8 h-8 border-4 border-[#0660D3] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>}>
      <Register />
    </Suspense>
  );
};

export default Page;
