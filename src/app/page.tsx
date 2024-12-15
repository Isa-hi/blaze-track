
import { Card, CardContent } from "@/components/ui/card";
import CreateForm from "@/components/landing-page/CreateForm";

export default function HabitTrackerForm() {
  return (
    <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
      <Card className="w-full max-w-md bg-zinc-950 border-zinc-800">
        <CardContent className="pt-6">
          <div className="space-y-2 mb-4">
            <h1 className="text-2xl font-bold text-orange-500">
              Blaze<span className="text-white">Track</span>
            </h1>
          </div>
          <CreateForm />
        </CardContent>
      </Card>
    </div>
  );
}
