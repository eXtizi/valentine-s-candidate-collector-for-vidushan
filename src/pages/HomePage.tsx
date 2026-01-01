import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Heart, Sparkles, Send, Instagram, CheckCircle2,
  ChevronDown, User, Mail, Phone, Link as LinkIcon,
  Briefcase, MessageSquare, Calendar
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Toaster, toast } from 'sonner';
import { api } from '@/lib/api-client';
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  instagram: z.string()
    .min(2, "Social handle is required")
    .startsWith("@", "Handle must start with @")
    .refine((val) => val.length > 1, "Please enter a valid handle"),
  linkedIn: z.string().url("Must be a valid URL").or(z.literal("")),
  resumeUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  experienceLevel: z.string().min(1, "Please select an experience level"),
  motivation: z.string().min(20, "Please tell us a bit more (min 20 characters)"),
  dateIdea: z.string().min(10, "Give us some details about your perfect date"),
  availability: z.string().min(5, "Tell us when you're free around Feb 14th"),
});
type FormValues = z.infer<typeof formSchema>;
function Confetti() {
  const particles = Array.from({ length: 40 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: i % 2 === 0 ? '#e11d48' : '#fbbf24',
            left: '50%',
            top: '50%',
          }}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: 0,
            scale: 1,
            x: (Math.random() - 0.5) * 600,
            y: (Math.random() - 0.5) * 600,
          }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
function ValentineIllustration() {
  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center p-8 cursor-pointer group"
      initial="initial"
      whileHover="hover"
    >
      <motion.div
        className="absolute w-64 h-64 bg-rose-500/10 dark:bg-rose-500/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="relative z-10"
        animate={{
          y: [0, -12, 0],
          rotate: [0, -1, 1, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-[320px] drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M100 160C100 160 30 120 30 70C30 45 50 30 70 30C85 30 95 40 100 50C105 40 115 30 130 30C150 30 170 45 170 70C170 120 100 160 100 160Z"
            variants={{
              initial: { fill: "#f8fafc", stroke: "#e2e8f0" },
              hover: { fill: "#e11d48", stroke: "#be123c" }
            }}
            transition={{ duration: 0.6 }}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <motion.text
            x="100" y="105" textAnchor="middle"
            className="font-display font-bold text-5xl select-none"
            variants={{
              initial: { fill: "#94a3b8" },
              hover: { fill: "#ffffff" }
            }}
            transition={{ duration: 0.4 }}
          >
            V
          </motion.text>
          <motion.g variants={{ initial: { opacity: 0, scale: 0 }, hover: { opacity: 1, scale: 1 } }}>
            <path d="M160 40L165 30L170 40L180 45L170 50L165 60L160 50L150 45L160 40Z" fill="#fbbf24" />
            <path d="M40 140L45 130L50 140L60 145L50 150L45 160L40 150L30 145L40 140Z" fill="#fbbf24" />
          </motion.g>
        </svg>
      </motion.div>
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-rose-500/10"
        variants={{
          initial: { opacity: 0, scale: 0.9 },
          hover: { opacity: 1, scale: 1.2 }
        }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      />
    </motion.div>
  );
}
export function HomePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      instagram: "@",
      linkedIn: "",
      resumeUrl: "",
      experienceLevel: "",
      motivation: "",
      dateIdea: "",
      availability: "",
    },
  });
  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await api('/api/candidates', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      setSubmitted(true);
      toast.success("Application sent successfully! Good luck.");
      formContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      toast.error("Something went wrong. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };
  const scrollToApply = () => {
    document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const scrollToAbout = () => {
    document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const nextStep = async () => {
    const fields = step === 1 
      ? ['name', 'email', 'phone', 'instagram'] 
      : step === 2 
        ? ['experienceLevel'] 
        : [];
    const isValid = await form.trigger(fields as any);
    if (isValid) {
      setStep(prev => Math.min(prev + 1, 3));
      formContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <ThemeToggle />
        <Toaster richColors position="top-center" />
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden rounded-4xl bg-rose-50/30 dark:bg-rose-950/10 mb-12 border border-rose-100 dark:border-rose-900/30">
          <div className="absolute inset-0 bg-gradient-mesh opacity-5 pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold mb-8 border border-rose-200 uppercase tracking-widest floating">
              <Sparkles className="w-3.5 h-3.5 fill-rose-500" /> Valentine's 2025 Exclusive
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter mb-8 leading-none">
              The <span className="text-gradient">Valentine</span> Quest
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto text-pretty">
              Vidushan is looking for more than just a date. He's looking for a connection. 
              Are you the one to complete the picture?
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button size="lg" onClick={scrollToApply} className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-12 h-16 text-xl font-bold shadow-xl shadow-rose-200 dark:shadow-none transition-all hover:scale-105">
                Join the Quest
              </Button>
              <Button size="lg" variant="outline" onClick={scrollToAbout} className="rounded-full px-12 h-16 text-xl border-rose-200 text-rose-600 hover:bg-rose-50 transition-all">
                The Story
              </Button>
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer hidden md:block"
            onClick={scrollToAbout}
          >
            <ChevronDown className="w-8 h-8 text-rose-300" />
          </motion.div>
        </section>
        {/* About Section */}
        <section id="about-section" className="py-24 scroll-mt-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-5xl font-display font-bold tracking-tight">Meet Vidushan</h2>
              <div className="space-y-6">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Vidushan is an architect of experiences, a visionary who believes that the most meaningful connections 
                  happen at the intersection of ambition and authenticity.
                </p>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  This Valentine's Day, he's stepping away from the ordinary to find someone who challenges his perspective, 
                  shares his drive, and understands the art of a good conversation.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                {['Visionary', 'Romantic', 'Ambitious', 'Authentic'].map((tag) => (
                  <div key={tag} className="px-6 py-2.5 rounded-full bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold text-sm">
                    {tag}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="aspect-square rounded-[3rem] overflow-hidden shadow-3xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900 relative flex items-center justify-center group"
            >
              <ValentineIllustration />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          </div>
        </section>
        {/* Application Form */}
        <section id="apply-form" className="py-32 scroll-mt-24" ref={formContainerRef}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-display font-bold mb-6">The Application</h2>
              <p className="text-xl text-muted-foreground">Your journey begins with a few honest words. We can't wait to meet you.</p>
            </div>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] dark:shadow-rose-950/20 bg-background overflow-hidden rounded-4xl">
                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800">
                      <Progress value={(step / 3) * 100} className="h-full bg-rose-500 rounded-none transition-all duration-700" />
                    </div>
                    <CardContent className="p-10 md:p-16">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                          {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                              <h3 className="text-2xl font-bold flex items-center gap-3"><User className="w-6 h-6 text-rose-500" /> Basics</h3>
                              <div className="grid md:grid-cols-2 gap-8">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-lg font-semibold">Full Name</FormLabel>
                                    <FormControl><Input placeholder="Jane Doe" className="h-14 rounded-xl text-lg px-6" {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                                <FormField control={form.control} name="instagram" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-lg font-semibold">Instagram Handle</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Instagram className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input placeholder="@username" className="pl-14 h-14 rounded-xl text-lg" {...field} />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                              </div>
                              <div className="grid md:grid-cols-2 gap-8">
                                <FormField control={form.control} name="email" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-lg font-semibold">Email</FormLabel>
                                    <FormControl><Input type="email" placeholder="jane@example.com" className="h-14 rounded-xl text-lg px-6" {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                                <FormField control={form.control} name="phone" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-lg font-semibold">Phone <span className="text-sm font-normal text-muted-foreground">(Optional)</span></FormLabel>
                                    <FormControl><Input placeholder="+1 (555) 000-0000" className="h-14 rounded-xl text-lg px-6" {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                              </div>
                            </motion.div>
                          )}
                          {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                              <h3 className="text-2xl font-bold flex items-center gap-3"><Briefcase className="w-6 h-6 text-rose-500" /> Background</h3>
                              <FormField control={form.control} name="experienceLevel" render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-lg font-semibold">Professional Chapter</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="h-14 rounded-xl text-lg px-6"><SelectValue placeholder="Where are you in life?" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="early">Early Career / Student</SelectItem>
                                      <SelectItem value="mid">Mid-level Professional</SelectItem>
                                      <SelectItem value="senior">Senior / Executive</SelectItem>
                                      <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                                      <SelectItem value="creative">Creative Soul</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <div className="grid md:grid-cols-2 gap-8">
                                <FormField control={form.control} name="linkedIn" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-lg font-semibold">LinkedIn <span className="text-sm font-normal text-muted-foreground">(Optional)</span></FormLabel>
                                    <FormControl><Input placeholder="https://..." className="h-14 rounded-xl text-lg px-6" {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                                <FormField control={form.control} name="resumeUrl" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-lg font-semibold">Portfolio <span className="text-sm font-normal text-muted-foreground">(Optional)</span></FormLabel>
                                    <FormControl><Input placeholder="https://..." className="h-14 rounded-xl text-lg px-6" {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                              </div>
                            </motion.div>
                          )}
                          {step === 3 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                              <h3 className="text-2xl font-bold flex items-center gap-3"><MessageSquare className="w-6 h-6 text-rose-500" /> Heart & Soul</h3>
                              <FormField control={form.control} name="motivation" render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-lg font-semibold">Why you and Vidushan?</FormLabel>
                                  <FormControl><Textarea placeholder="What's the spark we should know about?" className="min-h-[160px] rounded-2xl text-lg p-6 resize-none" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <div className="grid md:grid-cols-2 gap-8">
                                <FormField control={form.control} name="dateIdea" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-lg font-semibold">Your Ideal Date</FormLabel>
                                    <FormControl><Textarea placeholder="Surprise him..." className="min-h-[120px] rounded-2xl text-lg p-6 resize-none" {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                                <FormField control={form.control} name="availability" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-lg font-semibold">Availability (Feb 14-16)</FormLabel>
                                    <FormControl><Textarea placeholder="Friday night works best..." className="min-h-[120px] rounded-2xl text-lg p-6 resize-none" {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                              </div>
                            </motion.div>
                          )}
                          <div className="flex gap-5 pt-6">
                            {step > 1 && (
                              <Button type="button" variant="outline" onClick={() => setStep(prev => prev - 1)} className="h-16 px-10 rounded-2xl text-lg font-bold border-rose-100 text-rose-500">
                                Back
                              </Button>
                            )}
                            {step < 3 ? (
                              <Button type="button" onClick={nextStep} className="flex-1 h-16 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xl font-bold shadow-lg shadow-rose-100">
                                Next Step
                              </Button>
                            ) : (
                              <Button type="submit" disabled={loading} className="flex-1 h-16 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xl font-bold shadow-lg shadow-rose-100">
                                {loading ? "Sealing the Envelope..." : "Submit Application"}
                              </Button>
                            )}
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-16 bg-white dark:bg-slate-900 rounded-[3rem] shadow-3xl border border-rose-100 relative overflow-hidden"
                >
                  <Confetti />
                  <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-8 floating">
                    <CheckCircle2 className="w-12 h-12 text-rose-500" />
                  </div>
                  <h3 className="text-4xl font-display font-bold mb-4">Quest Joined!</h3>
                  <p className="text-xl text-muted-foreground mb-12 max-w-md mx-auto">
                    Your application is safe with us. Vidushan's team will review and 
                    reach out if there's a match. Keep an eye on your DMs!
                  </p>
                  <Button variant="outline" onClick={() => { setSubmitted(false); setStep(1); form.reset(); }} className="rounded-full h-14 px-10 text-lg font-bold border-rose-100 text-rose-600">
                    Send Another?
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
        <footer className="py-16 text-center text-muted-foreground border-t border-rose-100/50 mt-12">
          <p className="text-sm font-bold uppercase tracking-widest text-rose-300 mb-2">Established 2025</p>
          <p className="text-base">Vidushan's Valentine Quest • Elegance, Ambition, Connection</p>
        </footer>
      </div>
    </div>
  );
}