import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
}

const SectionTitle = ({ title }: SectionTitleProps) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.5,
      }}
      className="mb-3 text-center"
    >
      <div className="mb-2 flex items-center justify-center gap-3 text-[#DCA9F7]">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#E7C9F8]" />

        <span className="text-sm">✿</span>

        <span className="text-xs tracking-[0.35em] text-[#DCA9F7]">
          KAWAII COLLECTION
        </span>

        <span className="text-sm">✿</span>

        <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#E7C9F8]" />
      </div>

      <h2 className="text-3xl font-bold tracking-wide text-gray-800 sm:text-4xl">
        {title}
      </h2>

      <div className="mx-auto mt-3 flex items-center justify-center gap-2">
        <span className="h-1 w-1 rounded-full bg-[#D6A9EE]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#C572DE]" />
        <span className="h-1 w-1 rounded-full bg-[#D6A9EE]" />
      </div>
    </motion.div>
  );
};

export default SectionTitle;