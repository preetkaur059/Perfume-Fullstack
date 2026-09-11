import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCurrentUser, useLogout } from "@/hooks/auth/useAuth";

const Profile = () => {
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useCurrentUser();
  const logout = useLogout();

  if (isError) {
    navigate("/login", { replace: true });
  }

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch {
      toast.error("Unable to log out. Please try again.");
    }
  };

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-32">

      <div className="max-w-3xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">
            My Profile
          </h1>

          <p className="text-gray-400 mt-2">
            Manage your account details
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl">

          {/* Account Information */}
          <div className=" border-white/10 ">

            <h3 className="text-xl font-semibold mb-5">
              Account Information
            </h3>

            {/* Full Name */}
            <div className="mb-5">
              <label className="block text-gray-400 text-sm mb-2">
                Full Name
              </label>

              <div className="bg-black border border-gray-700 rounded-lg px-4 py-3">
                {user.fullName}
              </div>
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">
                Email Address
              </label>

              <div className="bg-black border border-gray-700 rounded-lg px-4 py-3">
                {user.email}
              </div>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">

            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3 rounded-lg
              bg-gradient-to-b from-lime-200 to-lime-300
              text-black font-bold
              hover:scale-[1.02]
              transition duration-300 cursor-pointer"
            >
              Continue Shopping
            </button>

            <button
              onClick={handleLogout}
              disabled={logout.isPending}
              className="flex-1 py-3 rounded-lg
              border border-red-500/50
              text-red-400 font-semibold
              hover:bg-red-500/10
              transition duration-300 cursor-pointer"
            >
              {logout.isPending ? "Logging out..." : "Logout"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
