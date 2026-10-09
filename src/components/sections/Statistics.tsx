import {
  Shirt,
  Sparkles,
  Users,
  Trophy,
} from "lucide-react";

const Statistics = () => {
  return (
    <section className="-mt-16 relative z-20">
      <div className="mx-auto max-w-7xl px-8">

        <div className="grid gap-6 rounded-3xl bg-white p-8 shadow-xl md:grid-cols-2 lg:grid-cols-4">

          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-pink-100 p-4">
              <Users className="text-pink-500" size={32} />
            </div>

            <div>
              <h2 className="text-3xl font-bold">300+</h2>
              <p className="text-gray-500">
                Happy Clients
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-pink-100 p-4">
              <Shirt className="text-pink-500" size={32} />
            </div>

            <div>
              <h2 className="text-3xl font-bold">60+</h2>
              <p className="text-gray-500">
                Costumes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-pink-100 p-4">
              <Sparkles className="text-pink-500" size={32} />
            </div>

            <div>
              <h2 className="text-3xl font-bold">80+</h2>
              <p className="text-gray-500">
                Wig Styling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-pink-100 p-4">
              <Trophy className="text-pink-500" size={32} />
            </div>

            <div>
              <h2 className="text-3xl font-bold">5 Years</h2>
              <p className="text-gray-500">
                Experience
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Statistics;