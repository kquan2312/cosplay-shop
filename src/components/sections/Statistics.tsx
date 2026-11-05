import {
  Shirt,
  Sparkles,
  Users,
  Trophy,
} from "lucide-react";

const Statistics = () => {
  return (
    <section className="relative z-20 -mt-10 sm:-mt-16">
      <div className="mx-auto max-w-7xl px-3 sm:px-8">

        <div className="grid gap-4 rounded-3xl bg-white p-4 shadow-xl sm:gap-6 sm:p-8 md:grid-cols-2 lg:grid-cols-4">

          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-pink-100 p-3 sm:p-4">
              <Users className="text-pink-500" size={26} />
            </div>

            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">300+</h2>
              <p className="text-gray-500">
                Happy Clients
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-pink-100 p-3 sm:p-4">
              <Shirt className="text-pink-500" size={26} />
            </div>

            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">60+</h2>
              <p className="text-gray-500">
                Costumes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-pink-100 p-3 sm:p-4">
              <Sparkles className="text-pink-500" size={26} />
            </div>

            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">80+</h2>
              <p className="text-gray-500">
                Wig Styling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-pink-100 p-3 sm:p-4">
              <Trophy className="text-pink-500" size={26} />
            </div>

            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">5 Years</h2>
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
