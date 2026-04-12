import { motion } from "motion/react";
import { Heart } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10"
      >
        <div className="flex items-center justify-center mb-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Heart className="text-brand-rose-dark fill-brand-rose-dark w-8 h-8" />
          </motion.div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-serif text-brand-rose-dark mb-4">
          Candice
        </h1>
        
        <p className="text-xl md:text-2xl font-serif italic text-brand-olive mb-8">
          Son Baptême
        </p>
        
        <div className="h-px w-24 bg-brand-gold mx-auto mb-8" />
        
        <p className="text-lg md:text-xl tracking-[0.2em] uppercase text-slate-600">
          Samedi 11 Juillet 2026
        </p>
        <p className="text-md md:text-lg text-slate-500 mt-2">
          Treillières & Ferme de Mazerolle
        </p>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 border border-brand-rose rounded-full opacity-20" />
        <div className="absolute bottom-10 right-10 w-48 h-48 border border-brand-gold rounded-full opacity-10" />
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-brand-rose rounded-full opacity-30" />
        <div className="absolute bottom-1/4 right-1/3 w-6 h-6 bg-brand-gold rounded-full opacity-20" />
      </div>
    </section>
  );
}
