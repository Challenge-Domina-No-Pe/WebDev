import { Outlet } from "react-router-dom";

export default function CopaPabLayout() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Copa Passa a Bola</h2>
      <div className="border rounded-lg p-4">
        <Outlet />
      </div>
    </div>
  );
}