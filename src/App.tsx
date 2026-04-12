/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Hero from "./components/Hero";
import Program from "./components/Program";
import RSVPForm from "./components/RSVPForm";
import Countdown from "./components/Countdown";
import { motion } from "motion/react";

export default function App() {
  return (
    <div className="min-h-screen selection:bg-brand-rose selection:text-brand-rose-dark">
      <main>
        <Hero />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <Countdown />
        </motion.div>

        <Program />
        
        <div className="bg-brand-rose/10 py-20">
          <RSVPForm />
        </div>
      </main>

      <footer className="py-12 text-center text-slate-400 text-sm font-light border-t border-brand-rose/20">
        <p className="font-serif italic text-lg text-brand-olive mb-2">Baptême de Candice</p>
        <p>Samedi 11 Juillet 2026 • Treillières</p>
        <p className="mt-4 opacity-50">Fait avec amour pour Candice</p>
      </footer>
    </div>
  );
}
