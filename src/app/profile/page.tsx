import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl text-gray-900 font-bold mb-4">Profile</h1>

          <div className="text-gray-700 mb-2">
            Name:{" "}
            <span className="font-semibold">{session.user?.name}</span>
          </div>

          <div className="text-gray-700 mb-2">
            Email:{" "}
            <span className="font-semibold">{session.user?.email}</span>
          </div>

          {session.user?.image && (
            <div className="text-gray-700 mb-2">
              <p>Image Profile:</p>
              <Image
                src={session.user.image}
                alt="Profile"
                width={100}
                height={100}
                className="w-16 h-16 rounded-full mt-4"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
