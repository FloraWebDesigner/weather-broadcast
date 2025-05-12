import { VoiceSSRCards } from "@/components/voice/voice-cards";
import { motion } from "framer-motion";

export const voices = ["Amy", "Mary", "John", "Mike", "Linda"];

export function VoiceTable({
  onVoiceSelect,
}: {
  onVoiceSelect: (voice: string) => void;
}) {
  // Animation variants for the container
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for each card
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative mt-8 w-full mx-auto px-4">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6"
      >
        {voices.map((voice, index) => (
          <motion.div 
            key={voice}
            variants={item}
            whileHover={{
              rotate: index % 2 === 0 ? 2 : -2,
              scale: 1.05,
              zIndex: 10,
              transition: { duration: 0.2 }
            }}
            initial={{
              rotate: index % 3 === 0 ? -1 : index % 3 === 1 ? 1.5 : 0.5,
            }}
            className="origin-center"
          >
            <VoiceSSRCards
              voice={voice}
              onSelect={onVoiceSelect}
              rotation={index % 3 === 0 ? -1 : index % 3 === 1 ? 1.5 : 0.5}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}