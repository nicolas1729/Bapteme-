import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RSVP } from "@/src/types";
import { CheckCircle2, Loader2, Users, LogIn, LogOut, Trash2 } from "lucide-react";
import confetti from "canvas-confetti";
import { db, auth, handleFirestoreError, OperationType } from "@/src/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth";

const ADMIN_EMAIL = "ns.chevrier@gmail.com";

export default function RSVPForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [showAdminView, setShowAdminView] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<RSVP>({
    defaultValues: {
      adults: 1,
      children: 0,
      attendingCeremony: false,
      attendingLunch: false,
      attendingDinner: false,
      sleepingOnSite: false,
      notAttending: false,
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser?.email === ADMIN_EMAIL);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdmin && showAdminView) {
      const q = query(collection(db, "rsvps"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RSVP));
        setRsvps(data);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, "rsvps");
      });
      return () => unsubscribe();
    }
  }, [isAdmin, showAdminView]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setShowAdminView(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "rsvps", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `rsvps/${id}`);
    }
  };

  const onSubmit = async (data: RSVP) => {
    setIsSubmitting(true);
    try {
      const rsvpData = {
        ...data,
        createdAt: Date.now(),
      };
      
      await addDoc(collection(db, "rsvps"), rsvpData);
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fce4ec', '#f06292', '#d4af37']
      });
      reset();
    } catch (error) {
      setIsSubmitting(false);
      handleFirestoreError(error, OperationType.CREATE, "rsvps");
    }
  };

  if (isAdmin && showAdminView) {
    const totalAdults = rsvps.reduce((acc, r) => acc + (r.adults || 0), 0);
    const totalChildren = rsvps.reduce((acc, r) => acc + (r.children || 0), 0);
    
    const ceremonyCount = rsvps.reduce((acc, r) => 
      r.attendingCeremony ? acc + (r.adults || 0) + (r.children || 0) : acc, 0);
    
    const lunchCount = rsvps.reduce((acc, r) => 
      r.attendingLunch ? acc + (r.adults || 0) + (r.children || 0) : acc, 0);
    
    const dinnerCount = rsvps.reduce((acc, r) => 
      r.attendingDinner ? acc + (r.adults || 0) + (r.children || 0) : acc, 0);
    
    const sleepCount = rsvps.reduce((acc, r) => 
      r.sleepingOnSite ? acc + (r.adults || 0) + (r.children || 0) : acc, 0);
    
    const absentCount = rsvps.reduce((acc, r) => 
      r.notAttending ? acc + (r.adults || 0) + (r.children || 0) : acc, 0);

    return (
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif text-brand-olive">Liste des Réponses</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAdminView(false)}>Retour au formulaire</Button>
            <Button variant="ghost" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" /> Déconnexion</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-8">
          <StatCard label="Adultes" value={totalAdults} />
          <StatCard label="Enfants" value={totalChildren} />
          <StatCard label="Mairie" value={ceremonyCount} />
          <StatCard label="Midi" value={lunchCount} />
          <StatCard label="Soir" value={dinnerCount} />
          <StatCard label="Dodo" value={sleepCount} />
          <StatCard label="Absent" value={absentCount} />
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-rose/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-brand-rose/20 text-brand-rose-dark uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4">Nom</th>
                  <th className="p-4">Pers.</th>
                  <th className="p-4">Mairie</th>
                  <th className="p-4">Midi</th>
                  <th className="p-4">Soir</th>
                  <th className="p-4">Dodo</th>
                  <th className="p-4">Absent</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-beige">
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-brand-beige/30 transition-colors">
                    <td className="p-4 font-medium">{rsvp.name}</td>
                    <td className="p-4">{rsvp.adults}A / {rsvp.children}E</td>
                    <td className="p-4">{rsvp.attendingCeremony ? "✅" : "❌"}</td>
                    <td className="p-4">{rsvp.attendingLunch ? "✅" : "❌"}</td>
                    <td className="p-4">{rsvp.attendingDinner ? "✅" : "❌"}</td>
                    <td className="p-4">{rsvp.sleepingOnSite ? "✅" : "❌"}</td>
                    <td className="p-4">{rsvp.notAttending ? "🚫" : "✅"}</td>
                    <td className="p-4 text-sm text-slate-500 max-w-xs truncate" title={rsvp.message}>
                      {rsvp.message || "-"}
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="icon" onClick={() => rsvp.id && handleDelete(rsvp.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto py-20 px-4 text-center"
      >
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-brand-rose">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-serif text-brand-olive mb-2">Merci beaucoup !</h2>
          <p className="text-slate-600">
            Votre réponse a bien été enregistrée. Nous avons hâte de vous voir pour célébrer le baptême de Candice.
          </p>
          <Button 
            variant="outline" 
            className="mt-6 border-brand-rose text-brand-rose-dark hover:bg-brand-rose"
            onClick={() => setIsSubmitted(false)}
          >
            Envoyer une autre réponse
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <section className="py-20 px-4 max-w-2xl mx-auto" id="rsvp">
      <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden">
        <CardHeader className="bg-brand-rose/30 text-center py-10 relative">
          {isAdmin && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-4 right-4 text-brand-rose-dark"
              onClick={() => setShowAdminView(true)}
            >
              <Users className="w-4 h-4 mr-2" /> Voir les réponses
            </Button>
          )}
          {!user && (
             <Button 
             variant="ghost" 
             size="sm" 
             className="absolute top-4 left-4 text-slate-400 opacity-20 hover:opacity-100"
             onClick={handleLogin}
           >
             <LogIn className="w-4 h-4" />
           </Button>
          )}
          <CardTitle className="text-4xl font-serif text-brand-rose-dark">Confirmation de Présence</CardTitle>
          <CardDescription className="text-brand-olive italic">
            Merci de nous répondre avant le 30 Mai 2026
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-black">Nom de la famille / Personne</Label>
              <Input 
                id="name" 
                placeholder="Ex: Famille Martin" 
                {...register("name", { required: "Ce champ est obligatoire" })}
                className="border-brand-rose/50 focus-visible:ring-brand-rose-dark text-black placeholder:text-slate-400"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adults" className="text-black">Nombre d'adultes</Label>
                <Input 
                  id="adults" 
                  type="number" 
                  min={1}
                  {...register("adults", { valueAsNumber: true })}
                  className="border-brand-rose/50 focus-visible:ring-brand-rose-dark text-black"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="children" className="text-black">Nombre d'enfants</Label>
                <Input 
                  id="children" 
                  type="number" 
                  min={0}
                  {...register("children", { valueAsNumber: true })}
                  className="border-brand-rose/50 focus-visible:ring-brand-rose-dark text-black"
                />
              </div>
            </div>

            <div className="space-y-4 bg-brand-beige/50 p-6 rounded-2xl">
              <p className="font-normal text-black mb-2">Serez-vous parmi nous ?</p>
              
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="notAttending" 
                  checked={watch("notAttending")}
                  onCheckedChange={(checked) => {
                    const isNotAttending = checked as boolean;
                    setValue("notAttending", isNotAttending);
                    if (isNotAttending) {
                      setValue("attendingCeremony", false);
                      setValue("attendingLunch", false);
                      setValue("attendingDinner", false);
                      setValue("sleepingOnSite", false);
                      setValue("adults", 0);
                      setValue("children", 0);
                    } else {
                      setValue("adults", 1);
                    }
                  }}
                />
                <Label htmlFor="notAttending" className="cursor-pointer font-normal text-black">Ne sera malheureusement pas présent 😔</Label>
              </div>

              {!watch("notAttending") && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 pt-4 border-t border-brand-rose/20"
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="attendingCeremony" 
                      checked={watch("attendingCeremony")}
                      onCheckedChange={(checked) => setValue("attendingCeremony", checked as boolean)}
                    />
                    <Label htmlFor="attendingCeremony" className="cursor-pointer font-normal text-black">Présent à la cérémonie (Mairie) 🏛️</Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="attendingLunch" 
                      checked={watch("attendingLunch")}
                      onCheckedChange={(checked) => setValue("attendingLunch", checked as boolean)}
                    />
                    <Label htmlFor="attendingLunch" className="cursor-pointer font-normal text-black">Présent au déjeuner 🍴</Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="attendingDinner" 
                      checked={watch("attendingDinner")}
                      onCheckedChange={(checked) => setValue("attendingDinner", checked as boolean)}
                    />
                    <Label htmlFor="attendingDinner" className="cursor-pointer font-normal text-black">Présent au dîner 🌙</Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="sleepingOnSite" 
                      checked={watch("sleepingOnSite")}
                      onCheckedChange={(checked) => setValue("sleepingOnSite", checked as boolean)}
                    />
                    <Label htmlFor="sleepingOnSite" className="cursor-pointer font-normal text-black">Dort sur place (en dortoir) 🛌</Label>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-black">Un petit mot pour Candice ?</Label>
              <Textarea 
                id="message" 
                placeholder="Votre message..." 
                {...register("message")}
                className="border-brand-rose/50 focus-visible:ring-brand-rose-dark min-h-[100px] text-black placeholder:text-slate-400"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-brand-rose-dark hover:bg-brand-rose-dark/90 text-white rounded-full py-6 text-lg font-medium transition-all transform hover:scale-[1.02]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer ma réponse"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-rose/20 text-center">
      <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-serif text-brand-rose-dark">{value}</p>
    </div>
  );
}
