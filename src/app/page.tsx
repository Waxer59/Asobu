import APIKeyForm from "@/components/api-key-form";

export default function Page() {
  return (
    <div className="grid h-screen place-items-center">
      <div className="flex flex-col gap-4 border-2 border-white px-14 py-10 rounded-md">
        <h1>Bienvenido</h1>
        <APIKeyForm />
      </div>
    </div>
  );
}
