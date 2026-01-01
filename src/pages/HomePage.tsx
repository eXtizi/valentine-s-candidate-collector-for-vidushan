import React, { useState } from 'react';
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
  instagram: z.string().min(1, "Social handle is required").startsWith("@", "Handle must start with @"),
  linkedIn: z.string().url("Must be a valid URL").or(z.literal("")),
  resumeUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  experienceLevel: z.string().min(1, "Please select an experience level"),
  motivation: z.string().min(20, "Please tell us a bit more (min 20 characters)"),
  dateIdea: z.string().min(10, "Give us some details about your perfect date"),
  availability: z.string().min(5, "Tell us when you're free around Feb 14th"),
});
type FormValues = z.infer<typeof formSchema>;
export function HomePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
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
      toast.success("Application sent successfully!");
    } catch (error) {
      toast.error("Failed to send application. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const scrollToApply = () => {
    document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
  };
  const nextStep = async () => {
    const fields = step === 1
      ? ['name', 'email', 'phone', 'instagram']
      : step === 2
        ? ['linkedIn', 'resumeUrl', 'experienceLevel']
        : ['motivation', 'dateIdea', 'availability'];
    const isValid = await form.trigger(fields as any);
    if (isValid) setStep(prev => Math.min(prev + 1, 3));
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <ThemeToggle />
        <Toaster richColors />
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900 mb-12 border border-rose-100/50">
          <div className="absolute inset-0 bg-gradient-mesh opacity-10 pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold mb-6 border border-rose-100 uppercase tracking-widest">
              <Heart className="w-3 h-3 fill-current" /> Valentine's 2025 Quest
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-6">
              Win a Date with <span className="bg-gradient-to-r from-rose-600 to-amber-500 bg-clip-text text-transparent">Vidushan</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              This February 14th, join Vidushan for an evening of elegance and connection.
              We're looking for someone authentic, ambitious, and ready for a memorable experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={scrollToApply} className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-8 h-14 text-lg">
                Apply Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })} className="rounded-full px-8 h-14 text-lg border-rose-200 text-rose-600 hover:bg-rose-50">
                Who is Vidushan?
              </Button>
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer hidden md:block"
            onClick={scrollToApply}
          >
            <ChevronDown className="w-6 h-6 text-muted-foreground" />
          </motion.div>
        </section>
        {/* About Section */}
        <section className="py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-display font-bold">The Man of the Hour</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Vidushan is a blend of modern ambition and classic romance. He values intellect,
                a great sense of humor, and the ability to appreciate the small moments that make
                life beautiful. Whether it's a quiet rooftop lounge or a hidden gallery opening,
                he knows how to curate an evening.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  <span className="text-sm font-medium">Visionary</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span className="text-sm font-medium">Kind-hearted</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border">
                  <Briefcase className="w-4 h-4 text-rose-500" />
                  <span className="text-sm font-medium">Driven</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-rose-100 relative group"
            >
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1000"
                alt="Portrait"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-600/20 to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </section>
        {/* Application Form */}
        <section id="apply-form" className="py-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold mb-4">Official Application</h2>
              <p className="text-muted-foreground">This is where your story starts. Tell us everything.</p>
            </div>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="border-none shadow-2xl bg-background overflow-hidden">
                    <div className="h-2 bg-slate-100">
                      <Progress value={(step / 3) * 100} className="h-full bg-rose-500 rounded-none transition-all duration-500" />
                    </div>
                    <CardContent className="p-8 md:p-12">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                          {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                              <h3 className="text-xl font-semibold flex items-center gap-2"><User className="w-5 h-5 text-rose-500" /> Personal Details</h3>
                              <div className="grid md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl><Input placeholder="Jane Doe" className="h-12" {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                                <FormField control={form.control} name="instagram" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Instagram Handle</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input placeholder="@username" className="pl-10 h-12" {...field} />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                              </div>
                              <div className="grid md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="email" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="email" placeholder="jane@example.com" className="pl-10 h-12" {...field} /></div></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                                <FormField control={form.control} name="phone" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="+1 (555) 000-0000" className="pl-10 h-12" {...field} /></div></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                              </div>
                            </motion.div>
                          )}
                          {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                              <h3 className="text-xl font-semibold flex items-center gap-2"><Briefcase className="w-5 h-5 text-rose-500" /> Background</h3>
                              <div className="grid md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="linkedIn" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>LinkedIn Profile</FormLabel>
                                    <FormControl><div className="relative"><LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="https://linkedin.com/in/..." className="pl-10 h-12" {...field} /></div></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                                <FormField control={form.control} name="resumeUrl" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Resume/Portfolio Link</FormLabel>
                                    <FormControl><div className="relative"><LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="https://..." className="pl-10 h-12" {...field} /></div></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                              </div>
                              <FormField control={form.control} name="experienceLevel" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Professional/Life Experience</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="h-12"><SelectValue placeholder="Select one..." /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="early">Early Career / Student</SelectItem>
                                      <SelectItem value="mid">Mid-level Professional</SelectItem>
                                      <SelectItem value="senior">Senior / Executive</SelectItem>
                                      <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                                      <SelectItem value="creative">Creative Professional</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )} />
                            </motion.div>
                          )}
                          {step === 3 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                              <h3 className="text-xl font-semibold flex items-center gap-2"><MessageSquare className="w-5 h-5 text-rose-500" /> Motivation & Vibe</h3>
                              <FormField control={form.control} name="motivation" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Why do you want to date Vidushan?</FormLabel>
                                  <FormControl><Textarea placeholder="Tell us your story..." className="min-h-[120px] resize-none" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <div className="grid md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="dateIdea" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Your Ideal Date Idea</FormLabel>
                                    <FormControl><Textarea placeholder="Be creative!" className="min-h-[100px] resize-none" {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                                <FormField control={form.control} name="availability" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Availability (Feb 14-16, 2025)</FormLabel>
                                    <FormControl><div className="relative"><Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" /><Textarea placeholder="I'm free on Friday evening..." className="pl-10 min-h-[100px] resize-none" {...field} /></div></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                              </div>
                            </motion.div>
                          )}
                          <div className="flex gap-4">
                            {step > 1 && (
                              <Button type="button" variant="outline" onClick={() => setStep(prev => prev - 1)} className="h-14 px-8 rounded-xl">
                                Back
                              </Button>
                            )}
                            {step < 3 ? (
                              <Button type="button" onClick={nextStep} className="flex-1 h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-lg font-semibold">
                                Continue
                              </Button>
                            ) : (
                              <Button type="submit" disabled={loading} className="flex-1 h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-lg font-semibold">
                                {loading ? "Processing..." : "Submit Application"}
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
                  className="text-center p-12 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-rose-100"
                >
                  <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-rose-500" />
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-3">Quest Joined!</h3>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Thank you for applying. Vidushan's team will review your application and
                    reach out via Instagram or Email if there's a spark.
                  </p>
                  <Button variant="outline" onClick={() => { setSubmitted(false); setStep(1); form.reset(); }} className="rounded-full">
                    Send Another
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
        <footer className="py-12 text-center text-muted-foreground border-t border-border/50">
          <p className="text-sm font-medium">Made with ❤️ for Vidushan's Valentine Quest 2025</p>
        </footer>
      </div>
    </div>
  );
}