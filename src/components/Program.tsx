import { motion } from "motion/react";
import { MapPin, Clock, Utensils, Bed } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const events = [
  {
    time: "11:00",
    title: "Cérémonie Civile",
    location: "Mairie de Treillières",
    address: "Place de la République, 44119 Treillières",
    icon: Clock,
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Mairie+de+Treillieres",
    description: "Nous nous retrouverons à la mairie pour célébrer ce moment important."
  },
  {
    time: "13:00",
    title: "Déjeuner de Fête",
    location: "Ferme du Marais de Mazerolles",
    address: "Ferme du Marais de Mazerolles, 44850 Saint-Mars-du-Désert",
    icon: Utensils,
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Ferme+du+Marais+de+Mazerolles+Saint+Mars+du+Desert",
    description: "Déjeuner convivial et après-midi de fête. Prévoyez un maillot de bain et n'hésitez pas à apporter des jeux d'extérieur !"
  },
  {
    time: "20:00",
    title: "Dîner & Soirée",
    location: "Ferme du Marais de Mazerolles",
    address: "Ferme du Marais de Mazerolles, 44850 Saint-Mars-du-Désert",
    icon: Utensils,
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Ferme+du+Marais+de+Mazerolles+Saint+Mars+du+Desert",
    description: "La fête continue avec un dîner convivial et une soirée dansante."
  },
  {
    time: "Nuit",
    title: "Hébergement",
    location: "Ferme du Marais de Mazerolles",
    address: "Ferme du Marais de Mazerolles, 44850 Saint-Mars-du-Désert",
    icon: Bed,
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Ferme+du+Marais+de+Mazerolles+Saint+Mars+du+Desert",
    description: "Des couchages en dortoir sont disponibles sur place pour ceux qui souhaitent prolonger la fête."
  }
];

export default function Program() {
  return (
    <section className="py-20 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-serif text-center text-brand-olive mb-12">Le Programme</h2>
        
        <div className="grid gap-8">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="bg-brand-rose p-3 rounded-full">
                    <event.icon className="w-6 h-6 text-brand-rose-dark" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-serif">{event.title}</CardTitle>
                    <p className="text-brand-gold font-medium">{event.time}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{event.description}</p>
                  <Separator className="my-4 bg-brand-beige" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-2 text-sm text-slate-500">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{event.address}</span>
                    </div>
                    <a
                      href={event.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-brand-rose-dark hover:underline flex items-center gap-1"
                    >
                      Ouvrir dans Maps
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
